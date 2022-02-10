import { WayChaserOptions, sortHandlers } from './waychaser'

/**
 * @param baseOptions
 * @param additionalOptions
 */
export function augmentOptions (
  baseOptions: WayChaserOptions,
  additionalOptions?: WayChaserOptions
) {
  const {
    handlers: baseHandlers,
    defaultHandlers: baseDefaultHandlers,
    headers: baseHeaders,
    ...baseOther
  } = baseOptions
  const {
    handlers: additionalHandlers,
    defaultHandlers: additionalDefaultHandlers,
    headers: additionalHeaders,
    ...additionalOther
  } = additionalOptions || {}

  // if additional has default, don't use base default
  // if additional has handlers, don;'t use base handlers
  // augment({ dh: [XXX] }, { h: [YYY] }) => { h: [], dh: [YYY, XXX] }
  // augment({ dh: [XXX] }, { h: [YYY], dh: [] }) => { h: [], dh: [YYY] }
  // augment({ dh: [YYY, XXX] }, { h: [ZZZ] }) => { h: [], dh: [ZZZ, YYY, XXX] }
  // augment({ dh: [YYY, XXX] }, { h: [ZZZ], dh: [] }) => { h: [], dh: [ZZZ] }
  const mergedHandlers = sortHandlers([
    ...(additionalHandlers || baseHandlers || []),
    ...(additionalDefaultHandlers || baseDefaultHandlers || [])
  ])

  const finalOptions = {
    ...baseOther,
    ...additionalOther,
    ...{ defaultHandlers: mergedHandlers },
    handlers: [],
    headers: {
      ...baseHeaders,
      ...additionalHeaders
    }
  }
  return finalOptions
}
