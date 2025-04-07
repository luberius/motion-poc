// src/stores/reportJobStore.js
import { proxy, subscribe } from "valtio";

// Define the job types
export interface ReportJob {
  id: string;
  prompt: string;
  status: "queued" | "processing" | "completed" | "failed";
  startTime?: Date;
  endTime?: Date;
  result?: string;
}

// Constants
const CONCURRENT_JOBS_LIMIT = 3;

// Create the store with Valtio
export const reportJobStore = proxy({
  jobs: [] as ReportJob[],
  processingCount: 0,

  // Computed properties
  get queuedJobCount() {
    return this.jobs.filter((job: ReportJob) => job.status === "queued").length;
  },

  // Methods
  generateId() {
    return Math.random().toString(36).substring(2, 9);
  },

  queueReport(prompt: string) {
    if (!prompt.trim()) return;

    const newJob: ReportJob = {
      id: this.generateId(),
      prompt,
      status: "queued",
    };

    this.jobs = [newJob, ...this.jobs];

    // Automatically try to process the queue
    this.processQueue();
  },

  processQueue() {
    if (this.processingCount >= CONCURRENT_JOBS_LIMIT) return;

    const nextJob = this.jobs.find((job) => job.status === "queued");
    if (!nextJob) return;

    this.processJob(nextJob.id);
  },

  async processJob(jobId: string) {
    // Update job status to processing
    this.jobs = this.jobs.map((job) =>
      job.id === jobId
        ? { ...job, status: "processing", startTime: new Date() }
        : job,
    );

    // Increment processing count
    this.processingCount++;

    try {
      // Simulate an asynchronous report generation
      await this.simulateReportGeneration(jobId);

      // Update job with completion
      this.jobs = this.jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "completed",
              endTime: new Date(),
              result: `Generated report based on: "${job.prompt.substring(0, 30)}${job.prompt.length > 30 ? "..." : ""}"`,
            }
          : job,
      );
    } catch (error) {
      // Update job with failure
      this.jobs = this.jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "failed",
              endTime: new Date(),
              result: "Failed to generate report",
            }
          : job,
      );
    } finally {
      // Decrement processing count
      this.processingCount--;

      // Try to process next job in queue
      this.processQueue();
    }
  },

  // Simulate an asynchronous process that may fail
  simulateReportGeneration(_: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Random completion time between 5-15 seconds
      const completionTime = Math.floor(Math.random() * 10000) + 5000;

      setTimeout(() => {
        // 90% chance of success
        if (Math.random() > 0.1) {
          resolve("Success");
        } else {
          reject(new Error("Failed to generate report"));
        }
      }, completionTime);
    });
  },
});

// Initialize store event handlers (optional)
subscribe(reportJobStore, () => {
  // This callback runs on every state change
  // You could add persistent storage here if needed
  console.log("Job store updated:", reportJobStore.jobs.length, "jobs total");
});

// Helper functions for working with jobs
export const formatTime = (date?: Date) => {
  if (!date) return "-";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDuration = (startTime?: Date, endTime?: Date) => {
  if (!startTime) return "-";

  // Use end time if completed, or current time if in progress
  const end = endTime || new Date();
  const durationMs = end.getTime() - startTime.getTime();

  // Format to show minutes and seconds
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
};
