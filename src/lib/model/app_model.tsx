import PocketBase from "pocketbase";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { ExpenseSchema, DateTimeSchema, DateSchema } from "../types";
import { format } from "date-fns";
import { z } from "zod";
import NodeCache from "node-cache";

export const prisma = new PrismaClient();
export const pb = new PocketBase(process.env.PB_URL);
const memCache = new NodeCache({ stdTTL: 60 * 60 * 1 });

pb.autoCancellation(false);

class AppModel {
  collection: string;
  user: any;

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
          category: true,
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

  /**
   * Find the sum of expenses for today
   * @returns {Promise<number | any>}
   */
  async sumToday(date: string | null = null): Promise<number | any> {
    const { year, month, day, startTime, endTime } = this.getDateBreakdown(date);
    const user = await currentUser();

    if (!user) {
      return { message: "Unauthorized" };
    }

    const data = this.sumBetween(String(startTime), String(endTime));

    return data;
  }

  /**
   * Get Sum of expenses from the last 7 days
   * @returns {Promise<number>}
   */
  async sum7Days(): Promise<number> {
    // const cacheKey = `sum7Days`;
    // const cache = await this.getCache(cacheKey);

    // if(cache != null){
    //   return cache as number;
    // }

    const data =  await this.calculateSumFromDaysToToday(7);
    // this.setCache(cacheKey, data);

    return data;
  }

  async sum30Days(): Promise<number> {
    // const cacheKey = `sum30Days`;
    // const cache = await this.getCache(cacheKey);

    // if(cache != null){
    //   return cache as number;
    // }

    const data =  await this.calculateSumFromDaysToToday(30);
    // this.setCache(cacheKey, data);

    return data;
  }

  /**
   * Get the sum of expenses from n days to today
   * @param days {number} sum from n days to today
   * @returns {Promise<number>}
   */
  async calculateSumFromDaysToToday(days: number): Promise<number> {
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - days);
    const dateLatest = this.getDateBreakdown();
    const dateAWeekAgo = this.getDateBreakdown(format(aWeekAgo, "yyyy-MM-dd"));

    const start = String(dateAWeekAgo.startTime);
    const end = String(dateLatest.endTime);

    return await this.sumBetween(start, end);
  }

  async sumBetween(from: String, to: String): Promise<number | any> {
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

  async save(data: z.infer<typeof ExpenseSchema>): Promise<boolean | any> {
    const validate = ExpenseSchema.safeParse(data);
    const user = await currentUser();
    this.user = user;

    if (!validate.success) {
      return { message: validate.error.flatten().fieldErrors, status: 400 };
    }

    if (!user) {
      return { message: "User not found", status: 401 };
    }

    try {
      await prisma.expense.create({
        data: {
          user_id: user.id,
          ...data,
        },
      })

      return true;
    } catch (error) {
      return false;
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

  /**
   * Set Cache data
   * @param key {string} Cache Key
   * @param data {any} Data to be cached
   */
  async setCache(key: string, data: any) {
    const user = await currentUser();
    if (!user) {
      return;
    }

    const userKey = `${user.id}-${key}`;
    memCache.set(userKey, data);
    console.log(`Cache set : ${userKey}`);
  }

  /**
   * Get cached data
   * @param key {string} Cache Key
   */
  async getCache(key: string) {
    const user = await currentUser();
    if (!user) {
      return;
    }

    const userKey = `${user.id}-${key}`;
    const cachedData =  memCache.get(userKey);

    if(cachedData){
      console.log(`Cache hit : ${userKey}`);
    }
    return cachedData;
  }

  /**
   * Delete cached data
   * @param key {string} Cache Key
   */
  deleteCache(key: string) {
    const user = this.user;
    if (!user) {
      return;
    }

    console.log(`Cache deleted : ${user.id}-${key}`);

    const userKey = `${user.id}-${key}`;
    memCache.del(userKey);
  }
}

export default AppModel;
