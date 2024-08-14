import { z } from "zod";

export const ExpenseSchema = z.object({
  user_id: z
    .string({
      required_error: "User ID is required",
    })
    .min(32, {
      message: "User ID is invalid",
    })
    .optional(),
  amount: z.number().min(1, {
    message: "Amount should be greater than 0",
  }),
  description: z.string().min(3),
  category: z.number().int().min(0).max(10),
  customCreatedAt: z.string().datetime().optional(),
});

export const DateTimeSchema = z.string().datetime();
export const DateSchema = z.string().date().optional().nullable();


export interface Query extends URLSearchParams{
  description?: String;
  category?: String;
  amountMin?: String;
  amountMax?: String;
  date?: String;
  perPage?: String;
  page?: String;
};

export interface TypeGet {
  description: String | null;
  category: number | null;
  amountMin: number | null;
  amountMax: number | null;
  date: String | null;
  perPage: number;
  page: number;
}

export type ExpenseResults = {
  id: number;
  amount: number;
  description: string;
  category: number;
  customCreatedAt: string;
}
export interface TypeResults {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  items: ExpenseResults[];
}

export const ExpCategory = [
  {
    id: 0,
    text: "Food",
    emoji: "🍽️",
  },
  {
    id: 1,
    text: "Housing",
    emoji: "🏠",
  },
  {
    id: 2,
    text: "Utilities",
    emoji: "💡",
  },
  {
    id: 3,
    text: "Transportation",
    emoji: "🚗",
  },
  {
    id: 4,
    text: "Healthcare",
    emoji: "💊",
  },
  {
    id: 5,
    text: "Entertainment",
    emoji: "🎉",
  },
  {
    id: 6,
    text: "Clothing",
    emoji: "👗",
  },
  {
    id: 7,
    text: "Savings",
    emoji: "💰",
  },
  {
    id: 8,
    text: "Education",
    emoji: "📚",
  },
  {
    id: 9,
    text: "Miscellaneous",
    emoji: "📦",
  },
  {
    id: 10,
    text: "Other",
    emoji: "💸",
  }
];

