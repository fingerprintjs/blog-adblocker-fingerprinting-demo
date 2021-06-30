import * as React from 'react'
import * as styles from './layout.css'

interface Props {
  header?: React.ReactNode
  children?: React.ReactNode
}

export default function Layout({ header, children }: Props): React.ReactElement {
  return (
    <div className={styles.body}>
      <div className={styles.header}>{header}</div>
      {children}
    </div>
  )
}
