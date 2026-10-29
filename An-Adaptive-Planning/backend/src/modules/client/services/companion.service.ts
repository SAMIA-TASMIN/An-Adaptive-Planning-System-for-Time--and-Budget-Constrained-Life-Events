import { cleanDraft, talk } from '../../../utils/companion.js'

export default {
  chat: (message: string, draft: unknown) => talk(message.slice(0, 500), cleanDraft(draft)),
}
