import { copyText } from '../../lib/clipboard'
import { useToast } from '../toast/toast-context'

export function useCopyCardUrl() {
  const { toast } = useToast()
  return async (url: string) => {
    if (await copyText(url)) toast('Card URL copied to clipboard.')
    else toast('Could not copy. Select the URL and copy it manually.', 'error')
  }
}
