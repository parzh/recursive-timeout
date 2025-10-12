import { setTimeout as delay } from 'timers/promises'
import { createRecursiveTimeout } from './create-recursive-timeout'
import { RecursiveTimeout } from './recursive-timeout'

describe(createRecursiveTimeout, () => {
  it('should create an instance of RecursiveTimeout class', () => {
    const timeout = createRecursiveTimeout(() => {}, 10_000)

    expect(timeout).toBeInstanceOf(RecursiveTimeout)

    timeout.clear()
  })

  it('should schedule next call only after the current call is finished', async () => {
    const startTime = Date.now()
    const runsForOneSecond = vi.fn().mockImplementation(() => {
      const startTime = Date.now()

      while (Date.now() - startTime < 1000) { /* do nothing */ }

      return Date.now()
    })

    const timeout = createRecursiveTimeout(runsForOneSecond, 500)

    await delay(3000) // I can't use fake timers, unfortunately

    timeout.clear()

    expect(runsForOneSecond).toHaveBeenCalledTimes(2)

    const returnValue1Expected = startTime + 500 + 1000
    const returnValue2Expected = startTime + 500 + 1000 + 500 + 1000

    expect(runsForOneSecond.mock.results[0].value / returnValue1Expected).toBeCloseTo(1)
    expect(runsForOneSecond.mock.results[1].value / returnValue2Expected).toBeCloseTo(1)
  })
})
