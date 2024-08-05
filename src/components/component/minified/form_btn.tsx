"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function FormButton(){
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} type="submit" variant="secondary">
            +
        </Button>
    )
}