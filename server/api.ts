import Groq from 'groq-sdk';
import { Hono } from 'hono';
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { auth } from './auth';


if (!process.env.GROQ_API_KEY) {
  throw new Error('Please set the GROQ_API_KEY environment variable');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const app = new Hono().on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw)).post('/generate', zValidator('json', z.object({
  content: z.string().min(10),
})), async (c) => {
  const { content } = await c.req.json();
  const data = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that creates flashcards for studying. Generate 5-10 flashcards based on the content provided. Format each flashcard as a JSON object with "question" and "answer" fields. Put all of the JSON objects in one contiguous JSON array.'
      },
      {
        role: 'user',
        content: `Create study flashcards from this content: ${content}`
      }
    ],
    temperature: 0.7,
  })

  // Parse the response to extract flashcards
  const assistantMessage = data.choices[0]?.message?.content;

  if (!assistantMessage) {
    throw new Error('Failed to generate flashcards');
  }

  // Extract JSON array from the message
  const jsonStartIndex = assistantMessage.indexOf('[');
  const jsonEndIndex = assistantMessage.lastIndexOf(']') + 1;
  const jsonString = assistantMessage.substring(jsonStartIndex, jsonEndIndex);

  // console.log(assistantMessage);
  const flashcards = JSON.parse(jsonString);

  return c.json({ flashcards });
})

export type App = typeof app;
export default app;