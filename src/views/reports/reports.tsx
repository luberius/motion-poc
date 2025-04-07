import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSnapshot, subscribe } from "valtio";
import { reportJobStore, formatTime } from "../../store/job";

import "./reports.css";

const ReportGeneratorPage: React.FC = () => {
  const jobState = useSnapshot(reportJobStore);

  const [prompt, setPrompt] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  // Update current time for real-time durations
  useEffect(() => {
    // Update time every 500ms for smoother updates
    const timer = setInterval(() => {
      setNow(new Date());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // Subscribe to job events to show alerts
  useEffect(() => {
    // Keep track of completed and failed job counts
    let lastCompleted = jobState.jobs.filter(
      (job) => job.status === "completed",
    ).length;
    let lastFailed = jobState.jobs.filter(
      (job) => job.status === "failed",
    ).length;

    // Use a separate effect to monitor job state changes
    const unsubscribe = subscribe(reportJobStore, () => {
      const completedCount = reportJobStore.jobs.filter(
        (job) => job.status === "completed",
      ).length;
      const failedCount = reportJobStore.jobs.filter(
        (job) => job.status === "failed",
      ).length;

      // Check if a new completion occurred
      if (completedCount > lastCompleted) {
        showJobAlert("success");
      }
      // Check if a new failure occurred
      else if (failedCount > lastFailed) {
        showJobAlert("error");
      }

      // Update our tracking variables
      lastCompleted = completedCount;
      lastFailed = failedCount;
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Add new job to queue
  const queueReport = () => {
    if (!prompt.trim()) return;

    reportJobStore.queueReport(prompt);
    setPrompt("");
  };

  // Show and hide alert
  const showJobAlert = (type: "success" | "error") => {
    setAlertType(type);
    setShowAlert(true);

    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Get status badge for jobs
  const getStatusBadge = (
    status: "queued" | "processing" | "completed" | "failed",
  ) => {
    switch (status) {
      case "queued":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Queued
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Calculate and format duration in real-time
  const getRealTimeDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return "-";

    // Use end time if completed, or current time if in progress
    const end = endTime || now;
    const durationMs = end.getTime() - startTime.getTime();

    // Format to show minutes and seconds
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="container p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Report Generator
            </CardTitle>
            <CardDescription>
              Enter your prompt below to generate a customized report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe the report you want to generate..."
                className="min-h-32 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              {showAlert && alertType === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Alert
                    variant="default"
                    className="bg-green-50 border-green-200"
                  >
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your report has been successfully generated.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {showAlert && alertType === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to generate your report. Please try again.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              onClick={queueReport}
              disabled={!prompt.trim()}
              className="w-full sm:w-auto"
            >
              Generate Report
            </Button>

            <div className="text-sm text-muted-foreground">
              {jobState.processingCount > 0 && (
                <span className="flex items-center">
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  {jobState.processingCount} report
                  {jobState.processingCount > 1 ? "s" : ""} processing
                </span>
              )}
              {jobState.queuedJobCount > 0 && (
                <span className="ml-4">
                  {jobState.queuedJobCount} job
                  {jobState.queuedJobCount > 1 ? "s" : ""} queued
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Generation History</CardTitle>
            <CardDescription>
              Track the status and progress of your report generation jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobState.jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reports have been generated yet. Start by creating your first
                report!
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Prompt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobState.jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono text-sm">
                          {formatTime(job.startTime)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {job.prompt.substring(0, 40)}
                          {job.prompt.length > 40 ? "..." : ""}
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          {job.status === "processing" ? (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full animate-progress" />
                            </div>
                          ) : job.status === "queued" ? (
                            <span className="text-xs italic">
                              Waiting to start
                            </span>
                          ) : job.status === "completed" ? (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="h-2.5 bg-green-600 rounded-full w-full" />
                            </div>
                          ) : (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="h-2.5 bg-red-500 rounded-full w-full" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell
                          className={
                            job.status === "processing"
                              ? "font-mono text-blue-600"
                              : ""
                          }
                        >
                          {getRealTimeDuration(job.startTime, job.endTime)}
                        </TableCell>
                        <TableCell>
                          {job.status === "completed" && (
                            <Button variant={"secondary"} size="sm">
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportGeneratorPage;
