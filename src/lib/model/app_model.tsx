import PocketBase from "pocketbase";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { ExpenseSchema, DateTimeSchema, DateSchema } from "../types";
import { format } from "date-fns";
import { z } from "zod";

export const prisma = new PrismaClient();

export const pb = new PocketBase(process.env.PB_URL);
pb.autoCancellation(false);

class AppModel {
  collection: string;

  constructor(collection_name: string) {
    this.collection = collection_name;
  }

  /**
   *  Find all expenses of the current user
   * @example { count, items }
   */
  async findMyExpenses(page: number = 1, limit: number = 10): Promise<any> {
    const user = await currentUser();

    if (!user) {
      return { message: "Unauthorized", status: 401 };
    }

    const userCondition = {
      user_id: {
        equals: user.id,
      },
    };

    const getCount = async () => {
      return await prisma.expense.count({
        where: userCondition,
      });
    };

    const getItems = async () => {
      return await prisma.expense.findMany({
        where: userCondition,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          customCreatedAt: "desc",
        },
        select: {
          id: true,
          amount: true,
          description: true,
          customCreatedAt: true,
        },
      });
    };

    try {
      const [count, items] = await Promise.all([getCount(), getItems()]);

      const totalPages = Math.ceil(count / limit);

      const data = {
        totalCount: count,
        totalPages,
        currentPage: page,
        items,
      };

      return data;
    } catch (error) {
      return error;
    }
  }

  async findToday() {
    const { year, month, day } = this.getDateBreakdown();
    const user = await currentUser();

    if (!user) {
      return { message: "Unauthorized" };
    }

    const res = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: user.id,
        customCreatedAt: {
          gte: new Date(Date.UTC(year, month, day, 0, 0, 0)),
          lte: new Date(Date.UTC(year, month, day, 23, 59, 59)),
        },
      },
    });

    return res._sum.amount;
  }

  async sumBetween(from: String, to: String) {
    const fromValidate = DateTimeSchema.safeParse(from);
    const toValidate = DateTimeSchema.safeParse(to);
    const user = await currentUser();

    if (!user) {
      return { message: "Unauthorized" };
    }

    if (!fromValidate.success || !toValidate.success) {
      return { message: "Invalid Date Format" };
    }

    const res = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: user.id,
        customCreatedAt: {
          gte: fromValidate.data,
          lte: toValidate.data,
        },
      },
    });

    return res._sum.amount;
  }

  async findById(id: string, conditions: any = null) {
    try {
      const res = await pb.collection(this.collection).getOne(id, conditions);
      return res;
    } catch (error) {
      return error;
    }
  }

  async findOne(conditions: any = null) {
    return 0;
    try {
      const res = await pb
        .collection(this.collection)
        .getFirstListItem(conditions);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async findAll(conditions: any = null) {
    const res = await pb.collection(this.collection).getFullList(conditions);
    return res;
  }

  async findPaginated(page: number = 1, limit: number, conditions: any = null) {
    limit = limit ?? 10;
    try {
      const res = await pb
        .collection(this.collection)
        .getList(page, limit, conditions);
      return res;
    } catch (error) {
      return error;
    }
  }

  async save(data: z.infer<typeof ExpenseSchema>) {
    const validate = ExpenseSchema.safeParse(data);
    const user = await currentUser();

    if (!validate.success) {
      return { message: validate.error.flatten().fieldErrors };
    }

    if (!user) {
      return { message: "User not found" };
    }

    try {
      const res = await prisma.expense.create({
        data: {
          user_id: user.id,
          ...data,
        },
      });

      return res;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, data: any) {
    const isExists = await pb.collection(this.collection).getOne(id);
    if (!isExists) {
      return { message: "Not Found", status: 404 };
    }
    try {
      const res = await pb.collection(this.collection).update(id, data);
      return res;
    } catch (error) {
      return error;
    }
  }

  async delete(id: string) {
    const isExists = await pb.collection(this.collection).getOne(id);
    if (!isExists) {
      return { message: "Not Found", status: 404 };
    }
    try {
      const res = await pb.collection(this.collection).delete(id);
      return res;
    } catch (error) {
      return error;
    }
  }

  getDateBreakdown(date: z.infer<typeof DateSchema> = null) {
    let current: Date;

    if (date) {
      if (!DateSchema.safeParse(date).success) {
        return {
          year: 0,
          month: 0,
          day: 0,
          startTime: 0,
          endTime: 0,
          message: "Invalid Date Format",
        };
      }
      current = new Date(date);
    } else {
      current = new Date();
    }

    const year = parseInt(format(current, "y"));
    const month = parseInt(format(current, "M")) - 1;
    const day = parseInt(format(current, "d"));

    const startTime = new Date(
      Date.UTC(year, month, day, 0, 0, 0)
    ).toISOString();

    const endTime = new Date(
      Date.UTC(year, month, day, 23, 59, 59)
    ).toISOString();

    return { year, month, day, startTime, endTime };
  }
}

export default AppModel;
