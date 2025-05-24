
"use client";

import React, { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileStats } from '@/lib/analysis';
import { analyzeSampleFolder } from './actions';
import { useAnalysisStore } from '@/store/analysis-store';

export default function AnalyzePage() {
  const [analysisResults, setAnalysisResults] = useState<FileStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { setAnalyzedData } = useAnalysisStore();

  const handleAnalyze = () => {
    setIsLoading(true);
    setError(null);
    startTransition(async () => {
      try {
        const { files, folderPath } = await analyzeSampleFolder();
        setAnalysisResults(files);
        setAnalyzedData(files, folderPath); // Store full path for AI use
        toast({
          title: "Analysis Complete",
          description: `Analyzed ${files.length} file(s) from the sample folder.`,
        });
      } catch (err: any) {
        setError(err.message || "An unknown error occurred during analysis.");
        toast({
          title: "Analysis Failed",
          description: err.message || "Could not analyze the sample folder.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Folder Analysis</CardTitle>
          <CardDescription className="text-lg">
            Analyze text files from a predefined sample folder on the server (<code>public/sample_data</code>).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <Info className="h-6 w-6 text-accent" />
            <p className="text-sm text-foreground">
              This tool analyzes <code>.txt</code> files located in the <code>public/sample_data</code> directory on the server. 
              Results will be displayed below. You can then generate an AI-enhanced report based on this analysis.
            </p>
          </div>

          <Button onClick={handleAnalyze} disabled={isLoading || isPending} className="mb-6">
            {isLoading || isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Analyze Sample Folder
          </Button>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          {analysisResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Analysis Results</h2>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead className="text-right">Words</TableHead>
                      <TableHead className="text-right">Lines</TableHead>
                      <TableHead className="text-right">Characters</TableHead>
                      <TableHead className="text-right">Unique Words</TableHead>
                      <TableHead className="text-right">Avg. Word Len</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResults.map((file) => (
                      <TableRow key={file.filename}>
                        <TableCell className="font-medium">{file.filename}</TableCell>
                        <TableCell className="text-right">{file.wordCount}</TableCell>
                        <TableCell className="text-right">{file.lineCount}</TableCell>
                        <TableCell className="text-right">{file.characterCount}</TableCell>
                        <TableCell className="text-right">{file.uniqueWords}</TableCell>
                        <TableCell className="text-right">{file.avgWordLength}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
