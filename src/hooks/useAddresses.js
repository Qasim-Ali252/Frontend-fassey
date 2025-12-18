// src/hooks/useAddresses.js 

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Import the placeholder functions from the file we just created
import { 
    fetchUserAddresses, 
    saveAddress, 
    deleteAddress 
} from "../api/addressesApi"; 

const ADDRESSES_QUERY_KEY = ["userAddresses"];

export const useAddresses = () => {
    const queryClient = useQueryClient();

    // 1. Query to fetch all saved addresses
    const query = useQuery({
        queryKey: ADDRESSES_QUERY_KEY,
        queryFn: fetchUserAddresses,
        staleTime: 1000 * 60 * 5, 
    });

    // 2. Mutation to add or update an address
    const saveMutation = useMutation({
        mutationFn: saveAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
            alert("Address operation successful (MOCK).");
        },
        onError: (error) => {
            console.error("Failed to save address:", error);
            alert(`Error saving address: ${error.message}`);
        }
    });

    // 3. Mutation to delete an address
    const deleteMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
            alert("Address deleted successfully (MOCK).");
        },
        onError: (error) => {
            console.error("Failed to delete address:", error);
            alert(`Error deleting address: ${error.message}`);
        }
    });

    return {
        // We expect the API to return { data: address_array }
        addresses: query.data?.data || [], 
        isLoading: query.isLoading,
        isError: query.isError,

        // Mutations
        saveAddress: saveMutation.mutate,
        deleteAddress: deleteMutation.mutate,
        isSaving: saveMutation.isLoading,
        isDeleting: deleteMutation.isLoading,
    };
};