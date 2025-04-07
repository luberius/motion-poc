import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowRight,
  DollarSign,
  Calendar,
  User,
  Building,
  FileText,
  CalendarIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${Math.floor(Math.random() * 10000)}`,
  );
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
  ]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Add new item
  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      price: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Update item
  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/poc/list");
      toast.success("Invoice created successfully!", {
        position: "top-right",
        duration: 3000,
        icon: <Check className="h-5 w-5 text-green-600" />,
      });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-indigo-500" />
                <span>New Invoice</span>
              </CardTitle>
              <CardDescription>
                Create a new invoice for your client
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">
                {invoiceNumber}
              </div>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  Invoice Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className={`transition-all duration-200 ${focusedField === "invoiceNumber" ? "ring-2 ring-indigo-200 rounded-md" : ""}`}
                  >
                    <Input
                      id="invoiceNumber"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      onFocus={() => setFocusedField("invoiceNumber")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          id="date"
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </motion.div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          id="dueDate"
                          variant="outline"
                          type="button"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Select due date"}
                        </Button>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <CalendarComponent
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                          fromDate={date || new Date()}
                        />
                      </motion.div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-500" />
                  Client Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className={`transition-all duration-200 ${focusedField === "clientName" ? "ring-2 ring-indigo-200 rounded-md" : ""}`}
                  >
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      onFocus={() => setFocusedField("clientName")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter client name"
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className={`transition-all duration-200 ${focusedField === "clientEmail" ? "ring-2 ring-indigo-200 rounded-md" : ""}`}
                  >
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      onFocus={() => setFocusedField("clientEmail")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter client email"
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientAddress">Client Address</Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className={`transition-all duration-200 ${focusedField === "clientAddress" ? "ring-2 ring-indigo-200 rounded-md" : ""}`}
                  >
                    <Input
                      id="clientAddress"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      onFocus={() => setFocusedField("clientAddress")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter client address"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-500" />
                Invoice Items
              </h3>

              <ScrollArea className="h-64 rounded-md border">
                <div className="p-4 space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-5">
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, "description", e.target.value)
                            }
                            onFocus={() => setFocusedField(`desc-${item.id}`)}
                            onBlur={() => setFocusedField(null)}
                            className={`transition-all duration-200 ${focusedField === `desc-${item.id}` ? "ring-2 ring-indigo-200" : ""}`}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            onFocus={() => setFocusedField(`qty-${item.id}`)}
                            onBlur={() => setFocusedField(null)}
                            className={`transition-all duration-200 ${focusedField === `qty-${item.id}` ? "ring-2 ring-indigo-200" : ""}`}
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="relative">
                            <DollarSign className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "price",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              onFocus={() =>
                                setFocusedField(`price-${item.id}`)
                              }
                              onBlur={() => setFocusedField(null)}
                              className={`pl-7 transition-all duration-200 ${focusedField === `price-${item.id}` ? "ring-2 ring-indigo-200" : ""}`}
                            />
                          </div>
                        </div>
                        <div className="col-span-2 text-right">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed text-indigo-600"
                      onClick={addItem}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </motion.div>
                </div>
              </ScrollArea>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <motion.span
                  key={total.toString()}
                  initial={{ scale: 1.2, color: "#4F46E5" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.5 }}
                  className="font-bold"
                >
                  ${total.toFixed(2)}
                </motion.span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Create Invoice</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
};

export default InvoiceForm;
