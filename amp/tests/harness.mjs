// Runtime simulation only. Type compatibility is checked separately against the FULL Amp API.
// Fail closed on unexpected capabilities instead of silently accepting fake host calls.
export function strictHost(value) {
  return new Proxy(value, {
    get(target, key) {
      if (!(key in target)) throw new Error(`Unimplemented host capability: ${String(key)}`)
      return Reflect.get(target, key)
    },
  })
}

export function harness() {
  const skills = []
  const commands = new Map()
  let start
  const api = strictHost({
    async registerSkill(definition) {
      skills.push(definition.path)
      return { unsubscribe() {} }
    },
    registerCommand(id, options, handler) {
      if (commands.has(id)) throw new Error(`Duplicate command: ${id}`)
      commands.set(id, { options, handler })
      return { unsubscribe() {}, setAvailability() {} }
    },
    on(event, handler) {
      if (event !== 'agent.start' || start) throw new Error('Unexpected or duplicate listener')
      start = handler
      return { unsubscribe() {} }
    },
  })
  return { api, skills, commands, emit(event) {
    if (!start) throw new Error('No listener')
    return start(event)
  } }
}
