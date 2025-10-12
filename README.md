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
- **Promise-based API:** ⚠️ _(coming soon)_ ⚠️ A promise-based interface for use with asynchronous callbacks.

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

#### ECMAScript (promise-based) – _coming soon_ ⚠️

```js
import { setRecursive, clearRecursive } from 'recursive-timeout/promises'
```

```js
import { promises } from 'recursive-timeout'

promises.setRecursive(…)
promises.clearRecursive(…)
```

#### CommonJS

```js
const { setRecursive, clearRecursive } = require('recursive-timeout')
```

#### CommonJS (promise-based) – _coming soon_ ⚠️

```js
const { setRecursive, clearRecursive } = require('recursive-timeout/promises')
```

```js
const { promises } = require('recursive-timeout')

promises.setRecursive(…)
promises.clearRecursive(…)
```

## License

This project is licensed under the MIT License.
