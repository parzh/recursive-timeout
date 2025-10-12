import { setTimeout as delay } from 'timers/promises'
import { clearRecursiveTimeout } from './clear-recursive-timeout'
import { createRecursiveTimeout } from './create-recursive-timeout'

describe(clearRecursiveTimeout, () => {
  const callback = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should clear the scheduled timeout', async () => {
    const timeout = createRecursiveTimeout(callback, 100)

    clearRecursiveTimeout(timeout)

    await delay(150)

    expect(callback).not.toHaveBeenCalled()
  })
})
