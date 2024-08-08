"use client";

import React, { useRef } from "react";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
} from "@/components/ui/form"
import { ExpCategory, ExpenseSchema } from "@/lib/types";
import { z } from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format} from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";

type Expense = z.infer<typeof ExpenseSchema>;

export default function AddExpense(){
    const router = useRouter();
    const closeBtn = useRef<HTMLButtonElement>(null);
    const [isCalendarOpen, setisCalendarOpen] = React.useState(false);

    const form = useForm<Expense>({
        defaultValues: {
            category: 0
        }
    });

    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = form;

    /**
     * Submits the expense after being validated
     * @param data {Expense}
     */
    const submitExpense: SubmitHandler<Expense> = async (data: Expense) => {
        const customDate = data.customCreatedAt ? new Date(data.customCreatedAt) : new Date();
        if(data.customCreatedAt){
            customDate.setDate(customDate.getDate() + 1); //Fix Date bug
        }

        const expense: Expense = {
            amount: Number(data.amount),
            description: data.description,
            category: Number(data.category),
            customCreatedAt: customDate.toISOString(),
        }
        console.log(expense);

        const res = await axios.post("/api/expense", expense)
            .then((res) => {console.log(res.data)})
            .catch((error) => console.warn(error));

        reset();
        if(closeBtn.current) closeBtn.current.click();
        router.refresh();
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-2">New Expense 💸</h2>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="secondary">+ Add new</Button>
                </DrawerTrigger>
                <DrawerContent style={{pointerEvents: "auto"}} className=" !bg-white !cursor-auto !pointer-events-auto">
                    <DrawerHeader>
                        <DrawerTitle>Adding new expense to the list 💸</DrawerTitle>
                        <DrawerDescription>You can also modify this later.</DrawerDescription>
                    </DrawerHeader>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(submitExpense)} className="px-4 gap-y-5 flex flex-col">
                                <div>
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input {...register('amount', {
                                        required: "Amount is required",
                                        min: { value: 1, message: "Amount should be greater than 0" }
                                    })} type="number" id="amount" placeholder="₱ 10" />
                                    {errors.amount && (
                                        <div className="text-red-500 text-xs pt-2 pl-1">{errors.amount.message}</div>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input {...register('description', {
                                        required: "Description is required",
                                        minLength: { value: 3, message: "Description should be at least 3 characters long" }
                                    })} type="text" id="description" placeholder="Lunch" />
                                    {errors.description && (
                                        <div className="text-red-500 text-xs pt-2 pl-1">{errors.description.message}</div>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={String(field.value)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue defaultValue={0} placeholder="🍽️ Food" />
                                                </SelectTrigger>
                                                <SelectContent id="category" className="!bg-white !cursor-auto !pointer-events-auto">
                                                    <SelectGroup>
                                                        {ExpCategory.map((category) => (
                                                            <SelectItem key={category.id} value={String(category.id)}>
                                                                {`${category.emoji} ${category.text}`}
                                                            </SelectItem>
                                                        ))}
                                                        <SelectItem value="pineapple">Pineapple</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        name="customCreatedAt"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Custom Date <span className="opacity-30">(Optional)</span></FormLabel>
                                                <Popover open={isCalendarOpen} onOpenChange={setisCalendarOpen}>
                                                    <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !value && "text-muted-foreground"
                                                        )}
                                                        >
                                                        {value ? (
                                                            format(value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-auto p-0" align="start">
                                                        
                                                    <Calendar
                                                        mode="single"
                                                        onSelect={onChange}
                                                        onDayClick={() => setisCalendarOpen(false)}
                                                        className="!bg-white"
                                                        disabled={{ after: new Date() }}
                                                    />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button disabled={isSubmitting} variant="secondary">
                                    {isSubmitting ? "Saving..." : "Submit"}
                                </Button>
                            </form>
                        </Form>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button onClick={() => reset()} ref={closeBtn} className=" w-full">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
        )
}