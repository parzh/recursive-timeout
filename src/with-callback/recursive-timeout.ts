export type ArgsShape = readonly unknown[]

export type Callback<Args extends ArgsShape> = (...args: Args) => void

const noop: Callback<ArgsShape> = () => { }

export class RecursiveTimeout<Args extends ArgsShape> implements NodeJS.Timeout {
  protected isRefed = true
  protected timer!: NodeJS.Timeout

  constructor(
    protected readonly callback: Callback<Args>,
    protected readonly delay: number | undefined,
    protected readonly args: Args,
  ) {
    this.start()
  }

  private setTimer(tick: Callback<ArgsShape>) {
    this.timer = setTimeout(tick, this.delay)

    if (!this.isRefed) {
      this.timer.unref()
    }
  }

  protected start(): void {
    const tickHost = {
      // we're naming the tick function the same as the original callback
      [this.callback.name]: () => {
        this.callback(...this.args)
        this.setTimer(tick)
      },
    }

    const tick = tickHost[this.callback.name]

    this.setTimer(tick)
  }

  get _onTimeout(): Callback<ArgsShape> {
    // If anything directly accesses `this._onTimeout`, we treat it as an
    // indication that `clearTimeout(this)` was called. This weird hack is
    // necessary, because this custom instance is unknown to NodeJS internals.
    this.clear()

    // the returned value must be truthy
    return noop
  }

  set _onTimeout(newValue: Callback<ArgsShape> | null) {
    // TODO: create a tandem logic: if `._onTimeout` is accessed, it might be a `clearTimeout(…)` call,
    // but if then immediately after that the `._onTimeout = null` is set, then it is definitely one.
  }

  ref(): this {
    if (!this.isRefed) {
      this.timer.ref()
      this.isRefed = true
    }

    return this
  }

  unref(): this {
    if (this.isRefed) {
      this.timer.unref()
      this.isRefed = false
    }

    return this
  }

  hasRef(): boolean {
    return this.isRefed
  }

  clear(): void {
    clearTimeout(this.timer)
  }

  close(): this {
    this.clear()

    return this
  }

  [Symbol.dispose]() {
    this.clear()
    this.timer[Symbol.dispose]()
  }

  [Symbol.toPrimitive]() {
    return this.timer[Symbol.toPrimitive]()
  }

  refresh(): this {
    this.clear()
    this.start()

    return this
  }
}
