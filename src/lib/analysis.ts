// src/lib/analysis.ts

export interface FileStats {
  filename: string;
  content?: string; // Optional: include content if needed by caller
  wordCount: number;
  lineCount: number;
  characterCount: number;
  uniqueWords: number;
  avgWordLength: number;
  wordFrequency?: Map<string, number>; // Optional, can be large
}

// Helper to tokenize words: converts to lowercase and removes basic punctuation.
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "") // Remove punctuation except whitespace
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 0); // Remove empty strings
}

export function analyzeTextContent(filename: string, content: string): FileStats {
  const lines = content.split(/\r\n|\r|\n/);
  const lineCount = lines.length;
  const characterCount = content.length;

  const words = tokenize(content);
  const wordCount = words.length;

  const wordFrequency = new Map<string, number>();
  let totalWordLength = 0;

  words.forEach(word => {
    wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    totalWordLength += word.length;
  });

  const uniqueWords = wordFrequency.size;
  const avgWordLength = wordCount > 0 ? parseFloat((totalWordLength / wordCount).toFixed(2)) : 0;

  return {
    filename,
    content, // Including content for potential display or further use by caller
    wordCount,
    lineCount,
    characterCount,
    uniqueWords,
    avgWordLength,
    // wordFrequency, // Optionally return this; can be large
  };
}
