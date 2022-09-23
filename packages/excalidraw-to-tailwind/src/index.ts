import consola, { LogLevel } from 'consola'
import * as readline from 'node:readline'
import { z } from 'zod'
import fs from 'fs'
import { resolve } from 'path'
import { convertToTw, removeBg, removeDefs } from './convert-to-tw'
import { optimize, OptimizedSvg, OptimizedError } from 'svgo'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  escapeCodeTimeout: 50
})

const ask = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    rl.question('  > ', (answer) => {
      resolve(answer)
    })
  })
}

const writeToFile = (filename: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const optimizedSvg = optimize(content) as OptimizedSvg | OptimizedError
    if (optimizedSvg.error) {
      reject(optimizedSvg.error)
      return
    }
    fs.writeFile(filename, (optimizedSvg as OptimizedSvg).data, (err) => {
      if (err) {
        reject(err.message)
      } else {
        resolve()
      }
    })
  })
}

const readFile = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err.message)
      } else {
        resolve(data.toString())
      }
    })
  })
}

export const Options = z.object({
  base: z.string().default('./'),
  replace: z.array(z.string()).default([]),
  suffix: z.string().default('')
})

type Options = z.infer<typeof Options>

export async function runCommand(options: Options) {
  options.base = options.base.startsWith('./')
    ? options.base
    : './' + options.base
  options.base += options.base.endsWith('/') ? '' : '/'

  consola.log(`Let's convert your excalidraw image in ${options.base}`)
  consola.log(`? What's the name of your file'`)
  let path = options.base + (await ask())
  if (path.endsWith('.svg')) {
    path = path.slice(0, -4)
  }
  const svgCode = await readFile(resolve(path + '.svg'))
  const convertedSvg = convertToTw(removeDefs(removeBg(svgCode)))
  const outputFile = path + options.suffix + '.svg'
  await writeToFile(outputFile, convertedSvg)

  consola.success(`Created new file - ${outputFile}`)
}
