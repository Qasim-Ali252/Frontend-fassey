import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminOrders, updateOrderStatus } from "../api/adminApi";

export const useAdminOrders = (page = 1, limit = 10, status = '') => {
  return useQuery({
    queryKey: ["admin-orders", page, limit, status],
    queryFn: () => getAdminOrders(page, limit, status),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};