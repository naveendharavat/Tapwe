import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { PublicCardsService } from './public.service'

export function usePublicCard(code: string) {
  return useQuery({
    queryKey: ['public-card', code],
    queryFn: () => PublicCardsService.resolve(code),
    // Each resolve records a tap, so never refetch on its own.
    staleTime: Infinity,
    retry: (count, error) => !(isAxiosError(error) && error.response?.status === 404) && count < 1,
  })
}
