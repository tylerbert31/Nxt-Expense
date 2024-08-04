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
  amount: z.number().min(0, {
    message: "Amount should be greater than 0",
  }),
  description: z.string(),
  customCreatedAt: z.string().datetime().optional(),
});

export const DateTimeSchema = z.string().datetime();
export const DateSchema = z.string().date().optional().nullable();
export const ExpenseCategorySchema = z.number().int().min(0).max(9);

export const ExpCategory = {
  "0": {
    text: "Housing",
    emoji: "🏠",
  },
  "1": {
    text: "Utilities",
    emoji: "💡",
  },
  "2": {
    text: "Food",
    emoji: "🍽️",
  },
  "3": {
    text: "Transportation",
    emoji: "🚗",
  },
  "4": {
    text: "Healthcare",
    emoji: "💊",
  },
  "5": {
    text: "Entertainment",
    emoji: "🎉",
  },
  "6": {
    text: "Clothing",
    emoji: "👗",
  },
  "7": {
    text: "Savings",
    emoji: "💰",
  },
  "8": {
    text: "Education",
    emoji: "📚",
  },
  "9": {
    text: "Miscellaneous",
    emoji: "📦",
  },
};
