"use server";

import path from 'path';
import { generateAiEnhancedAnalysisReport, type GenerateAiEnhancedAnalysisReportInput } from '@/ai/flows/generate-analysis-report';
import type { ReportGenerationData } from '@/store/analysis-store';

export async function generateAiReportAction(
  reportData: ReportGenerationData[],
  sampleFolderPath: string // This should be the relative path like 'public/sample_data'
): Promise<{ reportCsv: string } | { error: string }> {
  if (!reportData || reportData.length === 0) {
    return { error: "No analysis data provided to generate the report." };
  }
  if (!sampleFolderPath) {
    return { error: "Sample folder path is missing." };
  }

  // The AI flow expects an absolute path or a path relative to where it runs.
  // process.cwd() gives the root of the Next.js project.
  const absoluteFolderPath = path.join(process.cwd(), sampleFolderPath);

  const inputForAi: GenerateAiEnhancedAnalysisReportInput = {
    folderPath: absoluteFolderPath,
    reportData: reportData.map(file => ({
      filename: file.filename,
      wordCount: file.wordCount,
      lineCount: file.lineCount,
      uniqueWords: file.uniqueWords,
      avgWordLength: file.avgWordLength,
    })),
  };

  try {
    const result = await generateAiEnhancedAnalysisReport(inputForAi);
    return { reportCsv: result.report };
  } catch (error: any) {
    console.error("Error generating AI report:", error);
    return { error: `Failed to generate AI report: ${error.message}` };
  }
}
