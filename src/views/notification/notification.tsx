import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "sonner";
import "./notification.css";

// Define types
type NotificationType = "success" | "warning" | "error" | "info";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationSystems: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  // Generate a unique ID for each notification
  const generateId = (): string =>
    `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add a new notification
  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
  ): void => {
    const newNotification: NotificationItem = {
      id: generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    showToast(type, title, message);
  };

  // Show a toast notification using Sonner
  const showToast = (
    type: NotificationType,
    title: string,
    message: string,
  ): void => {
    switch (type) {
      case "success":
        toast.success(title, {
          description: message,
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 5000,
        });
        break;
      case "warning":
        toast.warning(title, {
          description: message,
          icon: <AlertTriangle className="h-4 w-4" />,
          duration: 5000,
        });
        break;
      case "error":
        toast.error(title, {
          description: message,
          icon: <XCircle className="h-4 w-4" />,
          duration: 5000,
        });
        break;
      case "info":
        toast(title, {
          description: message,
          icon: <Info className="h-4 w-4" />,
          duration: 5000,
        });
        break;
    }
  };

  const markAsRead = (id: string): void => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setShowBanner(true);
    }, 1000);

    const scheduleInfo = setTimeout(() => {
      addNotification(
        "info",
        "Welcome to Notifications Demo",
        "This demo shows various notification types and styles",
      );
    }, 2000);

    const scheduleSuccess = setTimeout(() => {
      addNotification(
        "success",
        "Connected to Server",
        "Successfully established connection to the API server",
      );
    }, 4000);

    const scheduleWarning = setTimeout(() => {
      addNotification(
        "warning",
        "Storage Warning",
        "Your storage usage is approaching the limit (85%)",
      );
    }, 7000);

    const scheduleError = setTimeout(() => {
      addNotification(
        "error",
        "Database Error",
        "Failed to connect to database. Retrying in 5 seconds...",
      );
    }, 10000);

    return () => {
      clearTimeout(scheduleInfo);
      clearTimeout(scheduleSuccess);
      clearTimeout(scheduleWarning);
      clearTimeout(scheduleError);
    };
  }, []);

  // Get icon for notification type
  const getIcon = (type: NotificationType, size = 16) => {
    switch (type) {
      case "success":
        return <CheckCircle size={size} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={size} className="text-yellow-500" />;
      case "error":
        return <XCircle size={size} className="text-red-500" />;
      case "info":
      default:
        return <Info size={size} className="text-blue-500" />;
    }
  };

  // Get background color for notification type
  const getBackgroundColor = (type: NotificationType): string => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  // Get text color for notification type
  const getTextColor = (type: NotificationType): string => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "warning":
        return "text-yellow-800";
      case "error":
        return "text-red-800";
      case "info":
      default:
        return "text-blue-800";
    }
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Trigger a new notification
  const triggerNotification = (type: NotificationType): void => {
    const titles: Record<NotificationType, string> = {
      success: "Success",
      warning: "Warning",
      error: "Error",
      info: "Information",
    };

    const messages: Record<NotificationType, string> = {
      success: "Operation completed successfully",
      warning: "Please review this item before proceeding",
      error: "An error occurred while processing your request",
      info: "New updates are available for your system",
    };

    addNotification(type, titles[type], messages[type]);
  };

  return (
    <div className="w-full p-6">
      {/* Add Sonner Toaster component */}
      <Toaster position="top-right" richColors />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            Alert & Notification System
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => triggerNotification("info")}
              variant="outline"
              size="sm"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
            >
              Info
            </Button>
            <Button
              onClick={() => triggerNotification("success")}
              variant="outline"
              size="sm"
              className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
            >
              Success
            </Button>
            <Button
              onClick={() => triggerNotification("warning")}
              variant="outline"
              size="sm"
              className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
            >
              Warning
            </Button>
            <Button
              onClick={() => triggerNotification("error")}
              variant="outline"
              size="sm"
              className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
            >
              Error
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* System-wide Banner */}
          {showBanner && (
            <Alert className={`${getBackgroundColor("info")} relative mb-4`}>
              {getIcon("info")}
              <AlertTitle className={`${getTextColor("info")}`}>
                System Notification
              </AlertTitle>
              <AlertDescription className={getTextColor("info")}>
                Scheduled maintenance tonight from 2:00 AM to 4:00 AM.
              </AlertDescription>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute right-3 top-[50%] translate-y-[-50%]"
                onClick={() => setShowBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          )}

          <div className="flex space-x-6">
            {/* Main Content Area */}
            <div className="flex-grow">
              <Card>
                <CardContent>
                  <h3 className="text-lg font-medium mb-4">
                    Dashboard Content
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This is a demonstration of an enterprise alert and
                    notification system. Click the buttons above to trigger
                    different types of notifications.
                  </p>
                  <p className="text-gray-600">
                    High-priority notifications will appear as toast messages in
                    the top-right corner, while all notifications are collected
                    in the notification panel.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Notification Panel */}
            <div className="w-1/2">
              <Card className="@container/card gap-2">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    You have {unreadCount} unread messages.
                  </CardDescription>
                </CardHeader>
                <Separator />
                <ScrollArea className="h-96">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150",
                          !notification.read ? "bg-blue-50" : "bg-white",
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className="mt-0.5 mr-2">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium text-sm">
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {formatTime(notification.timestamp)}
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystems;
