export function removeJsonFromText(text) {
    return text.replace(/```json\s*[\s\S]*?```/g, "").trim();
  }
  
  export function extractJsonFromText(text) {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    const matches = [];
    let match;
    while ((match = jsonRegex.exec(text)) !== null) {
      try {
        matches.push(JSON.parse(match[1]));
      } catch (err) {
        console.error("❌ Failed to parse JSON block:", err);
      }
    }
    return matches;
  }
  