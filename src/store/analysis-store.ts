import { create } from 'zustand';
import type { FileStats as FullFileStats } from '@/lib/analysis';

// For AI Report, we only need specific fields from FileStats
export interface ReportGenerationData {
  filename: string;
  wordCount: number;
  lineCount: number;
  uniqueWords: number;
  avgWordLength: number;
}

// The store will hold the full stats for display, and the specific path for the AI
interface AnalysisState {
  analyzedFiles: FullFileStats[];
  sampleFolderPathOnServer: string | null; 
  setAnalyzedData: (files: FullFileStats[], folderPath: string | null) => void;
  getReportGenerationData: () => ReportGenerationData[];
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  analyzedFiles: [],
  sampleFolderPathOnServer: null,
  setAnalyzedData: (files, folderPath) => set({ analyzedFiles: files, sampleFolderPathOnServer: folderPath }),
  getReportGenerationData: () => {
    return get().analyzedFiles.map(file => ({
      filename: file.filename,
      wordCount: file.wordCount,
      lineCount: file.lineCount,
      uniqueWords: file.uniqueWords,
      avgWordLength: file.avgWordLength,
    }));
  },
}));
