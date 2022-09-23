import consola from 'consola'
import mri from 'mri'
import { runCommand, Options } from './index'
async function _main() {
  const _argv = process.argv.slice(2)
  const args = mri(_argv, {
    boolean: ['no-clear']
  })
  // @ts-ignore
  const command = args._.shift() || 'usage'

  const formattedArgs = Options.parse({
    replace: args.replace,
    base: args.base
  })
  await runCommand(formattedArgs)
  return ''
}

// Wrap all console logs with consola for better DX
consola.wrapConsole()

process.on('unhandledRejection', (err) =>
  consola.error('[unhandledRejection]', err)
)
process.on('uncaughtException', (err) =>
  consola.error('[uncaughtException]', err)
)

export function main() {
  _main()
    .then((result) => {
      if (result === 'error') {
        process.exit(1)
      } else if (result !== 'wait') {
        process.exit(0)
      }
    })
    .catch((error) => {
      consola.error(error)
      process.exit(1)
    })
}
