export interface RecursiveTimeoutOptions {
  /**
   * An optional AbortSignal to cancel the recursive timeout
   */
  signal?: AbortSignal

  /**
   * Set to `false` to indicate that the scheduled timeout should not
   * require the Node.js event loop to remain active.
   * @default true
   */
  ref?: boolean
}

export class RecursiveTimeout<T = undefined> implements AsyncIterator<T, void, undefined> {
  private timer?: NodeJS.Timeout
  private aborted = false
  private cleared = false
  private readonly signal?: AbortSignal
  private readonly ref: boolean
  private onAbort?: () => void
  private pendingReject?: (reason?: any) => void

  constructor(
    private readonly delay: number,
    private readonly value?: T,
    options?: RecursiveTimeoutOptions,
  ) {
    this.signal = options?.signal
    this.ref = options?.ref !== false

    if (this.signal?.aborted) {
      this.aborted = true
    } else if (this.signal) {
      this.onAbort = () => {
        this.aborted = true
        this.clear()
      }
      this.signal.addEventListener('abort', this.onAbort, { once: true })
    }
  }

  clear(): void {
    this.cleared = true
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
    if (this.pendingReject) {
      // Use proper AbortError when clearing
      const reason = this.signal?.reason ?? new DOMException('The operation was aborted', 'AbortError')
      this.pendingReject(reason)
      this.pendingReject = undefined
    }
    if (this.onAbort && this.signal) {
      this.signal.removeEventListener('abort', this.onAbort)
      this.onAbort = undefined
    }
  }

  async next(): Promise<IteratorResult<T, void>> {
    // If already cleared, return done immediately
    if (this.cleared) {
      return { done: true, value: undefined }
    }

    // If signal was already aborted before first iteration, throw
    if (this.aborted) {
      this.clear()
      throw this.signal?.reason ?? new DOMException('The operation was aborted', 'AbortError')
    }

    // Wait for the delay
    try {
      await new Promise<void>((resolve, reject) => {
        this.pendingReject = reject
        
        this.timer = setTimeout(() => {
          this.timer = undefined
          this.pendingReject = undefined
          
          if (this.aborted || this.cleared) {
            reject(this.signal?.reason ?? new DOMException('The operation was aborted', 'AbortError'))
          } else {
            resolve()
          }
        }, this.delay)

        if (!this.ref && this.timer) {
          this.timer.unref()
        }
      })
    } catch (error) {
      this.clear()
      throw error
    }

    // After waiting, check if we were cleared or aborted
    if (this.cleared || this.aborted) {
      this.clear()
      throw this.signal?.reason ?? new DOMException('The operation was aborted', 'AbortError')
    }

    return { done: false, value: this.value as T }
  }

  return(): Promise<IteratorResult<T, void>> {
    this.clear()
    return Promise.resolve({ done: true, value: undefined })
  }

  [Symbol.asyncIterator](): AsyncIterator<T, void, undefined> {
    return this
  }
}
