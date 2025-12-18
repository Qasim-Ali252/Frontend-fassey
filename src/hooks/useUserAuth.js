// src/hooks/useUserAuth.js (FINALIZED WITH LOGOUT)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Import all finalized API functions, including logoutUser
import { fetchUserProfile, loginUser, registerUser, logoutUser } from "../api/userAuthApi"; 

const USER_QUERY_KEY = ["user"];

/**
 * Custom hook to manage all customer authentication state and actions.
 */
export const useUserAuth = () => {
    const queryClient = useQueryClient();

    // --- QUERY: Get current user profile (Persistence) ---
    // Completely disable automatic fetching to prevent infinite calls
    const { data: user, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: USER_QUERY_KEY,
        queryFn: fetchUserProfile,
        staleTime: 1000 * 60 * 5,
        enabled: false, // Disable automatic fetching
        retry: false, // Completely disable retries
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
    
    // Since query is disabled by default, user is not authenticated unless we have successful data
    const isAuthenticated = isSuccess && !!user;
    const hasConnectionError = isError && (
        error?.code === 'ERR_NETWORK' || 
        error?.code === 'ERR_CONNECTION_REFUSED' ||
        error?.message?.includes('ERR_CONNECTION_REFUSED')
    );
    
    // Check if user is not authenticated (400/401/403 errors)
    const isUnauthenticated = isError && (
        error?.response?.status === 400 || 
        error?.response?.status === 401 || 
        error?.response?.status === 403
    );

    // --- MUTATION HANDLER ---
    const invalidateUserQuery = () => {
        // Forces the useQuery above to re-fetch the profile data
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    };

    // --- MUTATION: Login (using /signin) ---
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // Manually trigger the user profile fetch after successful login
            refetch();
            alert(`Welcome back, ${data.name || 'Customer'}!`);
        },
    });

    // --- MUTATION: Register (using /signup) ---
    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            // We usually just navigate to login after signup, no need to invalidate 
            // the user query unless the backend logs them in immediately.
            alert(`Registration successful! Welcome, ${data.name}.`);
        },
    });
    
    // --- MUTATION: Logout (using /signout) ---
    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            // Immediately clear the user data in the cache to reflect logged-out state
            queryClient.setQueryData(USER_QUERY_KEY, null);
            // Optionally, you might invalidate to ensure all associated user data is cleared
            queryClient.invalidateQueries(); 
            alert("You have been logged out.");
        },
    });

    return {
        user,
        isAuthenticated,
        isLoading: isLoading && !hasConnectionError && !isUnauthenticated, // Stop loading if connection error or unauthenticated
        hasConnectionError,
        isUnauthenticated,
        refetch, // Allow manual retry
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isLoading,
        isRegistering: registerMutation.isLoading,
        isLoggingOut: logoutMutation.isLoading,
    };
};