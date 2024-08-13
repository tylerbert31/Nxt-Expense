"use client";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from "@/components/ui/table";
import React from "react";
import { formatDistance } from "date-fns";
import { getExpensePurchase } from "@/lib/hooks/hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const PurchaseTable = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PurchaseTableData />
      </QueryClientProvider>
    </>
  );
};

const PurchaseTableData = () => {
  // Todo: Implement pagination
  const [page, setPage] = React.useState<number>(1);
  const { data, isLoading, refetch } = getExpensePurchase();
  const result = data?.data?.data;
  const items = result?.items;

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
    refetch();
  };

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
    refetch();
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Purchased</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items &&
            items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {formatDistance(item.customCreatedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>₱ {item.amount}</TableCell>
              </TableRow>
            ))}
          {isLoading && (
            <TableRow className="hover:bg-[unset] dark:hover:bg-[unset]">
              <TableCell className="text-center" colSpan={3}>
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default PurchaseTable;
