/**
 * Examples demonstrating the promise-based API for recursive-timeout
 * 
 * This file shows various usage patterns of the setRecursive function
 * from the promises module, analogous to Node.js timers/promises API.
 */

import { setRecursive, clearRecursive } from './promises'

// Example 1: Basic usage with for await...of
async function example1() {
  console.log('\n=== Example 1: Basic usage ===')
  
  let count = 0
  for await (const _ of setRecursive(1000)) {
    console.log(`Tick ${++count}`)
    if (count >= 3) break
  }
  
  console.log('Done!')
}

// Example 2: With async work in the loop
async function example2() {
  console.log('\n=== Example 2: Async work waits before next iteration ===')
  
  let count = 0
  for await (const _ of setRecursive(500)) {
    const start = Date.now()
    console.log(`Iteration ${++count} starts at ${start}`)
    
    // Simulate async work that takes 200ms
    await new Promise(resolve => setTimeout(resolve, 200))
    
    console.log(`Iteration ${count} ends at ${Date.now()} (took ${Date.now() - start}ms)`)
    console.log(`Next iteration will start in 500ms...`)
    
    if (count >= 2) break
  }
  
  console.log('Done!')
}

// Example 3: With AbortController for cancellation
async function example3() {
  console.log('\n=== Example 3: Cancellation with AbortController ===')
  
  const ac = new AbortController()
  
  // Abort after 2.5 seconds
  setTimeout(() => {
    console.log('Aborting...')
    ac.abort()
  }, 2500)
  
  try {
    let count = 0
    for await (const _ of setRecursive(1000, undefined, { signal: ac.signal })) {
      console.log(`Tick ${++count}`)
    }
  } catch (err) {
    console.log('Caught error:', (err as Error).message)
  }
  
  console.log('Done!')
}

// Example 4: Yielding custom values
async function example4() {
  console.log('\n=== Example 4: Yielding custom values ===')
  
  let count = 0
  for await (const message of setRecursive(500, 'Hello from recursive timeout!')) {
    console.log(`[${++count}] ${message}`)
    if (count >= 3) break
  }
  
  console.log('Done!')
}

// Example 5: Manual clear using clearRecursive
async function example5() {
  console.log('\n=== Example 5: Manual cancellation ===')
  
  const recursive = setRecursive(500)
  
  let count = 0
  try {
    for await (const _ of recursive) {
      console.log(`Tick ${++count}`)
      
      if (count >= 3) {
        console.log('Clearing manually...')
        clearRecursive(recursive)
      }
    }
  } catch (err) {
    console.log('Loop exited after clear')
  }
  
  console.log('Done!')
}

// Example 6: Comparison with regular setInterval from timers/promises
async function example6() {
  console.log('\n=== Example 6: Comparison with Node.js setInterval ===')
  
  const { setInterval } = await import('node:timers/promises')
  
  console.log('\nNode.js setInterval (does NOT wait for async work):')
  {
    const ac = new AbortController()
    setTimeout(() => ac.abort(), 350)
    
    let count = 0
    let lastTime = Date.now()
    try {
      for await (const _ of setInterval(100, undefined, { signal: ac.signal })) {
        const now = Date.now()
        console.log(`[${++count}] ${now - lastTime}ms since last | Starting 50ms work`)
        lastTime = now
        await new Promise(resolve => setTimeout(resolve, 50))
        console.log(`     Work done`)
      }
    } catch {}
  }
  
  console.log('\nrecursive-timeout setRecursive (WAITS for async work):')
  {
    const ac = new AbortController()
    setTimeout(() => ac.abort(), 350)
    
    let count = 0
    let lastTime = Date.now()
    try {
      for await (const _ of setRecursive(100, undefined, { signal: ac.signal })) {
        const now = Date.now()
        console.log(`[${++count}] ${now - lastTime}ms since last | Starting 50ms work`)
        lastTime = now
        await new Promise(resolve => setTimeout(resolve, 50))
        console.log(`     Work done`)
      }
    } catch {}
  }
  
  console.log('\nNotice how setRecursive waits for the 50ms work before scheduling the next iteration!')
  console.log('Done!')
}

// Run all examples
async function runAllExamples() {
  await example1()
  await example2()
  await example3()
  await example4()
  await example5()
  await example6()
}

// Uncomment to run:
// runAllExamples().catch(console.error)
