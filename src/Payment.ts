/** The payment status of the user, as a plugin shows it. */
export type TPaymentData = {
  /** `figma.payments.status.type === 'PAID'` */
  isPaid: boolean
  /** Not paid, and still inside the trial window */
  isTrial: boolean
  daysSinceFirstRun: number
}

export type TPaymentOptions = {
  /** The length of the free trial in days. Leave it out, or pass `0`, for no trial. */
  trialDays?: number
  /**
   * Called one time when `readStatus` first sees the status change from unpaid
   * to paid. This is where a project shows its toast.
   */
  onPaid?: (data: TPaymentData) => void
}

export type TPaymentCheckoutOptions = {
  /** Defaults to `PAID_FEATURE` during the trial and to `TRIAL_ENDED` after it. */
  interstitial?: 'PAID_FEATURE' | 'TRIAL_ENDED' | 'SKIP'
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24

/* `figma.payments` is undefined where payments are not supported: every read falls back to "not paid" */
const readDaysSinceFirstRun = (): number => {
  try {
    return (figma.payments?.getUserFirstRanSecondsAgo() ?? 0) / ONE_DAY_IN_SECONDS
  } catch (error) {
    console.log('Error in Payment :', error)

    return 0
  }
}

const readIsPaid = (): boolean => {
  try {
    return figma.payments?.status.type === 'PAID'
  } catch (error) {
    console.log('Error in Payment :', error)

    return false
  }
}

const isWithinTrial = (trialDays: number | undefined): boolean =>
  trialDays !== undefined && trialDays > 0 && readDaysSinceFirstRun() < trialDays

/**
 * The payment status of the user and the checkout of Figma.
 *
 * It reads `figma.payments` and decides nothing: the project decides what a paid user gets and what a toast says.
 * The trial length is an option, so the same class serves a product with a trial and a product without one.
 *
 * Figma sends no event after a purchase, so a paywall polls `readStatus` while the checkout is open.
 * The instance keeps the last status, while its caller keeps the instance.
 * It calls `onPaid` one time, on the first poll that sees the purchase.
 * A first read with a paid status calls nothing: a UI that opens with a paid account is not a purchase.
 *
 * Nothing throws. Where Figma does not support payments, the status is "not paid".
 *
 * @example
 * // A gate for a paid feature. A trial counts as access.
 * if (!Payment.checkIsPaid({ trialDays: config.trialDays })) return
 *
 * @example
 * // One instance for the payment channel of the bridge
 * const payment = new Payment({
 *   trialDays: config.trialDays,
 *   onPaid: () => figma.notify('Full access unlocked'),
 * })
 *
 * resolve: () => payment.readStatus()
 * openCheckout: () => payment.openPaymentAsync()
 */
class Payment {
  private options: TPaymentOptions

  /** The paid status of the previous `readStatus`. `null` until the first one. */
  private lastIsPaid: boolean | null = null

  constructor(options: TPaymentOptions = {}) {
    this.options = options
  }

  /**
   * `true` when the user has paid or, with `trialDays`, is still inside the trial.
   * Without options it is the paid status alone.
   */
  static checkIsPaid({ trialDays }: Pick<TPaymentOptions, 'trialDays'> = {}): boolean {
    return readIsPaid() || isWithinTrial(trialDays)
  }

  /** The status now. It remembers nothing and calls nothing. */
  read(): TPaymentData {
    const isPaid = readIsPaid()

    return {
      isPaid,
      isTrial: !isPaid && isWithinTrial(this.options.trialDays),
      daysSinceFirstRun: readDaysSinceFirstRun(),
    }
  }

  /** The status now, and a call of `onPaid` when it changed from unpaid to paid since the last call. */
  readStatus(): TPaymentData {
    const data = this.read()
    const hasJustPaid = this.lastIsPaid === false && data.isPaid

    this.lastIsPaid = data.isPaid

    if (hasJustPaid) {
      try {
        this.options.onPaid?.(data)
      } catch (error) {
        console.log('Error in the onPaid handler of Payment :', error)
      }
    }

    return data
  }

  /** Forgets the last status, so the next `readStatus` is a first read again. */
  resetStatusTracking(): void {
    this.lastIsPaid = null
  }

  /** Opens the checkout of Figma, and gives the status after it closes. */
  async openPaymentAsync({ interstitial }: TPaymentCheckoutOptions = {}): Promise<TPaymentData> {
    const fallback = this.read().isTrial ? 'PAID_FEATURE' : 'TRIAL_ENDED'

    try {
      await figma.payments?.initiateCheckoutAsync({ interstitial: interstitial ?? fallback })
    } catch (error) {
      console.log('Error in Payment.openPaymentAsync() :', error)
    }

    return this.readStatus()
  }
}

export { Payment }
