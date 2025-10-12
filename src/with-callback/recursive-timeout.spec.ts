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
    const timeout = createRecursiveTimeout(callback, 100)

    clear(timeout)

    await delay(150)

    expect(callback).not.toHaveBeenCalled()
  })

  it('should allow delaying the call by refreshing the timeout instance', async () => {
    const recursive = createRecursiveTimeout(callback, 200)

    await delay(100)

    recursive.refresh()

    await delay(100)

    recursive.refresh()

    await delay(100)

    recursive.refresh()

    expect(callback).not.toHaveBeenCalled()

    await delay(200 + 10)

    clearTimeout(recursive)

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
