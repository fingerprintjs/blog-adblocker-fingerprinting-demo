import * as React from 'react'
import LoadingScreen from './loading_screen/loading_screen'

const enum Demo {
  Selectors,
  Filters,
}

const SelectorsDemo = React.lazy(() => import('./selectors_demo/selectors_demo'))
const FiltersDemo = React.lazy(() => import('./filters_demo/filters_demo'))

/**
 * Selects the demo manually or automatically based on the page URL
 */
export default function DemoSelector(): React.ReactElement {
  const [selected, select] = React.useState(() => {
    const demoMatch = /[&?]demo=(.*?)($|&)/i.exec(location.search)
    switch (demoMatch?.[1]) {
      case 'selectors':
        return Demo.Selectors
      case 'filters':
        return Demo.Filters
      default:
        return undefined
    }
  })

  switch (selected) {
    case Demo.Selectors:
      return (
        <React.Suspense fallback={<LoadingScreen fullAbsolute />}>
          <SelectorsDemo />
        </React.Suspense>
      )
    case Demo.Filters:
      return (
        <React.Suspense fallback={<LoadingScreen fullAbsolute />}>
          <FiltersDemo />
        </React.Suspense>
      )
  }

  return (
    <>
      Select a demo:
      <br />
      <button onClick={() => select(Demo.Selectors)}>Blocked Selectors</button>
      <br />
      <button onClick={() => select(Demo.Filters)}>Enabled Filters</button>
    </>
  )
}
