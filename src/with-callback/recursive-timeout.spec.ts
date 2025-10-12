import { setTimeout as delay } from 'timers/promises'
import { createRecursiveTimeout } from './create-recursive-timeout'
import { RecursiveTimeout } from './recursive-timeout'

describe(RecursiveTimeout, () => {
  const callback = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test.each([
    ['clearInterval', clearInterval],
    ['clearTimeout', clearTimeout],
  ])('should be cancellable with %s', async (clearName, clear) => {
    const recursive = createRecursiveTimeout(callback, 100)

    clear(recursive)

    await delay(150)

    expect(callback).not.toHaveBeenCalled()
  })

  it('should allow delaying the call by refreshing the timeout instance', async () => {
    const recursive = createRecursiveTimeout(callback, 200)

    for (let i = 0; i < 3; i += 1) {
      await delay(100)

      recursive.refresh()
    }

    expect(callback).not.toHaveBeenCalled()

    await delay(200 + 10)

    clearTimeout(recursive)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should show whether it is ref-ed or not', () => {
    const recursive = createRecursiveTimeout(callback, 100)

    expect(recursive.hasRef()).toBe(true)

    for (const [methodName, hasRefExpected] of [['unref', false], ['ref', true]] as const) {
      recursive[methodName]()

      expect(recursive.hasRef()).toBe(hasRefExpected)
    }

    recursive.unref() // let it all go
  })
})
