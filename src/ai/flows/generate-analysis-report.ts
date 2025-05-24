// src/ai/flows/generate-analysis-report.ts
'use server';
/**
 * @fileOverview Generates an AI-enhanced analysis report for a given folder.
 *
 * - generateAiEnhancedAnalysisReport - A function that generates the AI-enhanced report.
 * - GenerateAiEnhancedAnalysisReportInput - The input type for the generateAiEnhancedAnalysisReport function.
 * - GenerateAiEnhancedAnalysisReportOutput - The return type for the generateAiEnhancedAnalysisReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiEnhancedAnalysisReportInputSchema = z.object({
  folderPath: z.string().describe('The path to the folder containing the .txt files to analyze.'),
  reportData: z.array(
    z.object({
      filename: z.string(),
      wordCount: z.number(),
      lineCount: z.number(),
      uniqueWords: z.number(),
      avgWordLength: z.number(),
    })
  ).describe('Array of report data'),
});

export type GenerateAiEnhancedAnalysisReportInput = z.infer<typeof GenerateAiEnhancedAnalysisReportInputSchema>;

const GenerateAiEnhancedAnalysisReportOutputSchema = z.object({
  report: z.string().describe('The AI-enhanced analysis report in CSV format.'),
});

export type GenerateAiEnhancedAnalysisReportOutput = z.infer<typeof GenerateAiEnhancedAnalysisReportOutputSchema>;

export async function generateAiEnhancedAnalysisReport(
  input: GenerateAiEnhancedAnalysisReportInput
): Promise<GenerateAiEnhancedAnalysisReportOutput> {
  return generateAiEnhancedAnalysisReportFlow(input);
}

const analyzeFileContent = ai.defineTool({
  name: 'analyzeFileContent',
  description: 'Analyzes the content of a file and determines its sentiment and complexity.',
  inputSchema: z.object({
    filename: z.string().describe('The name of the file being analyzed.'),
    fileContent: z.string().describe('The content of the file.'),
  }),
  outputSchema: z.object({
    sentiment: z.string().describe('The sentiment of the file content (e.g., positive, negative, neutral).'),
    complexity: z.string().describe('The complexity of the file content (e.g., simple, moderate, complex).'),
  }),
},
async (input) => {
  // This is a placeholder implementation.
  // In a real application, this would call an actual sentiment analysis and complexity analysis service.
  console.log("Analyzing file content for sentiment and complexity...");
  return {
    sentiment: 'neutral',
    complexity: 'moderate',
  };
});

const prompt = ai.definePrompt({
  name: 'generateAiEnhancedAnalysisReportPrompt',
  input: {schema: GenerateAiEnhancedAnalysisReportInputSchema},
  output: {schema: GenerateAiEnhancedAnalysisReportOutputSchema},
  tools: [analyzeFileContent],
  prompt: `You are an expert report generator. You are provided with data from several text files, and are asked to generate a CSV report that includes AI-driven sentiment and complexity analysis for each file.

Here's the folder path: {{{folderPath}}}

Here's the data:
{{#each reportData}}
  Filename: {{{filename}}}, Word Count: {{{wordCount}}}, Line Count: {{{lineCount}}}, Unique Words: {{{uniqueWords}}}, Avg Word Length: {{{avgWordLength}}}
{{/each}}

Based on the folder path and data, generate a CSV report with the following columns: Filename, Word Count, Line Count, Unique Words, Avg Word Length, Sentiment, Complexity.

Use the analyzeFileContent tool to determine the sentiment and complexity of each file.

Ensure the report is well-formatted and easy to read.
`,
});

const generateAiEnhancedAnalysisReportFlow = ai.defineFlow(
  {
    name: 'generateAiEnhancedAnalysisReportFlow',
    inputSchema: GenerateAiEnhancedAnalysisReportInputSchema,
    outputSchema: GenerateAiEnhancedAnalysisReportOutputSchema,
  },
  async input => {
    const reportWithAiData = await Promise.all(
      input.reportData.map(async fileData => {
        // Read the file content here and pass it to the tool
        const fs = require('fs').promises;
        const filePath = `${input.folderPath}/${fileData.filename}`
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const analysisResults = await analyzeFileContent({
            filename: fileData.filename,
            fileContent: fileContent,
          });
          return {
            ...fileData,
            sentiment: analysisResults.sentiment,
            complexity: analysisResults.complexity,
          };
        } catch (error: any) {
          console.error(`Error reading file ${fileData.filename}: ${error.message}`);
          return {
            ...fileData,
            sentiment: 'N/A',
            complexity: 'N/A',
          };
        }
      })
    );

    // After enriching with AI insights, format into CSV
    const csvHeader = 'Filename,Word Count,Line Count,Unique Words,Avg Word Length,Sentiment,Complexity\n';
    const csvRows = reportWithAiData.map(
      fileData =>
        `${fileData.filename},${fileData.wordCount},${fileData.lineCount},${fileData.uniqueWords},${fileData.avgWordLength},${fileData.sentiment},${fileData.complexity}`
    );

    const csvReport = csvHeader + csvRows.join('\n');

    const {output} = await prompt({
      ...input,
      reportData: reportWithAiData,
    });

    return {
      report: csvReport,
    };
  }
);
