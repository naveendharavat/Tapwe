import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { analyticsKeys } from '../analytics/analytics.queries'
import { CardsService } from './cards.service'

export const cardKeys = {
  all: ['cards'] as const,
}

export function useCards() {
  return useQuery({ queryKey: cardKeys.all, queryFn: CardsService.list })
}

export function useDeleteCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => CardsService.remove(code),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cardKeys.all })
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.summary })
    },
  })
}

export function useRequestCardChange() {
  return useMutation({
    mutationFn: ({ code, message }: { code: string; message: string }) => CardsService.requestChange(code, message),
  })
}
