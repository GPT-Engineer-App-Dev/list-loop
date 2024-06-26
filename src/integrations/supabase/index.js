import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

Pumps // table: pumps
    id: number
    name: string
    latitude: number
    longitude: number
    bilventil: string
    cykelventil: string
    racer_ventil: string
    address: string
    status: string
    model: string
    comment: string

PumpsDuplicate // table: pumps_duplicate
    id: number
    name: string
    latitude: number
    longitude: number
    bilventil: boolean
    cykelventil: boolean

*/

// Hooks for models

export const usePumps = () => useQuery({
    queryKey: ['pumps'],
    queryFn: () => fromSupabase(supabase.from('pumps').select('*')),
});

export const useAddPumps = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPump) => {
            const { id, ...pumpData } = newPump; // Exclude the id field
            return fromSupabase(supabase.from('pumps').insert([pumpData]));
        },
        onSuccess: () => {
            queryClient.invalidateQueries('pumps');
        },
    });
};

export const usePumpsDuplicate = () => useQuery({
    queryKey: ['pumps_duplicate'],
    queryFn: () => fromSupabase(supabase.from('pumps_duplicate').select('*')),
});

export const useAddPumpsDuplicate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPumpDuplicate) => fromSupabase(supabase.from('pumps_duplicate').insert([newPumpDuplicate])),
        onSuccess: () => {
            queryClient.invalidateQueries('pumps_duplicate');
        },
    });
};