import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Check, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoadingShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Card className="w-full m-8">
      <CardHeader>
        <CardTitle className="text-center">Subtle Loading Animations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pulse" className="w-full">
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="pulse">Pulse</TabsTrigger>
            <TabsTrigger value="dots">Dots</TabsTrigger>
            <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="fade">Fade</TabsTrigger>
            <TabsTrigger value="overlay">Overlay</TabsTrigger>
          </TabsList>

          <div className="mb-6 flex justify-center">
            <Button
              onClick={simulateLoading}
              variant="default"
              className="px-6"
            >
              Simulate Loading
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8 flex items-center justify-center min-h-64">
              <TabsContent value="pulse" className="w-full mt-0">
                <PulseLoader isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="dots" className="w-full mt-0">
                <DotsLoader isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="skeleton" className="w-full mt-0">
                <SkeletonLoader isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="icons" className="w-full mt-0">
                <IconLoader isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="fade" className="w-full mt-0">
                <FadeLoader isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="overlay" className="w-full mt-0">
                <OverlayLoader isLoading={isLoading} />
              </TabsContent>
            </CardContent>
          </Card>

          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">
                Implementation Notes:
              </h2>
              <p className="text-slate-700">
                These loaders use React, Framer Motion, and shadcn/ui for
                subtle, physics-based animations. The transitions are
                intentionally understated to provide feedback without
                overwhelming the user.
              </p>
            </CardContent>
          </Card>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface LoaderProps {
  isLoading: boolean;
}

const PulseLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 0.1,
                ease: "easeInOut",
              }}
              className="w-8 h-8 bg-primary/30 rounded-full absolute"
            />
            <div className="w-8 h-8 bg-primary/80 rounded-full relative" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-medium text-center">Content Loaded</h3>
            <p className="text-muted-foreground">Your data is ready to view</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DotsLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex space-x-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.08,
                }}
                className="w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-medium text-center">Content Loaded</h3>
            <p className="text-muted-foreground">Your data is ready to view</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkeletonLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[30, 100, 85, 70, 40].map((width, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 0.05,
                  ease: "easeInOut",
                }}
                className="h-4 bg-muted rounded"
                style={{
                  width: `${width}%`,
                  height: i === 0 ? "24px" : "16px",
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, staggerChildren: 0.05 }}
            className="space-y-4"
          >
            <motion.h3
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-medium"
            >
              Example Content Title
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              This is a paragraph of text that has been loaded successfully
              after the skeleton loader completed its animation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button>Action Button</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IconLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex space-x-8">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9" />
                  </svg>
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-0 left-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 12a5 5 0 1 0 -5 5" />
                  </svg>
                </motion.div>
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <RefreshCw className="h-12 w-12 text-primary" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 0.05,
                  ease: "easeInOut",
                }}
              >
                <ArrowUpDown className="h-12 w-12 text-primary" />
              </motion.div>
            </div>
            <p className="text-muted-foreground">Processing your request...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              damping: 18,
              stiffness: 250,
              duration: 0.3,
            }}
            className="flex flex-col items-center space-y-2"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                damping: 12,
                stiffness: 200,
              }}
              className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2"
            >
              <Check className="h-8 w-8 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-medium text-center">Task Completed</h3>
            <p className="text-muted-foreground">
              All operations finished successfully
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FadeLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-40"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.05,
                ease: "easeInOut",
              }}
              className="text-primary"
            >
              Loading...
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, staggerChildren: 0.05 }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-medium mb-4 text-center"
            >
              Faded In Content
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { bg: "bg-blue-50", text: "text-blue-800", label: "Panel One" },
                {
                  bg: "bg-purple-50",
                  text: "text-purple-800",
                  label: "Panel Two",
                },
                {
                  bg: "bg-green-50",
                  text: "text-green-800",
                  label: "Panel Three",
                },
                {
                  bg: "bg-amber-50",
                  text: "text-amber-800",
                  label: "Panel Four",
                },
              ].map((panel, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 ${panel.bg} rounded-md`}
                >
                  <p className={panel.text}>{panel.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OverlayLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <div className="w-full max-w-md relative">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Content Behind Overlay</h3>
        <p className="text-muted-foreground">
          This content will be covered by a white overlay with a loading
          indicator when in the loading state. The overlay only covers this
          content area, not the entire screen.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800">Data Panel</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-md">
            <p className="text-purple-800">Statistics</p>
          </div>
        </div>
        <Button className="mt-2">Action Button</Button>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-md"
            style={{ backdropFilter: "blur(3px)" }}
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                className="relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9" />
                  </svg>
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-0 left-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 12a5 5 0 1 0 -5 5" />
                  </svg>
                </motion.div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-primary font-medium"
              >
                Loading content...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingShowcase;
