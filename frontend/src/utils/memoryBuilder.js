export function buildChatMemory(messages) {
    const relevant = messages.filter(msg => msg.role === "user" || msg.role === "assistant");
  
    const summarized = relevant
      .slice(-6) // ניקח רק את 6 ההודעות האחרונות (אפשר לשנות)
      .map(msg => {
        const prefix = msg.role === "user" ? "👤 המשתמש:" : "🤖 העוזר:";
        return `${prefix} ${msg.content}`;
      })
      .join("\n");
  
    return summarized;
  }
  