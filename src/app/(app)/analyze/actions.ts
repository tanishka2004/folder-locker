"use server";

import fs from 'fs/promises';
import path from 'path';
import { analyzeTextContent, type FileStats } from '@/lib/analysis';

const SAMPLE_DATA_FOLDER = 'public/sample_data';

export async function analyzeSampleFolder(): Promise<{ files: FileStats[], folderPath: string }> {
  const folderPath = path.join(process.cwd(), SAMPLE_DATA_FOLDER);
  let analyzedFiles: FileStats[] = [];

  try {
    const dirents = await fs.readdir(folderPath, { withFileTypes: true });
    const txtFiles = dirents.filter(dirent => dirent.isFile() && dirent.name.endsWith('.txt'));

    if (txtFiles.length === 0) {
      throw new Error(`No .txt files found in ${folderPath}. Please add sample files to ${SAMPLE_DATA_FOLDER}.`);
    }

    for (const file of txtFiles) {
      const filePath = path.join(folderPath, file.name);
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = analyzeTextContent(file.name, content);
      analyzedFiles.push(stats);
    }
    return { files: analyzedFiles, folderPath: path.join(SAMPLE_DATA_FOLDER) }; // Return relative path for client display, actual path for AI flow
  } catch (error: any) {
    console.error("Error analyzing sample folder:", error);
    // If specific error about no files, rethrow it. Otherwise, a generic error.
    if (error.message.startsWith("No .txt files found")) {
        throw error;
    }
    throw new Error(`Failed to analyze sample folder. Check server logs. Ensure '${SAMPLE_DATA_FOLDER}' exists with .txt files.`);
  }
}
