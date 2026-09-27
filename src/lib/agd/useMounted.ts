import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/** false podczas prerenderu i pierwszego renderu, true po hydracji — dla danych z localStorage */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
