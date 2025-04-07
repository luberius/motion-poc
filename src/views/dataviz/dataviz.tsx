import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Interfaces
interface DataPoint {
  name: string;
  month: number;
  [key: string]: string | number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

// Constants
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

// Static JSON data instead of generating it randomly
const STATIC_DATA: DataPoint[] = [
  {
    name: "Jan",
    month: 1,
    "Product A": 834,
    "Product B": 456,
    "Product C": 631,
    "Product D": 521,
  },
  {
    name: "Feb",
    month: 2,
    "Product A": 756,
    "Product B": 598,
    "Product C": 718,
    "Product D": 423,
  },
  {
    name: "Mar",
    month: 3,
    "Product A": 892,
    "Product B": 675,
    "Product C": 543,
    "Product D": 689,
  },
  {
    name: "Apr",
    month: 4,
    "Product A": 678,
    "Product B": 732,
    "Product C": 801,
    "Product D": 564,
  },
  {
    name: "May",
    month: 5,
    "Product A": 945,
    "Product B": 543,
    "Product C": 678,
    "Product D": 712,
  },
  {
    name: "Jun",
    month: 6,
    "Product A": 832,
    "Product B": 698,
    "Product C": 542,
    "Product D": 819,
  },
  {
    name: "Jul",
    month: 7,
    "Product A": 723,
    "Product B": 856,
    "Product C": 914,
    "Product D": 623,
  },
  {
    name: "Aug",
    month: 8,
    "Product A": 876,
    "Product B": 645,
    "Product C": 782,
    "Product D": 567,
  },
  {
    name: "Sep",
    month: 9,
    "Product A": 934,
    "Product B": 723,
    "Product C": 651,
    "Product D": 789,
  },
  {
    name: "Oct",
    month: 10,
    "Product A": 789,
    "Product B": 865,
    "Product C": 512,
    "Product D": 634,
  },
  {
    name: "Nov",
    month: 11,
    "Product A": 876,
    "Product B": 543,
    "Product C": 687,
    "Product D": 842,
  },
  {
    name: "Dec",
    month: 12,
    "Product A": 967,
    "Product B": 786,
    "Product C": 845,
    "Product D": 731,
  },
];

const getPieData = (
  data: DataPoint[],
  dateRange: [number, number],
): PieData[] => {
  const filteredData = data.filter(
    (item) => item.month >= dateRange[0] && item.month <= dateRange[1],
  );
  const products = ["Product A", "Product B", "Product C", "Product D"];

  return products.map((product, index) => ({
    name: product,
    value: filteredData.reduce(
      (sum, item) => sum + (item[product] as number),
      0,
    ),
    color: COLORS[index % COLORS.length],
  }));
};

const DataVisualizationPage: React.FC = () => {
  const [chartType, setChartType] = useState<string>("line");
  const [dateRange, setDateRange] = useState<[number, number]>([1, 12]);
  const [activeProductTab, setActiveProductTab] = useState<string>("all");
  const [showTransitionAlert, setShowTransitionAlert] = useState<boolean>(true);

  useEffect(() => {
    if (showTransitionAlert) {
      const timer = setTimeout(() => setShowTransitionAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showTransitionAlert]);

  const filteredData = STATIC_DATA.filter(
    (item) => item.month >= dateRange[0] && item.month <= dateRange[1],
  );

  const getActiveProducts = (): string[] => {
    if (activeProductTab === "all") {
      return ["Product A", "Product B", "Product C", "Product D"];
    }
    return [activeProductTab];
  };

  const handleDateRangeChange = (value: string): void => {
    switch (value) {
      case "q1":
        setDateRange([1, 3]);
        break;
      case "q2":
        setDateRange([4, 6]);
        break;
      case "q3":
        setDateRange([7, 9]);
        break;
      case "q4":
        setDateRange([10, 12]);
        break;
      case "h1":
        setDateRange([1, 6]);
        break;
      case "h2":
        setDateRange([7, 12]);
        break;
      default:
        setDateRange([1, 12]);
        break;
    }
  };

  const handleChartTypeChange = (value: string): void => {
    setChartType(value);
  };

  const handleProductTabChange = (value: string): void => {
    setActiveProductTab(value);
  };

  const activeProducts = getActiveProducts();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Data Visualization Transitions
          </CardTitle>
          <CardDescription>
            Smooth animations when switching between different chart types or
            data ranges, helping users maintain mental models during data
            exploration.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {showTransitionAlert && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Recharts Built-in Transitions</AlertTitle>
              <AlertDescription>
                Watch how Recharts automatically animates transitions between
                data states without requiring external motion libraries.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Select value={chartType} onValueChange={handleChartTypeChange}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="radar">Radar Chart</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  defaultValue="full"
                  onValueChange={handleDateRangeChange}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Year</SelectItem>
                    <SelectItem value="h1">H1 (Jan-Jun)</SelectItem>
                    <SelectItem value="h2">H2 (Jul-Dec)</SelectItem>
                    <SelectItem value="q1">Q1 (Jan-Mar)</SelectItem>
                    <SelectItem value="q2">Q2 (Apr-Jun)</SelectItem>
                    <SelectItem value="q3">Q3 (Jul-Sep)</SelectItem>
                    <SelectItem value="q4">Q4 (Oct-Dec)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs
                value={activeProductTab}
                onValueChange={handleProductTabChange}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="Product A">Product A</TabsTrigger>
                  <TabsTrigger value="Product B">Product B</TabsTrigger>
                  <TabsTrigger value="Product C">Product C</TabsTrigger>
                  <TabsTrigger value="Product D">Product D</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Chart */}
            <div className="w-full h-96 mt-4 transition-all duration-500 ease-in-out">
              {/* Line Chart */}
              {chartType === "line" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {activeProducts.map((product, index) => (
                      <Line
                        key={product}
                        type="monotone"
                        dataKey={product}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        isAnimationActive
                        animationDuration={800}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}

              {/* Bar Chart */}
              {chartType === "bar" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {activeProducts.map((product, index) => (
                      <Bar
                        key={product}
                        dataKey={product}
                        fill={COLORS[index % COLORS.length]}
                        isAnimationActive
                        animationDuration={800}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}

              {/* Area Chart */}
              {chartType === "area" && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {activeProducts.map((product, index) => (
                      <Area
                        key={product}
                        type="monotone"
                        dataKey={product}
                        stackId="1"
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.6}
                        isAnimationActive
                        animationDuration={800}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {/* Pie Chart */}
              {chartType === "pie" && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={getPieData(STATIC_DATA, dateRange)}
                      cx="50%"
                      cy="50%"
                      labelLine
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      dataKey="value"
                      isAnimationActive
                      animationDuration={800}
                    >
                      {getPieData(STATIC_DATA, dateRange).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Radar Chart */}
              {chartType === "radar" && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={filteredData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Tooltip />
                    <Legend />
                    {activeProducts.map((product, index) => (
                      <Radar
                        key={product}
                        name={product}
                        dataKey={product}
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.6}
                        isAnimationActive
                        animationDuration={800}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Data range: {STATIC_DATA[dateRange[0] - 1]?.name} -{" "}
            {STATIC_DATA[dateRange[1] - 1]?.name}
          </div>
          <Button variant="outline" onClick={() => setDateRange([1, 12])}>
            Reset View
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataVisualizationPage;
