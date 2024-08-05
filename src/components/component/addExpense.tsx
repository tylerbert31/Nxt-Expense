import React from "react";
import { revalidatePath } from "next/cache";
import { Expenses } from "@/lib/model/pocketbase";
import FormButton from "./minified/form_btn";

const addExpense = async (e: FormData) => {
    "use server";

    const amount = e.get("amount");
    const description = e.get("description");

    if(!amount || !description){
        return { message: "Invalid data" };
    }

    await Expenses.save({
        amount: Number(amount),
        description: String(description),
    });

    revalidatePath("/");
}

export default function AddExpense(){
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-2">New Expense 💸</h2>
            <form action={addExpense} className="max-w-full flex flex-row gap-3">
                <input
                    type="number"
                    placeholder="₱ 0.00"
                    name="amount"
                    className="border border-gray-300 rounded-lg p-2 w-1/2"
                    min={1}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    name="description"
                    className="border border-gray-300 rounded-lg p-2 w-1/2"
                    minLength={3}
                    required
                />
                <FormButton />
            </form>
        </div>
        )
}