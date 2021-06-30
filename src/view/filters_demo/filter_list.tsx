import * as React from 'react'
import { useElementSize } from '../../helpers/react_hooks'
import Carousel from '../carousel/carousel'
import * as styles from './filter_list.css'

type SelectorsGrid = { columnsCount: number; rowsCount: number }

const cellMinWidth = 260
const cellMinHeight = 26
const containerHorizontalPadding = 0
const containerVerticalPadding = 20

interface Props {
  filters: Record<string, [isEnabled: boolean, selectors: Map<string, boolean>]>
  onFilterSelect?(name: string): unknown
}

/**
 * The list of filters itself
 */
export default React.memo(function FilterList({ filters, onFilterSelect }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const selectorGrid = useSelectorsGrid(containerRef)
  const slides: React.ReactChild[] = []

  // Don't render the slides when the size is unknown yet
  if (selectorGrid) {
    const filterEntries = Object.entries(filters)
    const selectorsPerSlide = selectorGrid.columnsCount * selectorGrid.rowsCount

    for (let slideIndex = 0; slideIndex < Math.ceil(filterEntries.length / selectorsPerSlide); ++slideIndex) {
      slides.push(
        <ul
          key={slideIndex}
          className={styles.slide}
          style={{
            gridTemplateColumns: `repeat(${selectorGrid.columnsCount}, 1fr)`,
            gridTemplateRows: `repeat(${selectorGrid.rowsCount}, ${cellMinHeight}px)`,
          }}
        >
          {filterEntries
            .slice(selectorsPerSlide * slideIndex, selectorsPerSlide * (slideIndex + 1))
            .map(([filterName, [isEnabled]]) => (
              <FilterItem
                key={filterName}
                name={filterName}
                isEnabled={isEnabled}
                onClick={onFilterSelect && (() => onFilterSelect(filterName))}
              />
            ))}
        </ul>,
      )
    }
  }

  return (
    <div className={styles.list} ref={containerRef}>
      <Carousel items={slides} />
    </div>
  )
})

/**
 * Determines how to put selectors into grid
 */
function useSelectorsGrid(containerRef: React.RefObject<HTMLDivElement>): SelectorsGrid | null {
  const { width, height } = useElementSize(containerRef)
  if (width === 0 && height === 0) {
    return null
  }

  return {
    columnsCount: Math.max(1, Math.floor((width - containerHorizontalPadding) / cellMinWidth)),
    rowsCount: Math.max(1, Math.floor((height - containerVerticalPadding) / cellMinHeight)),
  }
}

interface FilterItemProps {
  name: string
  isEnabled: boolean
  onClick?(): unknown
}

function FilterItem({ name, isEnabled, onClick }: FilterItemProps) {
  return (
    <li title={name} className={styles.item} onClick={onClick}>
      <span className={styles.itemStatus}>{isEnabled ? '✅' : '✖️'}</span>
      <span className={styles.itemName}>{name}</span>
      <span className={styles.itemIcon} />
    </li>
  )
}
