import { GoogleGenAI } from "@google/genai";
// FIX: Import UserMood type to use in function signature.
import { Task, AppUsage, UserMood } from "../types";

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
  currentFocusScore: number,
  // FIX: Accept user's mood to provide more personalized advice.
  mood: UserMood
): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "Please set your API Key to unlock the AI Focus Coach! 🧠";
  }

  const incompleteTasks = tasks.filter(t => !t.completed).map(t => t.title).join(", ");
  const topDistraction = usage.sort((a, b) => b.minutes - a.minutes)[0];

  // FIX: Update prompt to include mood and instruct the AI to consider it.
  const prompt = `
    Act as a friendly, cool, and motivating productivity coach for a university student.
    User Context:
    - Current Mood: ${mood}
    - Current Focus Score: ${currentFocusScore}/100
    - Top Distraction: ${topDistraction.name} (${topDistraction.minutes} mins today)
    - Pending Tasks: ${incompleteTasks}

    Give a short, punchy (max 2 sentences) motivational tip or call to action. 
    Tailor your message based on the user's current mood. For example, if they're tired, be gentle. If they're energized, be more hype.
    Use emojis. Be empathetic but firm about the distraction.
  `;

  try {
    // FIX: Update model to 'gemini-3-flash-preview' as per guidelines.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // FIX: Safely access and trim the response text, providing a fallback.
    return response.text?.trim() || "Keep pushing! You're doing great. Focus on one task at a time. 🚀";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Keep pushing! You're doing great. Focus on one task at a time. 🚀";
  }
};
