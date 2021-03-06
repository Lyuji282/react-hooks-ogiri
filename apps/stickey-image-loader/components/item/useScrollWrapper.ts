import {
  useState,
  useMemo,
  useEffect,
  RefObject
} from 'react'
// @ts-ignore
import throttle from 'lodash.throttle'
// @ts-ignore
import merge from 'lodash.merge'

// ______________________________________________________
//
// @ Types

type State = 'LEAVE' | 'ENTER' | null
type Options = {
  throttleInterval: number
}
type Props = {
  ref: RefObject<HTMLElement>
  onEnter: () => void
  onLeave: () => void
} & Partial<Options>
// ______________________________________________________
//
// @ Defaults

const defaultState = (): State => null
const defaultOptions = (): Options => ({
  throttleInterval: 16
})
// ______________________________________________________
//
// @ Hooks

const useScrollWrapper = (props: Props) => {
  const [state, setCurrent] = useState<State>(
    defaultState()
  )
  const options = useMemo(
    (): Options =>
      merge(defaultOptions(), {
        throttleInterval: props.throttleInterval
      }),
    [props.throttleInterval]
  )
  useEffect(
    () => {
      const handleWindowScroll = throttle(() => {
        if (props.ref.current === null) return
        const {
          top,
          height
        } = props.ref.current.getBoundingClientRect()
        const isEnter =
          top - window.innerHeight <= 0 && top + height >= 0
        if (isEnter) {
          setCurrent('ENTER')
        } else {
          setCurrent('LEAVE')
        }
      }, options.throttleInterval)
      handleWindowScroll()
      window.addEventListener('scroll', handleWindowScroll)
      return () =>
        window.removeEventListener(
          'scroll',
          handleWindowScroll
        )
    },
    [props.ref, options.throttleInterval]
  )
  useEffect(
    () => {
      if (props.ref.current === null) return
      if (state === 'ENTER') {
        props.onEnter()
      } else {
        props.onLeave()
      }
    },
    [props.ref, state]
  )
}
// ______________________________________________________
//
// @ exports

export { useScrollWrapper, Options }
