import * as React from 'react'
import BulkSelectorBlockChecker from '../../helpers/bulk_selector_block_checker'
import allSelectors from '../../data/many_unique_selectors'
import Layout from '../layout/layout'
import Toggle from '../toggle/toggle'
import * as styles from './selectors_demo.css'

type SelectorsList = Record<string, string[]>

type SelectorsBlockage = [selectorStatuses: Map<string, boolean>, progress: number]

export default React.memo(function SelectorsDemo() {
  const [doShowAll, setShowAll] = React.useState(false)
  const [selectorStatuses, progress] = useSelectorsBlockage(allSelectors)

  const selectorsView: React.ReactNode[] = []
  selectorStatuses.forEach((isBlocked, selector) => {
    if (isBlocked || doShowAll) {
      selectorsView.push(
        <li key={selector} title={selector} className={isBlocked ? styles.blocked : undefined}>
          {isBlocked ? '⛔️' : '🆗'} {selector}
        </li>,
      )
    }
  })

  return (
    <Layout
      header={
        <>
          <div className={styles.control} onClick={() => setShowAll(!doShowAll)}>
            <Toggle checked={doShowAll} />
            <div className={styles.controlLabel}>Show not blocked</div>
          </div>
          <progress
            max={100}
            value={progress * 100}
            className={`${styles.progress} ${progress >= 1 ? styles.complete : ''}`}
          />
        </>
      }
    >
      {progress >= 1 && selectorsView.length === 0 ? (
        <div className={styles.noSelectors}>Your browser blocks no known selectors</div>
      ) : (
        <ul className={styles.selectors}>{selectorsView}</ul>
      )}
    </Layout>
  )
})

/**
 * Checks which of the selectors are blocked
 */
function useSelectorsBlockage(allSelectors: SelectorsList): SelectorsBlockage {
  const [selectorsBlockage, setSelectorsBlockage] = React.useState<SelectorsBlockage>(() => [new Map(), 0])
  const [prevAllSelectors, setPrevAllSelectors] = React.useState(allSelectors)

  if (allSelectors !== prevAllSelectors) {
    setPrevAllSelectors(allSelectors)
    setSelectorsBlockage([new Map(), 0])
  }

  React.useEffect(() => {
    const selectorsArray = ([] as string[]).concat(...Object.values(allSelectors))
    const bulkChecker = new BulkSelectorBlockChecker(
      selectorsArray,
      200,
      (batchSelectorResults, totalCheckedSelectorsCount) => {
        setSelectorsBlockage(([selectorStatuses]) => {
          batchSelectorResults.forEach((isBlocked, selector) => selectorStatuses.set(selector, isBlocked))
          const progress = selectorsArray.length ? totalCheckedSelectorsCount / selectorsArray.length : 1
          return [selectorStatuses, progress]
        })
      },
    )
    return () => bulkChecker.stop()
  }, [allSelectors])

  return selectorsBlockage
}
