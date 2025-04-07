import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";

// Define TypeScript types for our data
type ContentItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
};

type Category = {
  id: string;
  name: string;
  description: string;
  items: ContentItem[];
};

// Sample data
const categories: Category[] = [
  {
    id: "design",
    name: "Design Principles",
    description: "Fundamental concepts that guide effective design",
    items: [
      {
        id: "design-1",
        title: "Visual Hierarchy",
        description: "Organizing elements by importance",
        content:
          "Visual hierarchy is the principle of arranging elements to show their order of importance. Designers structure visual characteristics—size, color, contrast, alignment, repetition, proximity, and negative space—to influence user perception. This guides users through content in the intended order, creating clear paths through information. Effective visual hierarchy helps users quickly understand what's most important and how content is organized.",
        category: "design",
        tags: ["visual", "composition", "layout"],
      },
      {
        id: "design-2",
        title: "Gestalt Principles",
        description:
          "How humans perceive visual elements as organized patterns",
        content:
          "Gestalt principles explain how humans naturally perceive visual elements as organized patterns rather than separate components. Key principles include proximity (nearby elements appear grouped), similarity (visually similar elements appear related), continuity (eyes follow smooth paths), closure (mind completes incomplete shapes), figure/ground (distinguishing foreground from background), and common fate (elements moving together appear related). These principles help designers create intuitive interfaces by leveraging natural visual perception patterns.",
        category: "design",
        tags: ["psychology", "perception", "grouping"],
      },
      {
        id: "design-3",
        title: "Contextual Navigation",
        description: "Spatial transitions between information levels",
        content:
          "Contextual navigation uses spatial transitions when moving between different levels of information (overview to detail) to maintain user orientation. These movements help users understand how information is structured and their current position within that structure. Effective contextual navigation provides clear paths for moving deeper into content or returning to broader views, with consistent visual cues that reinforce the user's location. This approach reduces cognitive load by mimicking how we navigate physical spaces, making digital exploration more intuitive.",
        category: "design",
        tags: ["navigation", "hierarchy", "orientation"],
      },
    ],
  },
  {
    id: "interaction",
    name: "Interaction Patterns",
    description: "Common patterns for user interaction with interfaces",
    items: [
      {
        id: "interaction-1",
        title: "Progressive Disclosure",
        description: "Revealing information gradually as needed",
        content:
          "Progressive disclosure is an interaction design technique that sequences information and actions across several screens to avoid overwhelming users. By revealing only necessary or requested information at each step, this pattern reduces cognitive load and complexity. Information is structured from simple to complex, general to specific, with additional details available on demand. This approach keeps interfaces clean while ensuring all necessary functionality remains accessible, creating a more manageable learning curve for complex systems.",
        category: "interaction",
        tags: ["simplicity", "complexity", "disclosure"],
      },
      {
        id: "interaction-2",
        title: "Direct Manipulation",
        description:
          "Interacting with visible objects rather than abstract controls",
        content:
          "Direct manipulation allows users to interact with visible representations of objects rather than using abstract controls or command syntax. This interaction pattern creates a sense of immediacy and control by letting users directly manipulate digital objects in ways that correspond to physical actions. Key characteristics include visibility of objects and actions, instant feedback, and reversible operations. Direct manipulation makes interfaces more intuitive by leveraging users' physical world knowledge and providing continuous representation of the context for actions.",
        category: "interaction",
        tags: ["control", "feedback", "intuitive"],
      },
    ],
  },
];

const ContextualNavigationShowcase = () => {
  const [level, setLevel] = useState<"overview" | "category" | "detail">(
    "overview",
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([
    "overview",
  ]);
  const [animation, setAnimation] = useState<"in" | "out">("in");

  const navigate = (
    newLevel: "overview" | "category" | "detail",
    categoryId?: string,
    itemId?: string,
  ) => {
    setAnimation("out");

    if (newLevel === "overview") {
      setSelectedCategory(null);
      setSelectedItem(null);
    } else if (newLevel === "category") {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        setSelectedCategory(category);
        setSelectedItem(null);
      }
    } else if (newLevel === "detail") {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        const item = category.items.find((i) => i.id === itemId);
        if (item) {
          setSelectedCategory(category);
          setSelectedItem(item);
        }
      }
    }

    setLevel(newLevel);

    const newHistory = [...navigationHistory];
    if (newLevel === "overview") {
      newHistory.splice(1); // Keep only overview in history
    } else if (newLevel === "category") {
      newHistory.splice(2); // Keep up to category level
      if (newHistory.length === 1) {
        newHistory.push(`category-${categoryId}`);
      }
    } else if (newLevel === "detail") {
      newHistory.splice(3); // Keep up to detail level
      if (newHistory.length === 2) {
        newHistory.push(`detail-${itemId}`);
      }
    }
    setNavigationHistory(newHistory);

    setAnimation("in");
  };

  const variants = {
    initial: {
      opacity: 0,
      y: animation === "in" ? 20 : 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: animation === "out" ? 20 : 0,
    },
  };

  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className={level === "overview" ? "font-bold" : ""}
          onClick={() => navigate("overview")}
        >
          Overview
        </Button>

        {selectedCategory && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Button
              variant="ghost"
              size="sm"
              className={level === "category" ? "font-bold" : ""}
              onClick={() => navigate("category", selectedCategory.id)}
            >
              {selectedCategory.name}
            </Button>
          </>
        )}

        {selectedItem && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Button variant="ghost" size="sm" className="font-bold">
              {selectedItem.title}
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className="w-[90%] mx-auto my-8 overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Contextual Navigation Example</CardTitle>
          <div className="flex items-center gap-2">
            {level !== "overview" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(
                    level === "detail" ? "category" : "overview",
                    selectedCategory?.id,
                  )
                }
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            {level !== "overview" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("overview")}
              >
                <Minimize2 className="h-4 w-4 mr-1" />
                Overview
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Demonstrating spatial transitions between information levels to
          maintain orientation
        </CardDescription>
        {renderBreadcrumbs()}
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${level}-${selectedCategory?.id || ""}-${selectedItem?.id || ""}`}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "backIn" }}
          >
            {level === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate("category", category.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        {category.id === "design" ? (
                          <Eye className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <Layers className="h-5 w-5 mr-2 text-primary" />
                        )}
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="flex justify-between w-full items-center">
                        <Badge variant="outline">
                          {category.items.length} items
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {level === "category" && selectedCategory && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  {selectedCategory.id === "design" ? (
                    <Eye className="h-6 w-6 text-primary" />
                  ) : (
                    <Layers className="h-6 w-6 text-primary" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedCategory.name}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedCategory.description}
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="cards">Card View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="list" className="space-y-2">
                    {selectedCategory.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg border hover:border-primary cursor-pointer transition-all hover:shadow-sm"
                        onClick={() =>
                          navigate("detail", selectedCategory.id, item.id)
                        }
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                          <Button size="icon" variant="ghost">
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent
                    value="cards"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {selectedCategory.items.map((item) => (
                      <Card
                        key={item.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() =>
                          navigate("detail", selectedCategory.id, item.id)
                        }
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {item.title}
                          </CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex-col items-start">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm" variant="ghost" className="ml-auto">
                            <Maximize2 className="h-4 w-4 mr-1" />
                            Expand
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {level === "detail" && selectedItem && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                  <p className="text-lg text-muted-foreground">
                    {selectedItem.description}
                  </p>
                  <div className="flex gap-2 my-2">
                    {selectedItem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <ScrollArea className="h-64 rounded-md border p-4">
                  <div className="space-y-4">
                    <p>{selectedItem.content}</p>
                  </div>
                </ScrollArea>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Related Items</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedCategory?.items
                      .filter((item) => item.id !== selectedItem.id)
                      .map((item) => (
                        <Button
                          key={item.id}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate("detail", selectedCategory.id, item.id)
                          }
                        >
                          {item.title}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <CardFooter className="bg-muted/30 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {level === "overview"
            ? "Viewing all categories"
            : level === "category"
              ? `Viewing items in ${selectedCategory?.name}`
              : `Viewing details for ${selectedItem?.title}`}
        </div>

        <div className="flex gap-2">
          {level === "overview" && categories.length > 0 && (
            <Button
              size="sm"
              onClick={() => navigate("category", categories[0].id)}
            >
              Explore Categories
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {level === "category" && selectedCategory?.items.length && (
            <Button
              size="sm"
              onClick={() =>
                navigate(
                  "detail",
                  selectedCategory.id,
                  selectedCategory.items[0].id,
                )
              }
            >
              View First Item
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContextualNavigationShowcase;
