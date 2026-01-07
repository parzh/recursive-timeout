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

// Basic usage - first iteration happens immediately, then waits 1000ms between iterations
for await (const _ of setRecursive(1000)) {
  console.log('tick')
  // break when done
}
```

**Key differences from Node.js `setInterval`:**

1. **First iteration is immediate** (no initial delay)
2. **Delay happens AFTER the loop body completes** (not before)

```js
import { setRecursive } from 'recursive-timeout/promises'

// Node.js setInterval behavior:
// Wait 1000ms → yield → work (500ms) → Wait 1000ms → yield → work
// Iterations at: 1000ms, 2000ms, 3000ms...

// setRecursive behavior:
// Yield immediately → work (500ms) → Wait 1000ms → yield → work (500ms) → Wait 1000ms
// Iterations at: 0ms, 1500ms, 3000ms...

for await (const _ of setRecursive(1000)) {
  console.log('start')
  await doAsyncWork() // Takes 500ms
  console.log('end')
  // Next iteration starts 1000ms AFTER doAsyncWork() completes
  // Total time between iterations: 500ms (work) + 1000ms (delay) = 1500ms
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

The promise-based API is inspired by Node.js `timers/promises` but with crucial differences:

### Node.js `setInterval` (from `timers/promises`)
- Waits for delay **before** yielding
- Schedules next iteration at fixed intervals regardless of work duration
- First iteration waits for the delay

```js
import { setInterval } from 'node:timers/promises'

for await (const _ of setInterval(100)) {
  await asyncWork() // Takes 50ms
  // Iterations happen at fixed 100ms intervals
}
```
Timeline: **Wait 100ms** → yield → work (50ms) → **Wait 100ms** → yield → work (50ms)  
Schedule: Yields at 100ms, 200ms, 300ms...

### `recursive-timeout` `setRecursive` (promise-based)
- Yields **immediately** on first iteration
- Waits for delay **after** work completes
- Schedules next iteration after work finishes

```js
import { setRecursive } from 'recursive-timeout/promises'

for await (const _ of setRecursive(100)) {
  await asyncWork() // Takes 50ms
  // Next iteration waits for work to complete, then delays
}
```
Timeline: Yield immediately → work (50ms) → **Wait 100ms** → yield → work (50ms) → **Wait 100ms**  
Schedule: Yields at 0ms, 150ms, 300ms...

This matches the "recursive timeout" behavior of the callback-based API, ensuring the delay happens between iterations, not before them.

## License

This project is licensed under the MIT License.
