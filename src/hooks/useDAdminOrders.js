import { useQuery } from "@tanstack/react-query";
import { getAdminOrdersAPI } from "../../api/orderApi";

export const useAdminOrders = (page, status) => {
  return useQuery({
    queryKey: ["admin-orders", page, status],
    queryFn: async () => {
      const res = await getAdminOrdersAPI(page, status);
      return res.data || res;
    },
  });
};
