"use client";

import React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function AddExpense(){
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-2">New Expense 💸</h2>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="secondary">+ Add new</Button>
                </DrawerTrigger>
                <DrawerContent className=" !bg-white">
                    <DrawerHeader>
                        <DrawerTitle>Adding new expense to the list 💸</DrawerTitle>
                        <DrawerDescription>You can also modify this later.</DrawerDescription>
                    </DrawerHeader>
                        <div className="px-4 gap-y-5 flex flex-col">
                            <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input type="number" min={1} id="amount" placeholder="Php" />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Input type="text" minLength={3} id="description" placeholder="Lunch" />
                            </div>
                        </div>
                    <DrawerFooter>
                        <Button variant="secondary">Submit</Button>
                        <DrawerClose>
                            <Button className=" w-full">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
        )
}