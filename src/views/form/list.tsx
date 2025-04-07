import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import invoicesData from "./data.json";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

const InvoicePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<any>([]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(invoicesData.length / itemsPerPage);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = invoicesData.slice(startIndex, endIndex);

      setInvoices(paginatedData);
      setIsLoading(false);
    };

    fetchInvoices();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-8 ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl flex justify-between items-center">
            Invoices
            <NavLink to="/poc/form">
              <Button>Add Invoice</Button>
            </NavLink>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
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
                      Loading data...
                    </motion.p>
                  </div>
                </motion.div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Invoice ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice: any, index: number) => (
                      <motion.tr
                        key={invoice.invoiceId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          scale: 1.01,
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        }}
                        className="border-b"
                      >
                        <td className="py-3 px-4 font-medium">
                          {invoice.invoiceId}
                        </td>
                        <td className="py-3 px-4">{invoice.customer}</td>
                        <td className="py-3 px-4">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(invoice.total)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={
                          currentPage === 1 ? "opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {pageNumbers.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePage;
