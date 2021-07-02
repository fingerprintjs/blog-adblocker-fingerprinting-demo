import { selectorToElement } from './dom'

export default async function getBlockedSelectors<T extends string>(selectors: readonly T[]): Promise<Set<T>> {
  const d = document
  const root = d.createElement('div')
  const elements = new Array<HTMLElement>(selectors.length)
  const blockedSelectors = new Set<T>()

  // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
  // browser will alternate tree modification and layout reading, that is very slow.
  for (let i = 0; i < selectors.length; ++i) {
    const element = selectorToElement(selectors[i])
    const holder = d.createElement('div') // Protects from unwanted effects of `+` and `~` selectors of filters
    holder.appendChild(element)
    root.appendChild(holder)
    elements[i] = element
  }

  d.body.appendChild(root)

  try {
    // Then wait for the ad blocker to hide the element
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Then check which of the elements are blocked
    for (let i = 0; i < selectors.length; ++i) {
      if (!elements[i].offsetParent) {
        blockedSelectors.add(selectors[i])
      }
    }
  } finally {
    // Then remove the elements
    root.parentNode?.removeChild(root)
  }

  return blockedSelectors
}
