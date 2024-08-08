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

