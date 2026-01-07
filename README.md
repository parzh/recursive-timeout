# `recursive-timeout`

[![npm version](https://badge.fury.io/js/recursive-timeout.svg)](https://badge.fury.io/js/recursive-timeout)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple solution to a classic problem: `setInterval` implemented as recursive `setTimeout` calls.

This package is designed to be a drop-in replacement for the normal `setInterval`.

## "Why exactly do I need this?"

Take a look at [this section from javascript.info](https://javascript.info/settimeout-setinterval#nested-settimeout), it outlines the problem and the solution.

Basically, the normal `setInterval` doesn't wait for the callback to happen, – it schedules the next iteration right away:

```js
function runsForOneSecond() {
  const startTime = Date.now()

  while (Date.now() - startTime < 1000) { /* just wait */ }

  console.log(Date.now(), 'Done!')
}

console.log(Date.now(), 'Start')
setInterval(runsForOneSecond, 500)
// logs (approximately):
// 1234567890000 Start
// 1234567891500 Done!
// 1234567892500 Done!
// 1234567893500 Done!
```

… while the "recursive timeout" approach necessarily waits for the callback to finish before scheduling the next call:

```js
import { setRecursive } from 'recursive-timeout'

console.log(Date.now(), 'Start')
setRecursive(runsForOneSecond, 500)
// logs (approximately):
// 1234567890000 Start
// 1234567891500 Done!
// 1234567893000 Done!
// 1234567894500 Done!
```

## Features

- **Dual Module Support:** Works seamlessly with both ECMAScript Modules (`import`) and CommonJS (`require`).
- **Familiar API:** Designed as a drop-in replacement for `setInterval`.
- **Promise-based API:** A promise-based interface using `for await...of` loops, inspired by Node.js `timers/promises`.
  - Returns an AsyncIterator for use with `for await...of`
  - Supports AbortController for cancellation
  - **Waits for async work to complete** before scheduling the next iteration (unlike Node.js `setInterval`)

## Installation

```bash
npm install recursive-timeout
```

## Usage

The straightforward API of `setRecursive` and `clearRecursive` mirrors the native `setInterval` and `clearInterval` functions.

#### ECMAScript

This is the standard way to use the package, ideal for most cases.

```js
import { setRecursive, clearRecursive } from 'recursive-timeout'

setRecursive(() => console.log('hi'), 1000)
setRecursive(console.log, 1000, 'hi')
```

To cancel the interval, pass the timer into `clearRecursive` or the standard `clearInterval`, or even `clearTimeout`:

```js
const recursive = setRecursive(console.log, 1000, 'hi')

clearRecursive(recursive)
clearInterval(recursive) // ✅ works
clearTimeout(recursive) // ✅ also works
```

For TypeScript users, some additional checks are added:

```ts
function sum(a: number, b: number): void {
  console.log(a + b)
}

setRecursive(sum, 100)
// ❌ Error: not enough arguments

setRecursive(sum, 100, 42)
// ❌ Error: not enough arguments

setRecursive(sum, 100, 42, 17)
// ✅ OK (logs 59 every ~100 milliseconds)
```

#### ECMAScript (promise-based)

The promise-based API uses `for await...of` loops and returns an AsyncIterator, similar to Node.js `timers/promises`:

```js
import { setRecursive } from 'recursive-timeout/promises'

// Basic usage - yields every 1000ms
for await (const _ of setRecursive(1000)) {
  console.log('tick')
  // break when done
}
```

**Key difference from Node.js `setInterval`:** The next iteration is scheduled **after** any async work in the loop body completes:

```js
import { setRecursive } from 'recursive-timeout/promises'

for await (const _ of setRecursive(1000)) {
  console.log('start')
  await doAsyncWork() // Takes 500ms
  console.log('end')
  // Next iteration starts 1000ms AFTER doAsyncWork() completes
  // (not 1000ms after the previous iteration started)
}
```

**Cancellation with AbortController:**

```js
const controller = new AbortController()

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000)

try {
  for await (const _ of setRecursive(1000, undefined, { signal: controller.signal })) {
    console.log('tick')
  }
} catch (err) {
  console.log('Cancelled')
}
```

**Alternative import style:**

```js
import { promises } from 'recursive-timeout'

for await (const _ of promises.setRecursive(1000)) {
  console.log('tick')
}
```

#### CommonJS

```js
const { setRecursive, clearRecursive } = require('recursive-timeout')
```

#### CommonJS (promise-based)

```js
const { setRecursive } = require('recursive-timeout/promises')

;(async () => {
  for await (const _ of setRecursive(1000)) {
    console.log('tick')
  }
})()
```

**Alternative import style:**

```js
const { promises } = require('recursive-timeout')

;(async () => {
  for await (const _ of promises.setRecursive(1000)) {
    console.log('tick')
  }
})()
```

## Promise-based API: Comparison with Node.js `timers/promises`

The promise-based API is inspired by Node.js `timers/promises` but with a crucial difference:

### Node.js `setInterval` (from `timers/promises`)
```js
import { setInterval } from 'node:timers/promises'

for await (const _ of setInterval(100)) {
  await asyncWork() // Takes 50ms
  // Next iteration starts 100ms after the PREVIOUS one started
  // (not after asyncWork completes)
}
```
Schedule: 0ms → 100ms → 200ms → 300ms (regardless of async work)

### `recursive-timeout` `setRecursive` (promise-based)
```js
import { setRecursive } from 'recursive-timeout/promises'

for await (const _ of setRecursive(100)) {
  await asyncWork() // Takes 50ms
  // Next iteration starts 100ms AFTER asyncWork completes
}
```
Schedule: 0ms → 150ms → 300ms → 450ms (waits for async work)

This is the same "recursive timeout" behavior as the callback-based API, but with the convenience of async iterators.

## License

This project is licensed under the MIT License.
