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
})
