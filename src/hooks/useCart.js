// src/hooks/useCart.js

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAuth } from "./useUserAuth";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkoutCart,
} from "../api/cartApi";

/**
 * useCart Hook
 * High-performance cart management with Optimistic Updates.
 * Handles stock limit errors and cross-site synchronization.
 */
export const useCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUserAuth();
  const cart_id = localStorage.getItem("cart_id");
  const queryKey = ["cart"];

  // 1. Fetch Cart Query - Only when user is authenticated
  const { data: cartData, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchCart(cart_id),
    enabled: isAuthenticated, // Only fetch cart when user is authenticated
    select: (data) => {
      const items = data?.items || [];
      // Calculate total quantity for badges
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      // Use backend subtotal or calculate it as a fallback
      const subtotal = data?.total ?? items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      
      return { 
        ...data, 
        items, 
        totalItems, 
        subtotal 
      };
    },
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins to prevent flicker
  });

  // 2. Sync Navbar Badge & Local Storage
  useEffect(() => {
    if (cartData) {
      const count = cartData.totalItems || 0;
      localStorage.setItem("cart_count", String(count));
      // Trigger storage event for Navbar re-render
      window.dispatchEvent(new Event('storage'));
    }
  }, [cartData?.totalItems]);

  // 3. Helper to refresh/rollback the cart data
  const invalidateCart = () => queryClient.invalidateQueries({ queryKey });

  // 4. Mutations with Optimistic Updates Integration
  const addItemMutation = useMutation({ 
    mutationFn: addToCart, 
    onSuccess: invalidateCart 
  });

  const updateItemMutation = useMutation({ 
    mutationFn: updateCartItem,
    // INSTANT UI UPDATE LOGIC (Optimistic)
    onMutate: async ({ sku, quantity }) => {
      // Cancel outgoing fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value for rollback if the server fails
      const previousCart = queryClient.getQueryData(queryKey);
      
      // Instantly update the UI cache
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        const updatedItems = old.items.map(item => 
          item.sku === sku ? { ...item, quantity } : item
        );
        return { ...old, items: updatedItems };
      });
      
      return { previousCart };
    },
    // ROLLBACK: If stock is insufficient, jump back to previous state
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousCart);
    },
    onSettled: invalidateCart 
  });

  const removeItemMutation = useMutation({ 
    mutationFn: removeCartItem,
    // INSTANT REMOVAL LOGIC (Optimistic)
    onMutate: async ({ sku }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        // Filter by SKU to match API logic
        return { 
          ...old, 
          items: old.items.filter(item => item.sku !== sku) 
        };
      });
      
      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousCart);
    },
    onSettled: invalidateCart 
  });

  const clearCartMutation = useMutation({ 
    mutationFn: clearCart, 
    onSuccess: invalidateCart 
  });

  const checkoutCartMutation = useMutation({ 
    mutationFn: checkoutCart, 
    onSuccess: invalidateCart 
  });

  // 5. Return Unified State, Actions, and Statuses
  // Provide empty cart data when user is not authenticated
  const defaultCartData = {
    items: [],
    subtotal: 0,
    totalItems: 0
  };
  
  const currentCartData = isAuthenticated ? cartData : defaultCartData;
  
  return {
    // Data
    cart: currentCartData,
    items: currentCartData?.items || [],
    subtotal: currentCartData?.subtotal || 0,
    totalItems: currentCartData?.totalItems || 0,
    
    // Status
    isLoading,
    isError,
    error,
    
    // Actions
    addToCart: addItemMutation.mutate,
    updateCartItem: updateItemMutation.mutate,
    removeCartItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    checkoutCart: checkoutCartMutation.mutate,
    refetch,

    // Error Objects (Used for Stock limit inline messages)
    updateError: updateItemMutation.error,
    removeError: removeItemMutation.error,
    removeSuccess: removeItemMutation.isSuccess,

    // Loading States for UI feedback
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
    isCheckingOut: checkoutCartMutation.isPending,
  };
};