'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AudioLines,
  Bot,
  Mic,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Send,
  Volume2,
  X,
} from 'lucide-react'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  text: string
}

type SpeechPlayback = {
  messageId: number
  status: 'speaking' | 'paused'
}

type SpeechRecognitionAlternative = {
  transcript: string
}

type SpeechRecognitionResult = {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

type SpeechRecognitionEvent = {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResult>
}

type SpeechRecognitionErrorEvent = {
  error: string
}

interface BrowserSpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface BrowserSpeechRecognitionConstructor {
  new (): BrowserSpeechRecognition
}

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor
}

const welcomeMessage =
  "Hi, I'm Shaheer's portfolio assistant. Ask me about his projects, skills, or background."
const suggestions = [
  'What projects have you built?',
  'What is your tech stack?',
  'Tell me about your background',
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'assistant', text: welcomeMessage },
  ])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')
  const [speechSupported, setSpeechSupported] = useState(false)
  const [speechPlayback, setSpeechPlayback] = useState<SpeechPlayback | null>(null)
  const [speechErrorId, setSpeechErrorId] = useState<number | null>(null)
  const [autoVoice, setAutoVoice] = useState(false)
  const [recognitionSupported, setRecognitionSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeRequestRef = useRef<AbortController | null>(null)
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const shouldSubmitTranscriptRef = useRef(false)
  const transcriptRef = useRef('')
  const autoVoiceRef = useRef(false)
  const nextMessageIdRef = useRef(2)

  useEffect(() => {
    const browserWindow = window as SpeechRecognitionWindow
    setSpeechSupported(
      'speechSynthesis' in window &&
        'SpeechSynthesisUtterance' in window,
    )
    setRecognitionSupported(
      Boolean(
        browserWindow.SpeechRecognition ??
          browserWindow.webkitSpeechRecognition,
      ),
    )
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [messages, open])

  useEffect(
    () => () => {
      activeRequestRef.current?.abort()
      shouldSubmitTranscriptRef.current = false
      const recognition = recognitionRef.current
      recognitionRef.current = null
      recognition?.abort()
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        speechUtteranceRef.current
      ) {
        window.speechSynthesis.cancel()
      }
    },
    [],
  )

  function stopSpeech() {
    speechUtteranceRef.current = null
    setSpeechPlayback(null)
    setSpeechErrorId(null)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  function speakMessage(message: ChatMessage) {
    if (
      !speechSupported ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      setSpeechErrorId(message.id)
      return
    }

    const synthesis = window.speechSynthesis
    synthesis.cancel()
    setSpeechErrorId(null)

    try {
      const utterance = new SpeechSynthesisUtterance(message.text)
      speechUtteranceRef.current = utterance
      utterance.onstart = () => {
        if (speechUtteranceRef.current === utterance) {
          setSpeechPlayback({ messageId: message.id, status: 'speaking' })
        }
      }
      utterance.onend = () => {
        if (speechUtteranceRef.current === utterance) {
          speechUtteranceRef.current = null
          setSpeechPlayback(null)
        }
      }
      utterance.onerror = (event) => {
        if (speechUtteranceRef.current !== utterance) return
        speechUtteranceRef.current = null
        setSpeechPlayback(null)
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setSpeechErrorId(message.id)
        }
      }

      setSpeechPlayback({ messageId: message.id, status: 'speaking' })
      synthesis.speak(utterance)
    } catch (speechError) {
      speechUtteranceRef.current = null
      setSpeechPlayback(null)
      setSpeechErrorId(message.id)
      console.error('Unable to play assistant speech.', speechError)
    }
  }

  function toggleSpeech(message: ChatMessage) {
    const synthesis =
      typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis
        : null

    if (speechPlayback?.messageId === message.id && synthesis) {
      if (speechPlayback.status === 'speaking') {
        synthesis.pause()
        setSpeechPlayback({ ...speechPlayback, status: 'paused' })
      } else {
        synthesis.resume()
        setSpeechPlayback({ ...speechPlayback, status: 'speaking' })
      }
      return
    }

    speakMessage(message)
  }

  function stopListening(submitTranscript: boolean) {
    shouldSubmitTranscriptRef.current = submitTranscript
    if (!recognitionRef.current) {
      setIsListening(false)
      return
    }

    try {
      recognitionRef.current.stop()
    } catch (recognitionError) {
      setIsListening(false)
      recognitionRef.current = null
      if (submitTranscript && transcriptRef.current.trim()) {
        const transcript = transcriptRef.current.trim()
        setInput(transcript)
        void sendMessage(transcript)
      } else if (recognitionError instanceof Error) {
        console.error('Unable to stop voice recognition.', recognitionError)
      }
    }
  }

  function startListening() {
    const browserWindow = window as SpeechRecognitionWindow
    const Recognition =
      browserWindow.SpeechRecognition ??
      browserWindow.webkitSpeechRecognition

    if (!Recognition) {
      setVoiceError('Voice input is not supported in this browser.')
      return
    }
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setVoiceError('Microphone access requires HTTPS or localhost.')
      return
    }

    stopSpeech()
    setVoiceError('')
    transcriptRef.current = ''
    shouldSubmitTranscriptRef.current = true

    try {
      const recognition = new Recognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = navigator.language || 'en-US'
      recognitionRef.current = recognition

      recognition.onresult = (event) => {
        let interimTranscript = ''
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index]
          if (result.isFinal) {
            transcriptRef.current += `${result[0].transcript} `
          } else {
            interimTranscript += result[0].transcript
          }
        }

        const currentTranscript = `${transcriptRef.current}${interimTranscript}`
        setInput(currentTranscript.trim())
      }
      recognition.onerror = (event) => {
        shouldSubmitTranscriptRef.current = false
        const errors: Record<string, string> = {
          'not-allowed':
            'Microphone permission was denied. Allow microphone access in your browser settings and try again.',
          'service-not-allowed':
            'This browser blocked microphone access. Check your browser permissions and try again.',
          'audio-capture': 'No microphone was found. Connect a microphone and try again.',
          'no-speech': 'No speech was detected. Try speaking a little louder.',
          network: 'Voice recognition could not reach the browser speech service.',
        }
        setVoiceError(errors[event.error] ?? 'Voice recognition stopped unexpectedly.')
        setIsListening(false)
      }
      recognition.onend = () => {
        if (recognitionRef.current !== recognition) return
        recognitionRef.current = null
        setIsListening(false)

        const transcript = transcriptRef.current.trim()
        if (shouldSubmitTranscriptRef.current && transcript) {
          shouldSubmitTranscriptRef.current = false
          setInput(transcript)
          void sendMessage(transcript)
        }
      }

      recognition.start()
      setIsListening(true)
    } catch (recognitionError) {
      recognitionRef.current = null
      setIsListening(false)
      shouldSubmitTranscriptRef.current = false
      setVoiceError('Could not start voice recognition. Please try again.')
      console.error('Unable to start voice recognition.', recognitionError)
    }
  }

  function resetConversation() {
    activeRequestRef.current?.abort()
    activeRequestRef.current = null
    stopListening(false)
    stopSpeech()
    setIsStreaming(false)
    setError('')
    setMessages([
      {
        id: nextMessageIdRef.current++,
        role: 'assistant',
        text: 'Conversation reset. What would you like to know?',
      },
    ])
  }

  async function sendMessage(text: string) {
    const message = text.trim()
    if (!message || isStreaming) return

    const userMessageId = nextMessageIdRef.current++
    const responseMessageId = nextMessageIdRef.current++
    const controller = new AbortController()
    activeRequestRef.current = controller
    setError('')
    setInput('')
    setIsStreaming(true)
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: 'user', text: message },
      { id: responseMessageId, role: 'assistant', text: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      })

      if (!response.ok) {
        await response.json().catch(() => null)
        throw new Error('chat unavailable')
      }

      if (!response.body) {
        throw new Error('The chat response did not include a readable stream.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let responseText = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          if (chunk) {
            responseText += chunk
            setMessages((current) =>
              current.map((item) =>
                item.id === responseMessageId
                  ? { ...item, text: item.text + chunk }
                  : item,
              ),
            )
          }
        }

        const remaining = decoder.decode()
        if (remaining) {
          responseText += remaining
          setMessages((current) =>
            current.map((item) =>
              item.id === responseMessageId
                ? { ...item, text: item.text + remaining }
                : item,
            ),
          )
        }
      } finally {
        reader.releaseLock()
      }

      if (autoVoiceRef.current) {
        const finalText = responseText.trim()
        if (finalText) {
          speakMessage({ id: responseMessageId, role: 'assistant', text: finalText })
        }
      }
    } catch (requestError) {
      if (controller.signal.aborted) return

      console.error('Portfolio chat request failed.', requestError)
      setError(
        'We are currently unavailable. Please try again later. Sorry for the inconvenience.',
      )
      setMessages((current) =>
        current.filter((item) => item.id !== responseMessageId),
      )
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null
        setIsStreaming(false)
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isListening) stopListening(false)
    void sendMessage(input)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            key="chat-panel"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Portfolio assistant"
            className="flex h-[min(620px,calc(100dvh-6rem))] w-[min(400px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-emerald-400/25 bg-[#080d0b]/95 font-mono text-emerald-50 shadow-[0_24px_90px_rgba(0,0,0,0.65)] backdrop-blur-xl"
            style={{
              fontFamily:
                '"Space Mono", "JetBrains Mono", "Geist Mono", monospace',
            }}
          >
            <header className="flex items-center justify-between border-b border-emerald-400/15 bg-black/25 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                  <Bot aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold tracking-wide text-emerald-50">
                    SHAHEER_AI
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-100/50">
                    <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.85)]" />
                    PORTFOLIO_ASSISTANT
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const nextAutoVoice = !autoVoice
                    autoVoiceRef.current = nextAutoVoice
                    setAutoVoice(nextAutoVoice)
                  }}
                  disabled={!speechSupported}
                  aria-label={`Auto-Voice ${autoVoice ? 'on' : 'off'}`}
                  aria-pressed={autoVoice}
                  title={
                    speechSupported
                      ? 'Automatically speak each assistant response'
                      : 'Audio is under maintenance.'
                  }
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-2 text-[9px] tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    autoVoice
                      ? 'bg-amber-300/10 text-amber-200'
                      : 'text-emerald-100/45 hover:bg-emerald-300/10 hover:text-emerald-200'
                  }`}
                >
                  <Volume2 aria-hidden="true" className="size-3.5" />
                  AUTO {autoVoice ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  onClick={resetConversation}
                  aria-label="Reset conversation"
                  className="grid size-8 place-items-center rounded-lg text-emerald-100/50 transition hover:bg-emerald-300/10 hover:text-amber-300 disabled:opacity-40"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech()
                    stopListening(false)
                    setOpen(false)
                  }}
                  aria-label="Close assistant"
                  className="grid size-8 place-items-center rounded-lg text-emerald-100/50 transition hover:bg-emerald-300/10 hover:text-amber-300"
                >
                  <X aria-hidden="true" className="size-[18px]" />
                </button>
              </div>
            </header>

            <div className="flex items-center gap-2 border-b border-emerald-400/10 px-4 py-2 text-[9px] tracking-[0.16em] text-emerald-100/40">
              {isListening ? (
                <>
                  <AudioLines className="size-3 animate-pulse text-rose-300" />
                  <span className="animate-pulse text-rose-200">LISTENING</span>
                </>
              ) : speechPlayback?.status === 'speaking' ? (
                <>
                  <AudioLines className="size-3 animate-pulse text-amber-300" />
                  <span className="text-amber-200">AI SPEAKING</span>
                </>
              ) : (
                <>
                  <span className="text-emerald-300/80">●</span>
                  SESSION: ACTIVE
                </>
              )}
              <span className="ml-auto text-emerald-100/25">GEMINI 2.5 FLASH</span>
            </div>

            <div
              ref={scrollContainerRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label="Conversation"
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-4 sm:px-4"
            >
              {messages.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                    item.role === 'user'
                      ? 'self-end rounded-br-sm border border-amber-300/20 bg-amber-300/10 text-amber-50'
                      : `self-start rounded-bl-sm border bg-emerald-300/[0.07] text-emerald-50/90 ${
                          speechPlayback?.messageId === item.id
                            ? 'border-amber-300/45 shadow-[0_0_22px_rgba(252,211,77,0.08)]'
                            : 'border-emerald-300/15'
                        }`
                  }`}
                >
                  <span className="mb-1 block text-[9px] tracking-[0.12em] text-emerald-200/45">
                    {item.role === 'user' ? 'YOU' : 'ASSISTANT'}
                  </span>
                  {item.text || (
                    <span className="inline-flex items-center gap-1 py-1" aria-label="Generating response">
                      <i className="size-1 animate-pulse rounded-full bg-emerald-300" />
                      <i className="size-1 animate-pulse rounded-full bg-emerald-300 [animation-delay:150ms]" />
                      <i className="size-1 animate-pulse rounded-full bg-emerald-300 [animation-delay:300ms]" />
                    </span>
                  )}
                  {item.role === 'assistant' &&
                    item.text &&
                    !isStreaming && (
                      <div className="mt-2 flex items-center gap-2 border-t border-emerald-200/10 pt-2">
                        <button
                          type="button"
                          onClick={() => toggleSpeech(item)}
                          aria-label={
                            speechPlayback?.messageId === item.id
                              ? speechPlayback.status === 'speaking'
                                ? 'Pause spoken response'
                                : 'Resume spoken response'
                              : 'Play spoken response'
                          }
                          title={
                            speechSupported
                              ? 'Read this response aloud'
                              : 'Audio is under maintenance.'
                          }
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            speechPlayback?.messageId === item.id
                              ? 'bg-amber-300/10 text-amber-200'
                              : 'text-emerald-100/50 hover:bg-emerald-300/10 hover:text-emerald-200'
                          }`}
                        >
                          {speechPlayback?.messageId === item.id &&
                          speechPlayback.status === 'speaking' ? (
                            <>
                              <Pause aria-hidden="true" className="size-3" />
                              PAUSE
                            </>
                          ) : speechPlayback?.messageId === item.id &&
                            speechPlayback.status === 'paused' ? (
                            <>
                              <Play aria-hidden="true" className="size-3" />
                              RESUME
                            </>
                          ) : (
                            <>
                              <Volume2 aria-hidden="true" className="size-3" />
                              LISTEN
                            </>
                          )}
                        </button>
                        {speechPlayback?.messageId === item.id &&
                          speechPlayback.status === 'speaking' && (
                            <span
                              className="inline-flex items-center gap-1 text-amber-200/80"
                              aria-label="Speech is playing"
                            >
                              <AudioLines className="size-3 animate-pulse" />
                              <span className="text-[9px] tracking-wide">PLAYING</span>
                            </span>
                          )}
                        {speechErrorId === item.id && (
                          <span role="status" className="text-[9px] text-amber-200/75">
                            Audio is under maintenance.
                          </span>
                        )}
                      </div>
                    )}
                </motion.div>
              ))}

              {messages.length === 1 && (
                <div className="mt-auto flex flex-col gap-2 pt-3">
                  <p className="text-[9px] tracking-[0.13em] text-amber-200/50">
                    SUGGESTED_QUERIES
                  </p>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void sendMessage(suggestion)}
                      className="rounded-lg border border-emerald-300/15 bg-black/20 px-3 py-2 text-left text-[10px] text-emerald-100/65 transition hover:border-amber-300/35 hover:text-amber-100"
                    >
                      <span className="mr-2 text-amber-300/60">&gt;</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <p role="alert" className="self-start text-[10px] leading-relaxed text-rose-300">
                  {error}
                </p>
              )}
              {voiceError && (
                <p role="status" className="self-start text-[10px] leading-relaxed text-rose-300">
                  {voiceError}
                </p>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-emerald-400/15 bg-black/30 p-3"
            >
              <label className="sr-only" htmlFor="portfolio-chat-message">
                Ask the portfolio assistant
              </label>
              <span aria-hidden="true" className="pl-1 text-xs text-amber-300/70">
                &gt;_
              </span>
              <input
                id="portfolio-chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about the work..."
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-2 text-xs text-emerald-50 outline-none placeholder:text-emerald-100/30"
              />
              <button
                type="button"
                onClick={() => {
                  if (isListening) stopListening(true)
                  else startListening()
                }}
                disabled={!recognitionSupported || isStreaming}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                aria-pressed={isListening}
                title={
                  recognitionSupported
                    ? isListening
                      ? 'Stop recording and send transcription'
                      : 'Speak a message'
                    : 'Voice input is not supported in this browser'
                }
                className={`grid size-9 shrink-0 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                  isListening
                    ? 'animate-pulse border-rose-300/50 bg-rose-300/15 text-rose-200 shadow-[0_0_18px_rgba(251,113,133,0.18)]'
                    : 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200 hover:border-amber-300/40 hover:text-amber-200'
                }`}
              >
                {isListening ? (
                  <AudioLines aria-hidden="true" className="size-4 animate-pulse" />
                ) : (
                  <Mic aria-hidden="true" className="size-4" />
                )}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 transition hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Send aria-hidden="true" className="size-4" />
              </button>
            </form>
            <p className="bg-black/30 px-4 pb-3 text-[9px] text-emerald-100/30">
              Replies stream live · Press Enter to send
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() =>
          setOpen((current) => {
            if (current) {
              stopSpeech()
              stopListening(false)
            }
            return !current
          })
        }
        aria-expanded={open}
        aria-label={open ? 'Close portfolio assistant' : 'Open portfolio assistant'}
        className="chat-launcher--idle flex min-h-14 items-center gap-2.5 rounded-2xl border border-emerald-300/40 bg-[#0b1711] px-4 text-emerald-300 shadow-[0_8px_32px_rgba(16,185,129,0.22)] transition-colors hover:border-amber-300/50 hover:text-amber-200"
      >
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <MessageCircle aria-hidden="true" className="size-5" />
        )}
        {!open && (
          <span className="font-mono text-xs font-semibold tracking-wide">
            <span className="sm:hidden">ASK AI</span>
            <span className="hidden sm:inline">CHAT WITH AI</span>
          </span>
        )}
      </motion.button>
    </div>
  )
}
