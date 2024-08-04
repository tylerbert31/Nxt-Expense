import { NextResponse } from "next/server";
import { Expenses } from "@/lib/model/pocketbase";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const reqBody = await req.json();
  const user = await currentUser();

  const page = reqBody.page ?? 1;

  const purchaes = await Expenses.findMyExpenses(page, 10);

  return NextResponse.json(
    {
      data: purchaes,
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
    const res = await Expenses.save(reqBody);
    console.log(res);
  }

  return NextResponse.json(resData, { status: status });
}
