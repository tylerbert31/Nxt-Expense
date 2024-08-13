
"use client"

import { FormEvent, useState } from "react"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { getExpensePurchase } from "@/lib/hooks/hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function AllPurchases() {
  return (
    <QueryClientProvider client={queryClient}>
      <AllPurchaseData />
    </QueryClientProvider>
  )
}


function AllPurchaseData() {
  const searchParams = useSearchParams()

  const GET = {
    description: searchParams.get("description") ?? "",
    category: searchParams.get("category") ?? "0",
    amountMin: searchParams.get("amountMin") ?? "",
    amountMax: searchParams.get("amountMax") ?? "",
    date: searchParams.get("date") ?? undefined,
    perPage: searchParams.get("perPage") ?? "10",
    page: searchParams.get("page") ?? "1",
  }

  const { data: expenses, isLoading, refetch } = getExpensePurchase(searchParams.toString());

  const [date, setDate] = useState<Date | undefined>(GET.date ? new Date(GET.date) : undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const data = [
    {
      id: 1,
      date: "2023-06-01",
      category: "Rent",
      description: "Apartment rent for June",
      amount: 1500,
    },
    {
      id: 2,
      date: "2023-06-05",
      category: "Groceries",
      description: "Weekly grocery shopping",
      amount: 150.23,
    },
    {
      id: 3,
      date: "2023-06-10",
      category: "Utilities",
      description: "Electricity bill",
      amount: 87.45,
    },
    {
      id: 4,
      date: "2023-06-15",
      category: "Entertainment",
      description: "Movie tickets",
      amount: 25.99,
    },
    {
      id: 5,
      date: "2023-06-20",
      category: "Rent",
      description: "Apartment rent for July",
      amount: 1500,
    },
    {
      id: 6,
      date: "2023-06-25",
      category: "Groceries",
      description: "Weekly grocery shopping",
      amount: 175.67,
    },
    {
      id: 7,
      date: "2023-07-01",
      category: "Utilities",
      description: "Internet bill",
      amount: 65.99,
    },
    {
      id: 8,
      date: "2023-07-05",
      category: "Entertainment",
      description: "Concert tickets",
      amount: 150.0,
    },
  ]
  return (
    <QueryClientProvider client={queryClient}>
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 !bg-white rounded-md shadow">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground sm:text-base">View and filter your recent expenses.</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Show Filters</Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-4 !bg-white">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription></SheetDescription>
            <form className="mt-5">
              <input type="hidden" name="date" value={date ? format(date, 'yyyy-MM-dd') : ''} />
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Search description"
                    defaultValue={GET.description}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm">
                    Category
                  </Label>
                  <Select
                    defaultValue={GET.category}
                    name="category"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="!bg-white">
                      <SelectItem value="0">All</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Groceries">Groceries</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amountMin" className="text-sm">
                      Amount (Min)
                    </Label>
                    <Input
                      id="amountMin"
                      name="amountMin"
                      type="number"
                      placeholder="1"
                      defaultValue={GET.amountMin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amountMax" className="text-sm">
                      Amount (Max)
                    </Label>
                    <Input
                      id="amountMax"
                      name="amountMax"
                      type="number"
                      placeholder="1000"
                      defaultValue={GET.amountMax}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateRange" className="text-sm">
                    Date Range
                  </Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="dateRange"
                        variant="default"
                        className="w-full justify-start text-left font-normal text-sm"
                      >
                        <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 !bg-white" align="start">
                      <Calendar
                        mode="single"
                        onSelect={(date) => {
                          setDate(date);
                          setIsCalendarOpen(false);
                        }}
                      >
                      </Calendar>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perPage" className="text-sm">
                    Per Page
                  </Label>
                  <Select
                    defaultValue="10"
                    name="perPage"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select per page" />
                    </SelectTrigger>
                    <SelectContent className="!bg-white">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="default"
                    type="button"
                    onClick={() =>
                      console.log("clear form")
                    }
                  >
                    Reset Filters
                  </Button>
                  <Button variant="secondary" type="submit">Apply Filters</Button>
                </div>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">Date</TableHead>
              <TableHead className="text-sm">Category</TableHead>
              <TableHead className="text-sm">Description</TableHead>
              <TableHead className="text-sm text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">{item.date}</TableCell>
                  <TableCell className="text-sm">{item.category}</TableCell>
                  <TableCell className="text-sm">{item.description}</TableCell>
                  <TableCell className="text-sm text-right">${item.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button variant="default" size="sm" className="text-sm hover:shadow transition-shadow">
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button variant="default" size="sm" className="text-sm">
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
    </QueryClientProvider>
  )
}

function CalendarDaysIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}
