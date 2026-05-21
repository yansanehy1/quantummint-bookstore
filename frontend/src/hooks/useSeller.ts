import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export const useSellerStats = () => {
  return useQuery({
    queryKey: ['seller', 'stats'],
    queryFn: () => api.seller.getEarnings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSellerProfile = () => {
  return useQuery({
    queryKey: ['seller', 'profile'],
    queryFn: () => api.seller.getProfile(),
  });
};

export const usePayoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; currency: 'USD' | 'SLL'; method: string }) => 
      api.seller.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'stats'] });
    },
  });
};
