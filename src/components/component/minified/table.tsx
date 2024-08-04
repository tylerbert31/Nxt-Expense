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
  const { data, isLoading, refetch } = getExpensePurchase(page);
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
          {items && !isLoading && (
            <TableRow className="hover:bg-[unset] dark:hover:bg-[unset]">
              <TableCell
                colSpan={3}
                className="space-x-2 justify-center my-0 mx-auto"
              >
                <Button
                  variant={"outline"}
                  onClick={handlePrevPage}
                  className="dark:bg-slate-50 text-gray-700"
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  variant={"outline"}
                  onClick={handleNextPage}
                  className="dark:bg-slate-50 text-gray-700"
                  disabled={
                    page === result.totalPages || result.totalPages === 0
                  }
                >
                  Next
                </Button>
              </TableCell>
            </TableRow>
          )}
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
