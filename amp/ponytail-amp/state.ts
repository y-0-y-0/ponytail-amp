import type { ThreadID, ThreadMessageID } from '@ampcode/plugin'
import type { Level } from './instructions.ts'

export class ThreadState {
  private levels = new Map<ThreadID, Level>()
  private injected = new Map<ThreadID, Set<ThreadMessageID>>()

  level(id: ThreadID): Level {
    return this.levels.get(id) ?? 'full'
  }

  setLevel(id: ThreadID, level: Level): void {
    this.levels.set(id, level)
  }

  claimTurn(id: ThreadID, messageID: ThreadMessageID): boolean {
    let seen = this.injected.get(id)
    if (!seen) {
      seen = new Set()
      this.injected.set(id, seen)
    }
    if (seen.has(messageID)) return false
    seen.add(messageID)
    return true
  }
}
