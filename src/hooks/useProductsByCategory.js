import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../api/productApi";

export const useProductsByCategory = (name, gender) =>
  useQuery(
    ["productsByCategory", name, gender],
    () => fetchProductsByCategory(name, gender),
    { enabled: !!name && !!gender }
  );
