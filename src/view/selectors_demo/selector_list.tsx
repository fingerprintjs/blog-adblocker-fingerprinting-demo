import * as React from 'react'
import { useElementSize } from '../../helpers/react_hooks'
import Carousel from '../carousel/carousel'
import * as styles from './selector_list.css'

type SelectorsGrid = { columnsCount: number; rowsCount: number }

const cellMinWidth = 320
const cellMinHeight = 22
const containerHorizontalPadding = 0
const containerVerticalPadding = 20

interface Props {
  progress: number
  selectorStatuses: Map<string, boolean>
  showOnlyBlocked: boolean
}

export default React.memo(function SelectorList({ progress, selectorStatuses, showOnlyBlocked }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const selectorGrid = useSelectorsGrid(containerRef)
  const slides: React.ReactChild[] = []

  // Don't render the slides when the size is unknown yet
  if (selectorGrid) {
    const selectorsPerSlide = selectorGrid.columnsCount * selectorGrid.rowsCount
    const applicableSelectors: string[] = []

    selectorStatuses.forEach((isBlocked, selector) => {
      if (isBlocked || !showOnlyBlocked) {
        applicableSelectors.push(selector)
      }
    })

    for (let slideIndex = 0; slideIndex < Math.ceil(applicableSelectors.length / selectorsPerSlide); ++slideIndex) {
      slides.push(
        <ul
          key={slideIndex}
          className={styles.slide}
          style={{
            gridTemplateColumns: `repeat(${selectorGrid.columnsCount}, 1fr)`,
            gridTemplateRows: `repeat(${selectorGrid.rowsCount}, ${cellMinHeight}px)`,
          }}
        >
          {applicableSelectors
            .slice(selectorsPerSlide * slideIndex, selectorsPerSlide * (slideIndex + 1))
            .map((selector) => {
              const isBlocked = selectorStatuses.get(selector)
              return (
                <li key={selector} title={selector} className={isBlocked ? styles.blocked : undefined}>
                  {isBlocked ? '⛔️' : '🆗'} {selector}
                </li>
              )
            })}
        </ul>,
      )
    }
  }

  return (
    <div className={styles.list} ref={containerRef}>
      {selectorGrid &&
        (progress >= 1 && slides.length === 0 ? (
          <div className={styles.noSelectors}>Your browser blocks no known selectors</div>
        ) : (
          <Carousel items={slides} />
        ))}
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
