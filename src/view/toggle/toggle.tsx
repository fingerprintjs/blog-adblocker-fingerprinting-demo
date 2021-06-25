import * as React from 'react'
import * as styles from './toggle.css'

export interface Props {
  checked: boolean
  className?: string
  onChange?(value: boolean): unknown
}

export default React.memo(function Toggle({ className = '', checked, onChange }: Props) {
  const handleCheck = (event: React.MouseEvent) => {
    event.preventDefault()
    onChange?.(!checked)
  }

  return (
    <div className={`${styles.toggle} ${checked ? styles.checked : ''} ${className}`} onClick={handleCheck}>
      <div className={styles.indicator} />
    </div>
  )
})
