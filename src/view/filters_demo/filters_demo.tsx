import * as React from 'react'
import * as murmurHash3 from '../../helpers/murmurhash3'
import getBlockedSelectors from '../../helpers/get_blocked_selectors'
import filters from '../../data/some_unique_selectors'
import Layout from '../layout/layout'
import * as styles from './filters_demo.css'

type Filters = Record<string, string[]>

export default React.memo(function FiltersDemo() {
  const [selectorBlockageByFilter, fingerprint] = useBlockedSelectors(filters)

  return (
    <Layout
      header={
        <div>
          Fingerprint: <span className={styles.fingerprint}>{fingerprint}</span>
        </div>
      }
    >
      <ul className={styles.filters}>
        {Object.entries(selectorBlockageByFilter).map(([filterName, [isEnabled, selectors]]) => (
          <li key={filterName}>
            <Filter name={filterName} isEnabled={isEnabled} selectors={selectors} />
          </li>
        ))}
      </ul>
    </Layout>
  )
})

interface FilterProps {
  name: string
  isEnabled: boolean
  selectors: Map<string, boolean>
}

const Filter = React.memo(function Filter({ name, isEnabled, selectors }: FilterProps) {
  const [isExpanded, setExpanded] = React.useState(false)

  return (
    <>
      <div
        title={name}
        className={`${styles.filterHeader} ${isExpanded ? styles.expanded : ''}`}
        onClick={() => setExpanded(!isExpanded)}
      >
        <span className={styles.filterHeaderStatus}>{isEnabled ? '✅' : '❌'}</span>
        <span className={styles.filterHeaderName}>{name}</span>
        <span className={styles.filterHeaderIcon} />
      </div>
      <ul className={`${styles.filterSelectors} ${isExpanded ? styles.expanded : ''}`}>
        {[...selectors].map(([selector, isBlocked]) => (
          <li key={selector} title={selector}>
            {isBlocked ? '⛔️' : '🆗'} {selector}
          </li>
        ))}
      </ul>
    </>
  )
})

function useBlockedSelectors(filters: Filters) {
  return React.useMemo(() => {
    const allSelectors = ([] as string[]).concat(...Object.values(filters))
    const blockedSelectors = getBlockedSelectors(allSelectors)

    const selectorBlockageByFilter: Record<string, [isEnabled: boolean, selectors: Map<string, boolean>]> = {}

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

      selectorBlockageByFilter[filterName] = [blockedSelectorsCount >= selectorNames.length * 0.5, selectors]
    }

    const fingerprint = murmurHash3.x86.hash128(JSON.stringify([...blockedSelectors]))

    return [selectorBlockageByFilter, fingerprint] as const
  }, [filters])
}
