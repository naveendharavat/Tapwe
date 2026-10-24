import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cardKeys } from '../cards/cards.queries'
import { ProfileService } from './profile.service'

export const profileKeys = {
  mine: ['profile'] as const,
}

export function useProfile() {
  return useQuery({ queryKey: profileKeys.mine, queryFn: ProfileService.get })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ProfileService.update,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.mine, profile)
      // Profile cards show the business name as their destination label.
      void queryClient.invalidateQueries({ queryKey: cardKeys.all })
    },
  })
}
