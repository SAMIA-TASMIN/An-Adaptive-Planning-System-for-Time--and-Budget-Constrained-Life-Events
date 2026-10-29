import { cleanDraft, talk } from '../../../utils/companion.js'
export default {
  chat: (message, draft) => talk(message.slice(0, 500), cleanDraft(draft)),
}
