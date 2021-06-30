import getBlockedSelectors from './get_blocked_selectors'

/**
 * Checks whether many CSS selectors are blocked keeping the page responsive.
 * Splits all the selectors into batches and checks the batches with pauses in between.
 */
export default class BulkSelectorBlockChecker<T extends string> {
  /** Whether the process of checking is stopped */
  private isStopped = false

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
    this.runCheck()
  }

  /**
   * Stops checking the selectors.
   * Call this method when you don't need the object to release the memory.
   */
  public stop(): void {
    this.isStopped = true
  }

  private async runCheck() {
    for (let selectorsIndex = 0; selectorsIndex < this.selectors.length; ) {
      // A timeout allows browser to update the page and run other tasks, thus makes the page responsive
      await new Promise((resolve) => setTimeout(resolve, 0))
      if (this.isStopped) {
        return
      }

      const selectors = this.selectors.slice(selectorsIndex, selectorsIndex + this.batchSize)
      const blockedSelectors = await getBlockedSelectors(selectors)
      if (this.isStopped) {
        return
      }

      const selectorResults = new Map<T, boolean>()
      for (const selector of selectors) {
        selectorResults.set(selector, blockedSelectors.has(selector))
      }

      selectorsIndex += selectors.length
      this.onBatch(selectorResults, selectorsIndex)
    }
  }
}
