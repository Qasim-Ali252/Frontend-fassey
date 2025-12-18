import { useQuery } from "@tanstack/react-query";
import { fetchProductsByGender } from "../api/productApi";

export const useProductsByGender = (gender) =>
  useQuery(["products", gender], () => fetchProductsByGender(gender), {
    enabled: !!gender,
  });
