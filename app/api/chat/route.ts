import { GoogleGenAI } from '@google/genai'
import { getChatbotSystemInstructions } from '@/lib/chatbot'

export const runtime = 'nodejs'

const model = 'gemini-2.5-flash'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('message' in body) ||
    typeof body.message !== 'string' ||
    !body.message.trim()
  ) {
    return Response.json(
      { error: 'A non-empty message string is required.' },
      { status: 400 },
    )
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured.')
    return Response.json({ error: 'Chat service is not configured.' }, { status: 500 })
  }

  try {
    const systemInstruction = await getChatbotSystemInstructions()
    const ai = new GoogleGenAI({ apiKey })
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: body.message.trim(),
      config: {
        systemInstruction,
        abortSignal: request.signal,
      },
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text))
            }
          }
          controller.close()
        } catch (error) {
          console.error('Gemini response stream failed.', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Failed to start Gemini response stream.', error)
    return Response.json({ error: 'Unable to generate a response.' }, { status: 500 })
  }
}
