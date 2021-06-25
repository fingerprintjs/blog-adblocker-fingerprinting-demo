import * as React from 'react'
import * as ReactDOM from 'react-dom'
import DemoSelector from './view/demo_selector'
import './view/global.css'
import './view/loading_screen/loading_screen.css' // Required for the HTML code

// todo: Add an error boundary
ReactDOM.render(
  <React.StrictMode>
    <DemoSelector />
  </React.StrictMode>,
  document.querySelector('#app'),
)
