import React from "react";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    Table,
    TableCell,
  } from "@/components/ui/table";
  import { formatDistance } from "date-fns";
import { Expenses } from "@/lib/model/pocketbase";

export default async function PurchaseTable(){

    const myPurcahes = await Expenses.findMyExpenses(1, 10);
    const items = myPurcahes.items;

    return (
        <>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Purchased</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {items &&
                    items.map((item: any) => (
                    <TableRow key={item.id}>
                        <TableCell>
                        {formatDistance(item.customCreatedAt, new Date(), {
                            addSuffix: true,
                        })}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>₱ {item.amount}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
        )
}