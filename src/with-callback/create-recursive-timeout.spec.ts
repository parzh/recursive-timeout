import { setTimeout as delay } from 'timers/promises'
import { createRecursiveTimeout } from './create-recursive-timeout'
import { RecursiveTimeout } from './recursive-timeout'

describe(createRecursiveTimeout, () => {
  it('should create an instance of RecursiveTimeout class', () => {
    const recursive = createRecursiveTimeout(() => {}, 10_000)

    expect(recursive).toBeInstanceOf(RecursiveTimeout)

    recursive.clear()
  })

  it('should schedule next call only after the current call is finished', async () => {
    const startTime = Date.now()
    const longJob = vi.fn().mockImplementation(() => {
      const startTime = Date.now()

      while (Date.now() - startTime < 100) { /* do nothing */ }

      return Date.now()
    })

    const recursive = createRecursiveTimeout(longJob, 50)

    await delay(300) // I can't use fake timers, unfortunately

    recursive.clear()

    expect(longJob).toHaveBeenCalledTimes(2)

    const returnValue1Expected = startTime + 50 + 100
    const returnValue2Expected = startTime + 50 + 100 + 50 + 100

    expect(longJob.mock.results[0].value / returnValue1Expected).toBeCloseTo(1)
    expect(longJob.mock.results[1].value / returnValue2Expected).toBeCloseTo(1)
  })
})
