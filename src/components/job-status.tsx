import React, { useEffect } from "react";
import { useSnapshot, subscribe } from "valtio";
import { toast } from "sonner";
import { reportJobStore } from "@/store/job";
import { IconCircleCheck, IconLoader } from "@tabler/icons-react";
import { NavLink, useNavigate } from "react-router";

const JobStatus: React.FC = () => {
  const jobState = useSnapshot(reportJobStore);
  const navigate = useNavigate();

  useEffect(() => {
    let lastCompleted = jobState.jobs.filter(
      (job) => job.status === "completed",
    ).length;
    let lastFailed = jobState.jobs.filter(
      (job) => job.status === "failed",
    ).length;

    const unsubscribe = subscribe(reportJobStore, () => {
      const jobs = reportJobStore.jobs;

      const completedJobs = jobs.filter((job) => job.status === "completed");
      if (completedJobs.length > lastCompleted) {
        const newestCompletedJob = completedJobs.sort((a, b) => {
          if (!a.endTime || !b.endTime) return 0;
          return b.endTime.getTime() - a.endTime.getTime();
        })[0];

        toast.success(
          `Report completed: ${newestCompletedJob.prompt.substring(
            0,
            40,
          )}${newestCompletedJob.prompt.length > 40 ? "..." : ""}`,
          {
            description: "Click to view the report details",
            action: {
              label: "View",
              onClick: () => navigate("/poc/reports"),
            },
          },
        );
      }

      // Find newly failed jobs
      const failedJobs = jobs.filter((job) => job.status === "failed");
      if (failedJobs.length > lastFailed) {
        // Get the most recently failed job
        const newestFailedJob = failedJobs.sort((a, b) => {
          if (!a.endTime || !b.endTime) return 0;
          return b.endTime.getTime() - a.endTime.getTime();
        })[0];

        // Show error toast notification
        toast.error(
          `Report failed: ${newestFailedJob.prompt.substring(
            0,
            40,
          )}${newestFailedJob.prompt.length > 40 ? "..." : ""}`,
          {
            description: "There was an error generating your report",
            action: {
              label: "Retry",
              onClick: () => console.log("Retry report", newestFailedJob.id),
            },
          },
        );
      }

      // Update tracking counts
      lastCompleted = completedJobs.length;
      lastFailed = failedJobs.length;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // If no active jobs (processing or queued), don't show anything
  const activeJobCount = jobState.processingCount + jobState.queuedJobCount;

  return (
    <NavLink to="/poc/reports">
      <div className="flex items-center px-3 py-2 text-sm bg-gray-50 rounded-md border border-gray-200 ">
        {activeJobCount > 0 && (
          <>
            <IconLoader className="h-4 w-4 mr-2 text-blue-500 animate-spin" />
            <span>
              <span className="font-medium">{activeJobCount}</span> process
              {activeJobCount !== 1 && "es"} running
            </span>
          </>
        )}
        {activeJobCount < 1 && (
          <>
            <IconCircleCheck className="h-4 w-4 mr-2 text-green-500" />
            <span>no process running</span>
          </>
        )}
      </div>
    </NavLink>
  );
};

export default JobStatus;
