import { useMutation } from '@tanstack/react-query'
import { CardRequestsService } from './card-requests.service'
import type { CreateCardRequest } from './card-requests.types'

export function useSubmitCardRequest() {
  return useMutation({ mutationFn: (body: CreateCardRequest) => CardRequestsService.submit(body) })
}
