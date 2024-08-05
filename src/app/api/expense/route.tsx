import { NextResponse } from "next/server";
import { Expenses } from "@/lib/model/pocketbase";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const reqBody = await req.json();
  const user = await currentUser();

  const page = reqBody.page ?? 1;

  const purchase = await Expenses.findMyExpenses(page, 10);

  return NextResponse.json(
    {
      data: purchase,
    },
    { status: 200 }
  );
}

export async function PUT(req: Request) {
  const reqBody = await req.json();
  const user = await currentUser();
  let status = 200;
  let resData = { message: "Success" };

  if (!user) {
    status = 401;
    resData.message = "Unauthorized";
  } else {
    try {
      const res = await Expenses.save(reqBody);
      revalidatePath("/");
    } catch (error) {
      status = 500;
      resData = { message: "Error saving expense" };
    }
  }

  return NextResponse.json(resData, { status: status });
}
