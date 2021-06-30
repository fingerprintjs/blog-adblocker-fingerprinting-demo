import * as React from 'react'
import { Carousel as ReactCarousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import * as styles from './carousel.css'

interface Props {
  items: React.ReactChild[]
  className?: string
}

export default function Carousel({ items, className }: Props): React.ReactElement {
  const carouselRef = React.useRef<ReactCarousel>(null)

  // Return to the last slide when the current slide is removed
  React.useEffect(() => {
    if (carouselRef.current) {
      if (carouselRef.current.state.selectedItem >= items.length) {
        carouselRef.current.moveTo(items.length - 1)
      }
    }
  }, [items.length])

  // Mouse/touch sliding will break if you create an empty carousel first and then fill it. Also, mouse/touch sliding
  // won't make an effect before the sliding end if you create a carousel with a single slide and then add more slides.
  // Therefore, it's never rendered with less than 2 slides.
  if (items.length <= 1) {
    return <div className={className}>{items}</div>
  }

  return (
    <ReactCarousel
      ref={carouselRef}
      className={`${styles.root} ${className || ''}`}
      emulateTouch
      showThumbs={false}
      showIndicators={false}
      interval={1e11} // Circumvents a bug: https://github.com/leandrowd/react-responsive-carousel/issues/596
      renderArrowPrev={(clickHandler: () => unknown, hasPrev: boolean, label: string) => (
        <Arrow direction={-1} label={label} active={hasPrev} onClick={clickHandler} />
      )}
      renderArrowNext={(clickHandler: () => unknown, hasPrev: boolean, label: string) => (
        <Arrow direction={1} label={label} active={hasPrev} onClick={clickHandler} />
      )}
    >
      {items}
    </ReactCarousel>
  )
}

interface ArrowProps {
  direction: -1 | 1
  label: string
  active: boolean
  onClick: () => unknown
}

const Arrow = React.memo(function Arrow({ direction, label, active, onClick }: ArrowProps) {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    onClick()
  }

  return (
    <div
      className={`${styles.arrow} ${direction > 0 ? styles.next : styles.prev} ${active ? styles.active : ''}`}
      title={label}
      onClick={handleClick}
    />
  )
})
