import type { PluginAPI } from '@ampcode/plugin'
import { instructions, levels, isLevel } from './instructions.ts'
import { ThreadState } from './state.ts'

export const description = 'Independent Ponytail adaptation: thread-local development guidance and six skills. No model or permission changes.'

export default async function (amp: PluginAPI) {
  const state = new ThreadState()
  for (const name of ['ponytail', 'ponytail-review', 'ponytail-audit', 'ponytail-debt', 'ponytail-gain', 'ponytail-help']) {
    await amp.registerSkill({ path: `skills/${name}` })
  }

  amp.registerCommand('set-level', {
    category: 'Ponytail Amp', title: 'Set level',
    description: 'Choose lite, full, ultra or off for the active thread only.',
  }, async (ctx) => {
    const thread = ctx.thread
    if (!thread) {
      await ctx.ui.notify('Ponytail Amp: no active thread. Nothing changed; new threads default to full.')
      return
    }
    const level = await ctx.ui.select({
      title: 'Ponytail Amp level', options: [...levels],
      initialValue: state.level(thread.id),
      message: `Scope: thread ${thread.id}, this plugin instance only. Ultra does not select Amp Ultra. Off stops future injections, not history.`,
    })
    if (!isLevel(level)) return
    state.setLevel(thread.id, level)
    await ctx.ui.notify(`Ponytail Amp: ${level}; thread ${thread.id}; in memory until plugin reload/restart. Off does not erase history; explicit skills remain available.`)
  })

  amp.registerCommand('show-level', {
    category: 'Ponytail Amp', title: 'Show level',
    description: 'Show the active thread level and its in-memory scope.',
  }, async (ctx) => {
    await ctx.ui.notify(ctx.thread
      ? `Ponytail Amp: ${state.level(ctx.thread.id)}; thread ${ctx.thread.id}; this plugin instance only. Reload/restart resets all levels to full. Off stops future injections, not history; explicit skills remain available.`
      : 'Ponytail Amp: no active thread. New threads default to full; no global level exists.')
  })

  amp.on('agent.start', (event) => {
    const level = state.level(event.thread.id)
    if (level === 'off' || !state.claimTurn(event.thread.id, event.id)) return {}
    return { message: { content: instructions(level), display: false } }
  })
}
