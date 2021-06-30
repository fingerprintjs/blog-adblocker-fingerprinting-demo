import * as React from 'react'
import * as murmurHash3 from '../../helpers/murmurhash3'
import getBlockedSelectors from '../../helpers/get_blocked_selectors'
import filters from '../../data/some_unique_selectors'
import Layout from '../layout/layout'
import FilterList from './filter_list'
import FilterModal from './filter_modal'
import * as styles from './filters_demo.css'

type Filters = Record<string, string[]>

type SelectorBlockageByFilter = Record<string, [isEnabled: boolean, selectors: Map<string, boolean>]>

export default React.memo(function FiltersDemo() {
  const [selectorBlockageByFilter, fingerprint] = useBlockedSelectors(filters)
  const [filterModalState, selectFilter, closeFilterModal] = useFilterModalState(selectorBlockageByFilter)

  return (
    <>
      <Layout
        header={
          <div>
            Fingerprint: <span className={styles.fingerprint}>{fingerprint}</span>
          </div>
        }
      >
        <FilterList filters={selectorBlockageByFilter} onFilterSelect={selectFilter} />
      </Layout>
      <FilterModal {...filterModalState} onClose={closeFilterModal} />
    </>
  )
})

/**
 * Detects blocked selectors of filters and calculates a fingerprint
 */
function useBlockedSelectors(filters: Filters) {
  return React.useMemo(() => {
    const allSelectors = ([] as string[]).concat(...Object.values(filters))
    const blockedSelectors = getBlockedSelectors(allSelectors)

    const selectorBlockageByFilter: SelectorBlockageByFilter = {}
    const enabledFilters: string[] = []

    for (const [filterName, selectorNames] of Object.entries(filters)) {
      const selectors = new Map<string, boolean>()
      let blockedSelectorsCount = 0

      for (const selector of selectorNames) {
        const isBlocked = blockedSelectors.has(selector)
        selectors.set(selector, isBlocked)
        if (isBlocked) {
          blockedSelectorsCount++
        }
      }

      const isFilterEnabled = blockedSelectorsCount >= selectorNames.length * 0.5
      selectorBlockageByFilter[filterName] = [isFilterEnabled, selectors]
      if (isFilterEnabled) {
        enabledFilters.push(filterName)
      }
    }

    const fingerprint = murmurHash3.x86.hash128(JSON.stringify(enabledFilters))

    return [selectorBlockageByFilter, fingerprint] as const
  }, [filters])
}

function useFilterModalState(filters: SelectorBlockageByFilter) {
  const filtersRef = React.useRef(filters)

  const [modalState, setModalState] = React.useState(() => ({
    open: false,
    filterEnabled: false,
    filterName: '',
    selectors: new Map<string, boolean>(),
  }))

  React.useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  const selectFilter = React.useCallback((filterName: string) => {
    if (filtersRef.current[filterName]) {
      setModalState({
        open: true,
        filterEnabled: filtersRef.current[filterName][0],
        filterName,
        selectors: filtersRef.current[filterName][1],
      })
    }
  }, [])

  const close = React.useCallback(() => setModalState((state) => ({ ...state, open: false })), [])

  return [modalState, selectFilter, close] as const
}
