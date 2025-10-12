export type ArgsShape = readonly unknown[]

export type Callback<Args extends ArgsShape> = (...args: Args) => void | Promise<void>

/** @deprecated TODO: Remove when everything planned is supported */
class NotSupportedError extends Error {
  constructor() {
    super(`Promise-based recursive timeout is not supported yet`)
  }
}

export class RecursiveTimeout<Args extends ArgsShape> implements AsyncIterator<void, any, any> {
  constructor(
    protected readonly callback: Callback<Args>,
    protected readonly delay: number | undefined,
    protected readonly args: Args,
  ) {
    this.start()
  }

  protected start(): void {
    throw new NotSupportedError()
  }

  clear(): void {
    throw new NotSupportedError()
  }

  next(): Promise<IteratorResult<void, any>> {
    throw new NotSupportedError()
  }
}
