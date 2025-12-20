// src/hooks/useUserAuth.js 

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, loginUser, registerUser, logoutUser } from "../api/userAuthApi"; 

const USER_QUERY_KEY = ["user"];

/**
 * Custom hook to manage all customer authentication state and actions.
 * Optimized to prevent logout on page refresh.
 */
export const useUserAuth = () => {
    const queryClient = useQueryClient();

    // --- QUERY: Get current user profile (Persistence) ---
    const { data: user, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: USER_QUERY_KEY,
        queryFn: fetchUserProfile,
        staleTime: 1000 * 60 * 5,
        // FIX: Enable automatic fetching ONLY if a token exists in storage
        enabled: !!localStorage.getItem("access_token"), 
        retry: false, 
        refetchOnWindowFocus: false,
    });
    
    // FIX: Authenticated if we have a token (Immediate) OR successful user data (Verified)
    const isAuthenticated = !!localStorage.getItem("access_token") || (isSuccess && !!user);

    const hasConnectionError = isError && (
        error?.code === 'ERR_NETWORK' || 
        error?.code === 'ERR_CONNECTION_REFUSED' ||
        error?.message?.includes('ERR_CONNECTION_REFUSED')
    );
    
    const isUnauthenticated = isError && (
        error?.response?.status === 401 || 
        error?.response?.status === 403
    );

    // --- MUTATION: Login ---
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // Ensure token is stored before refetching profile
            if (data.token) localStorage.setItem("access_token", data.token);
            refetch();
        },
    });

    // --- MUTATION: Register ---
    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            alert(`Registration successful! Welcome, ${data.name}.`);
        },
    });
    
    // --- MUTATION: Logout ---
    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            // Clear token and cache
            localStorage.removeItem("access_token");
            queryClient.setQueryData(USER_QUERY_KEY, null);
            queryClient.invalidateQueries(); 
            window.location.href = "/login";
        },
    });

    return {
        user,
        isAuthenticated,
        // Maintain loading state only while actively fetching and no errors exist
        isLoading: isLoading && !hasConnectionError && !isUnauthenticated, 
        hasConnectionError,
        isUnauthenticated,
        refetch, 
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isLoading,
        isRegistering: registerMutation.isLoading,
        isLoggingOut: logoutMutation.isLoading,
    };
};