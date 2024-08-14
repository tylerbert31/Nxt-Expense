import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getExpensePurchase = (conditions: string = '') => {
  return useQuery({
    queryKey: ["purchases", conditions],
    queryFn: () => axios.get("/api/expense?" + conditions),
  });
};
