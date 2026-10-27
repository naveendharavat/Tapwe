import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminService } from './admin.service'
import type { CardFilter, CardInput, CardRequestStatus, ChangeRequestStatus } from './admin.types'

export const adminKeys = {
  cards: ['admin', 'cards'] as const,
  cardList: (filter: CardFilter) => [...adminKeys.cards, filter] as const,
  cardRequests: ['admin', 'card-requests'] as const,
  changeRequests: ['admin', 'change-requests'] as const,
  users: ['admin', 'users'] as const,
}

export function useAdminCards(filter: CardFilter = {}) {
  return useQuery({
    queryKey: adminKeys.cardList(filter),
    queryFn: () => AdminService.listCards(filter),
    placeholderData: keepPreviousData,
  })
}

export function useSaveCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ code, body }: { code?: string; body: CardInput }) =>
      code ? AdminService.updateCard(code, body) : AdminService.createCard(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.cards })
      void queryClient.invalidateQueries({ queryKey: adminKeys.changeRequests })
    },
  })
}

export function useCardRequests() {
  return useQuery({ queryKey: adminKeys.cardRequests, queryFn: AdminService.listCardRequests })
}

export function useUpdateCardRequestStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: CardRequestStatus }) => AdminService.updateCardRequestStatus(id, status),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: adminKeys.cardRequests }),
  })
}

export function useChangeRequests() {
  return useQuery({ queryKey: adminKeys.changeRequests, queryFn: AdminService.listChangeRequests })
}

export function useUpdateChangeRequestStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ChangeRequestStatus }) => AdminService.updateChangeRequestStatus(id, status),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: adminKeys.changeRequests }),
  })
}

export function useAdminUsers() {
  return useQuery({ queryKey: adminKeys.users, queryFn: AdminService.listUsers })
}
