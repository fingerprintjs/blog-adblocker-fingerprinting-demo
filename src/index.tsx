import * as React from 'react'
import * as ReactDOM from 'react-dom'
import SelectorsDemo from './view/selectors_demo/selectors_demo'
import FiltersDemo from './view/filters_demo/filters_demo'

function makeDemoRunner(View: React.ComponentType) {
  return function (container: HTMLElement) {
    // todo: Add an error boundary
    ReactDOM.render(
      <React.StrictMode>
        <View />
      </React.StrictMode>,
      container,
    )
  }
}

// Webpack's "library" option doesn't work in development mode for some reason
window.fpjsAdblockerArticleDemos = {
  runSelectorsDemo: makeDemoRunner(SelectorsDemo),
  runFiltersDemo: makeDemoRunner(FiltersDemo),
}
