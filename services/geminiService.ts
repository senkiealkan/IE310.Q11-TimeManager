import { GoogleGenAI } from "@google/genai";
import { Task, AppUsage, UserMood } from "../types";

export const getAIAdvice = async (
  tasks: Task[],
  usage: AppUsage[],
  currentFocusScore: number,
  mood: UserMood
): Promise<string> => {
  // Always verify if API_KEY is available and create a new instance right before the call.
  if (!process.env.API_KEY) {
    return "Please set your API Key to unlock the AI Focus Coach! 🧠";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const incompleteTasks = tasks.filter(t => !t.completed).map(t => t.title).join(", ");
  const topDistraction = usage.sort((a, b) => b.minutes - a.minutes)[0];

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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Extracting text output from response using the .text property as per guidelines.
    return response.text?.trim() || "Keep pushing! You're doing great. Focus on one task at a time. 🚀";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Keep pushing! You're doing great. Focus on one task at a time. 🚀";
  }
};