import { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Bell,
  Heart,
  ThumbsUp,
  MessageSquare,
  Check,
  Plus,
  Minus,
  X,
} from "lucide-react";

const MicroInteractionsShowcase = () => {
  const [activeTab, setActiveTab] = useState("buttons");
  const [liked, setLiked] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [count, setCount] = useState(0);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation controls for the like button
  const likeControls = useAnimation();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-gray-50 rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Micro-Interactions Showcase
        </h1>

        <Tabs
          defaultValue="buttons"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="buttons" className="relative">
              Buttons
              {activeTab === "buttons" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="activeTab"
                />
              )}
            </TabsTrigger>
            <TabsTrigger value="cards" className="relative">
              Cards
              {activeTab === "cards" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="activeTab"
                />
              )}
            </TabsTrigger>
            <TabsTrigger value="toggles" className="relative">
              Toggles
              {activeTab === "toggles" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="activeTab"
                />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Like Button with Motion</CardTitle>
                  <CardDescription>
                    Complex sequence animation with filling effect
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newLikedState = !liked;
                      setLiked(newLikedState);

                      if (newLikedState) {
                        // Trigger the shake and bounce animation sequence
                        likeControls.start({
                          rotate: [0, -10, 10, -5, 0],
                          scale: [1, 1.2, 0.9, 1.1, 1],
                          transition: { duration: 0.5 },
                        });

                        setTimeout(() => {
                          setShowSuccess(true);
                          setTimeout(() => setShowSuccess(false), 2000);
                        }, 300);
                      }
                    }}
                    className="h-12 w-12"
                  >
                    <motion.div
                      animate={likeControls}
                      initial={{ rotate: 0, scale: 1 }}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <ThumbsUp
                        size={24}
                        className={`transition-colors duration-300 ${
                          liked
                            ? "text-blue-500 fill-blue-500"
                            : "text-gray-500"
                        }`}
                      />
                    </motion.div>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Counter Button</CardTitle>
                  <CardDescription>
                    Incremental counter with animations
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setCount((c) => Math.max(0, c - 1));
                    }}
                    className="bg-red-100 text-red-600 rounded-full p-2"
                    disabled={count <= 0}
                  >
                    <Minus size={20} />
                  </motion.button>

                  <div className="relative font-bold text-2xl w-12 h-12 flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.div
                        key={count}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 1,
                        }}
                        className="absolute"
                      >
                        {count}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setCount((c) => c + 1);
                    }}
                    className="bg-green-100 text-green-600 rounded-full p-2"
                  >
                    <Plus size={20} />
                  </motion.button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hover Button</CardTitle>
                  <CardDescription>
                    Interactive button with hover effect
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                  {["Send", "Reply", "Share"].map((label) => (
                    <motion.div
                      key={label}
                      onHoverStart={() => setHoveredButton(label)}
                      onHoverEnd={() => setHoveredButton(null)}
                      className="relative"
                    >
                      <Button variant="outline">{label}</Button>
                      <AnimatePresence>
                        {hoveredButton === label && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 8 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded bg-black text-white"
                          >
                            {label === "Send"
                              ? "Send a message"
                              : label === "Reply"
                                ? "Reply to thread"
                                : "Share with others"}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loading Button</CardTitle>
                  <CardDescription>
                    Button with loading state animation
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <LoadingButton />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="col-span-1 md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Expandable Card</CardTitle>
                    <CardDescription>
                      Click to reveal more content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="bg-gray-100 rounded-lg p-4 cursor-pointer"
                      onClick={() => setExpanded(!expanded)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Project details</h3>
                        <motion.div
                          animate={{ rotate: expanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 7.5L10 12.5L15 7.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      </div>

                      <p>
                        Click to {expanded ? "hide" : "show"} more information
                      </p>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t mt-4">
                              <p>
                                This project demonstrates various
                                micro-interactions implemented using React,
                                TypeScript, shadcn/ui and Framer Motion.
                              </p>
                              <p className="mt-2">
                                These subtle animations and interactions improve
                                the user experience by providing visual feedback
                                and making the interface feel more responsive
                                and engaging.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Hover Card</CardTitle>
                  <CardDescription>Card with hover effect</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border rounded-lg p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">New message</h3>
                        <p className="text-sm text-gray-500">
                          You have a new message from Jane
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="toggles" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Notification Toggle</CardTitle>
                  <CardDescription>With animated bell effect</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: notificationEnabled ? [0, -30, 30, -30, 0] : 0,
                        color: notificationEnabled ? "#a855f7" : "#6b7280",
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Bell />
                    </motion.div>
                    <span>Notifications</span>
                  </div>
                  <Switch
                    checked={notificationEnabled}
                    onCheckedChange={setNotificationEnabled}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme Toggle</CardTitle>
                  <CardDescription>Animated theme switcher</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeToggle />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staggered Items</CardTitle>
                  <CardDescription>Items appearing with delay</CardDescription>
                </CardHeader>
                <CardContent>
                  <StaggeredItems />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4"
          >
            <Alert className="bg-green-50 border-green-500">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your interaction was successful.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Loading button component
const LoadingButton = () => {
  const [state, setState] = useState("idle"); // 'idle', 'loading', 'success', 'error'
  const [isTransitioning, setIsTransitioning] = useState(false);
  let loadingTimeout: any = null;

  const handleClick = () => {
    // Don't do anything if already in a loading state or transitioning between states
    if (state === "loading" || isTransitioning) return;

    // Cancel any existing timeouts to prevent state conflicts
    clearTimeout(loadingTimeout);
    setIsTransitioning(true);
    setState("loading");

    loadingTimeout = setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      setState(success ? "success" : "error");

      setTimeout(() => {
        setState("idle");
        setIsTransitioning(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleClick}
        disabled={state === "loading"}
        className={`relative w-32 ${
          state === "success"
            ? "bg-green-600 hover:bg-green-700"
            : state === "error"
              ? "bg-red-600 hover:bg-red-700"
              : ""
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="text-white" size={20} />
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <X className="text-white" size={20} />
            </motion.div>
          )}

          {state === "idle" && !isTransitioning && (
            <motion.span
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Submit
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <div className="text-sm text-gray-500">
        {state === "loading"
          ? "Loading..."
          : state === "success"
            ? "Success!"
            : state === "error"
              ? "Failed! Try again."
              : "Click to submit"}
      </div>
    </div>
  );
};

// Theme toggle component
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={`flex items-center justify-between p-4 ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"} rounded-lg transition-colors duration-300`}
    >
      <span>Theme</span>

      <motion.button
        onClick={() => setIsDark(!isDark)}
        className={`relative w-12 h-6 rounded-full ${isDark ? "bg-blue-600" : "bg-gray-300"} transition-colors duration-300`}
      >
        <motion.div
          animate={{ x: isDark ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1 left-0 w-4 h-4 rounded-full ${isDark ? "bg-white" : "bg-white"}`}
        />
      </motion.button>
    </div>
  );
};

// Staggered items component
const StaggeredItems = () => {
  const [isVisible, setIsVisible] = useState(false);

  const items = [
    { icon: <ThumbsUp size={16} />, text: "Liked" },
    { icon: <MessageSquare size={16} />, text: "Commented" },
    { icon: <Heart size={16} />, text: "Favorites" },
    { icon: <Bell size={16} />, text: "Notifications" },
  ];

  return (
    <div>
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        className="mb-4"
      >
        {isVisible ? "Hide" : "Show"} Items
      </Button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 bg-white border rounded"
              >
                <div className="text-blue-500">{item.icon}</div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MicroInteractionsShowcase;
