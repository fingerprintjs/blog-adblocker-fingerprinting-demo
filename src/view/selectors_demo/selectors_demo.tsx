import * as React from 'react'
import BulkSelectorBlockChecker from '../../helpers/bulk_selector_block_checker'
import allSelectors from '../../data/many_unique_selectors'
import Layout from '../layout/layout'
import Toggle from '../toggle/toggle'
import SelectorList from './selector_list'
import * as styles from './selectors_demo.css'

type SelectorsList = Record<string, string[]>

type SelectorsBlockage = [selectorStatuses: Map<string, boolean>, progress: number]

export default React.memo(function SelectorsDemo() {
  const [doShowAll, setShowAll] = React.useState(false)
  const [selectorStatuses, progress] = useSelectorsBlockage(allSelectors)

  return (
    <Layout
      header={
        <>
          <div className={styles.control} onClick={() => setShowAll(!doShowAll)}>
            <Toggle checked={doShowAll} />
            <div className={styles.controlLabel}>{doShowAll ? 'Showing all' : 'Showing only blocked'}</div>
          </div>
          <progress
            max={100}
            value={progress * 100}
            className={`${styles.progress} ${progress >= 1 ? styles.complete : ''}`}
          />
        </>
      }
    >
      <SelectorList progress={progress} selectorStatuses={selectorStatuses} showOnlyBlocked={!doShowAll} />
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
          mergeMap(selectorStatuses, batchSelectorResults)
          const progress = selectorsArray.length ? totalCheckedSelectorsCount / selectorsArray.length : 1
          return [selectorStatuses, progress]
        })
      },
    )
    return () => bulkChecker.stop()
  }, [allSelectors])

  return selectorsBlockage
}

function mergeMap<TKey, TValue>(destination: Map<TKey, TValue>, source: Map<TKey, TValue>) {
  source.forEach((value, key) => destination.set(key, value))
}
