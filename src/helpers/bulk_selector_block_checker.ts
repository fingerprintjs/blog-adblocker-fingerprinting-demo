import getBlockedSelectors from './get_blocked_selectors'

/**
 * Checks whether many CSS selectors are blocked keeping the page responsive.
 * Splits all the selectors into batches and checks the batches with pauses in between.
 */
export default class BulkSelectorBlockChecker<T extends string> {
  /** Index of the selector to continue checking */
  private selectorsIndex = 0

  /** Timeout id of the current batch check pause */
  private checkTimeoutId = 0

  /**
   * @param selectors All the selectors to check. Don't change it by reference.
   * @param batchSize Number of selectors to check per a batch. 200 is recommended.
   * @param onBatch Called when a batch of the selectors is checked
   */
  constructor(
    private selectors: readonly T[],
    private batchSize: number,
    private onBatch: (selectorResults: Map<T, boolean>, totalCheckedSelectorsCount: number) => unknown,
  ) {
    this.scheduleBatchChecking()
  }

  /**
   * Stops checking the selectors.
   * Call this method when you don't need the object to release the memory.
   */
  public stop(): void {
    clearTimeout(this.checkTimeoutId)
  }

  private checkBatch() {
    const selectors = this.selectors.slice(this.selectorsIndex, this.selectorsIndex + this.batchSize)
    const blockedSelectors = getBlockedSelectors(selectors)

    const selectorResults = new Map<T, boolean>()
    for (const selector of selectors) {
      selectorResults.set(selector, blockedSelectors.has(selector))
    }

    this.selectorsIndex += selectors.length
    this.onBatch(selectorResults, this.selectorsIndex)

    if (this.selectorsIndex < this.selectors.length) {
      this.scheduleBatchChecking()
    }
  }

  private scheduleBatchChecking() {
    clearTimeout(this.checkTimeoutId)

    // A timeout allows browser to update the page and run other tasks, thus makes the page responsive
    this.checkTimeoutId = window.setTimeout(this.checkBatch.bind(this), 0)
  }
}
