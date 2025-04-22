import { buildChatMemory } from "../utils/memoryBuilder"; // ✅ ייבוא חובה
import { buildHairSalonPrompt } from "../prompts/buildHairSalonPrompt";

export async function sendMessageToGPT(userMessage, businessData, messages, customerName = "", customerPhone = "") {
  const today = new Date().toISOString().split("T")[0];
  const chatMemory = buildChatMemory(messages);
  const systemPrompt = buildHairSalonPrompt(businessData, today, chatMemory, customerName, customerPhone);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    console.error("OpenAI API Error:", data);
    throw new Error("GPT failed to respond");
  }

  console.log("Raw GPT response:", data.choices[0].message.content);
  return data.choices[0].message.content;
}
