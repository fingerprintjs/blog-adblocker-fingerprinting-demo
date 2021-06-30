import * as React from 'react'
import LoadingScreen from './loading_screen/loading_screen'

const enum Demo {
  Selectors,
  Filters,
}

const SelectorsDemo = React.lazy(async () => {
  const module = await import('./selectors_demo/selectors_demo')
  // Wait for the CSS to load. Otherwise the content size detector can detect incorrect
  await new Promise((resolve) => setTimeout(resolve, 500))
  return module
})
const FiltersDemo = React.lazy(async () => {
  const module = await import('./filters_demo/filters_demo')
  // Wait for the CSS to load. Otherwise the content size detector can detect incorrect
  await new Promise((resolve) => setTimeout(resolve, 500))
  return module
})

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
