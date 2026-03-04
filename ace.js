/*
|--------------------------------------------------------------------------
| JavaScript entrypoint for running ace commands
|--------------------------------------------------------------------------
|
| DO NOT MODIFY THIS FILE AS IT WILL BE OVERRIDDEN DURING THE BUILD
| PROCESS.
|
| See docs.adonisjs.com/guides/typescript-build-process#creating-production-build
|
| Since, we cannot run TypeScript source code using "node" binary, we need
| a JavaScript entrypoint to run ace commands.
|
| This file registers the "ts-node/esm" hook with the Node.js module system
| and then imports the "bin/console.ts" file.
|
*/

import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import 'ts-node-maintained/register/esm'
import 'ts-node/esm'
const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// Register ts-node-maintained ESM loader
const tsNodePath = resolve(__dirname, 'node_modules/ts-node-maintained/register/esm.js')
await import(tsNodePath)
/**
 * Import ace console entrypoint
 */
await import('./bin/console.js')
