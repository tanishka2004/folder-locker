
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalysisStore, type ReportGenerationData } from '@/store/analysis-store';
import { generateAiReportAction } from './actions';
import Link from 'next/link';

export default function ReportPage() {
  const [reportCsv, setReportCsv] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const { getReportGenerationData, sampleFolderPathOnServer, analyzedFiles } = useAnalysisStore(state => ({
    getReportGenerationData: state.getReportGenerationData,
    sampleFolderPathOnServer: state.sampleFolderPathOnServer,
    analyzedFiles: state.analyzedFiles,
  }));

  const [hasAnalysisData, setHasAnalysisData] = useState(false);

  useEffect(() => {
    setHasAnalysisData(analyzedFiles.length > 0 && !!sampleFolderPathOnServer);
  }, [analyzedFiles, sampleFolderPathOnServer]);


  const handleGenerateReport = () => {
    const reportData = getReportGenerationData();
    if (!sampleFolderPathOnServer || reportData.length === 0) {
      setError("No analysis data found. Please analyze the sample folder first on the 'Analyze Folder' page.");
      toast({
        title: "Missing Data",
        description: "Please perform folder analysis before generating a report.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setReportCsv(null);

    startTransition(async () => {
      try {
        const result = await generateAiReportAction(reportData, sampleFolderPathOnServer);
        if ('reportCsv' in result) {
          setReportCsv(result.reportCsv);
          toast({
            title: "Report Generated",
            description: "AI-enhanced CSV report has been successfully generated.",
          });
        } else {
          setError(result.error);
          toast({
            title: "Report Generation Failed",
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred during report generation.");
        toast({
          title: "Report Generation Failed",
          description: err.message || "Could not generate the report.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleDownloadCsv = () => {
    if (!reportCsv) return;
    const blob = new Blob([reportCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'ai_enhanced_analysis_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
       toast({ title: "Download Started", description: "Your report is being downloaded." });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Generate AI-Enhanced Report</CardTitle>
          <CardDescription className="text-lg">
            Create a CSV report with AI-driven sentiment and complexity analysis for the sample files.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {!hasAnalysisData && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive flex flex-col items-start space-y-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>No analysis data found. Please analyze the sample folder first.</p>
              </div>
              <Button asChild variant="link" className="p-0 h-auto text-destructive hover:underline">
                <Link href="/analyze">Go to Analyze Folder page</Link>
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <Info className="h-6 w-6 text-accent" />
            <p className="text-sm text-foreground">
              This tool uses the data from the 'Analyze Folder' step and sends it to an AI model to enrich it with sentiment and complexity scores.
              The generated report will be in CSV format.
            </p>
          </div>

          <Button onClick={handleGenerateReport} disabled={isLoading || isPending || !hasAnalysisData} className="mb-6">
            {isLoading || isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Generate Report
          </Button>

          {error && !reportCsv && ( // Only show general error if no report is displayed
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          {reportCsv && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Generated CSV Report</h2>
              <Textarea
                value={reportCsv}
                readOnly
                rows={15}
                className="bg-muted/50 font-mono text-xs resize-none"
                placeholder="CSV report content will appear here..."
              />
              <Button onClick={handleDownloadCsv} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
