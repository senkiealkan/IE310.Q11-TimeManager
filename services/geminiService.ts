import { GoogleGenAI } from "@google/genai";
import { Task, AppUsage } from "../types";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const getAIAdvice = async (
  tasks: Task[],
  usage: AppUsage[],
  currentFocusScore: number
): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "Please set your API Key to unlock the AI Focus Coach! 🧠";
  }

  const incompleteTasks = tasks.filter(t => !t.completed).map(t => t.title).join(", ");
  const topDistraction = usage.sort((a, b) => b.minutes - a.minutes)[0];

  const prompt = `
    Act as a friendly, cool, and motivating productivity coach for a university student.
    User Context:
    - Current Focus Score: ${currentFocusScore}/100
    - Top Distraction: ${topDistraction.name} (${topDistraction.minutes} mins today)
    - Pending Tasks: ${incompleteTasks}

    Give a short, punchy (max 2 sentences) motivational tip or call to action. 
    Use emojis. Be empathetic but firm about the distraction.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Keep pushing! You're doing great. Focus on one task at a time. 🚀";
  }
};