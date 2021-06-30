import React from 'react'
import * as styles from './filter_modal.css'

interface Props {
  open?: boolean
  filterEnabled: boolean
  filterName: string
  selectors: Map<string, boolean>
  onClose?(): unknown
}

export default React.memo(function FilterModal({ open, filterEnabled, filterName, selectors, onClose }: Props) {
  const selectorElements: React.ReactNode[] = []

  selectors.forEach((isBlocked, selector) => {
    selectorElements.push(
      <li>
        <span className={styles.selectorStatus}>{isBlocked ? '⛔️' : '🆗'}</span>
        <span className={styles.selectorName}>{selector}</span>
      </li>,
    )
  })

  return (
    <div className={`${styles.root} ${open ? styles.open : ''}`}>
      <div className={styles.card}>
        <span className={styles.close} onClick={onClose} />
        <div className={styles.header}>
          <span className={styles.headerStatus}>{filterEnabled ? '✅' : '❌'}</span>
          <span className={styles.headerName}>{filterName}</span>
        </div>
        <ul className={styles.selectors}>{selectorElements}</ul>
      </div>
      <div className={styles.underlay} onClick={onClose} />
    </div>
  )
})
