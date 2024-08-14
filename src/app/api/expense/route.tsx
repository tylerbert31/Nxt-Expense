import { NextRequest, NextResponse } from "next/server";
import { Expenses } from "@/lib/model/pocketbase";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
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

      if(res !== true){
        status = res.status;
        resData = { message: res.message };
      }
    } catch (error) {
      status = 500;
      resData = { message: "Error saving expense" };
    }
  }

  return NextResponse.json(resData, { status: status });
}

export async function GET(req: NextRequest) {
  const user = await currentUser();
  let status = 200;
  let resData = { message: "Success" };

  const url = new URL(req.url);
  const queryParams = url.searchParams;

  // console.log(queryParams.get("perPage"));


  return NextResponse.json(resData, { status: status });
}
