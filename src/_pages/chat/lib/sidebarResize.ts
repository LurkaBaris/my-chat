import {
  MAX_SIDEBAR_WIDTH,
  MIN_CHAT_WIDTH,
  MIN_SIDEBAR_WIDTH,
  RESIZE_HANDLE_WIDTH,
} from '../model/constants'

export interface ResizeStart {
  pointerX: number
  sidebarWidth: number
}

export const getSidebarBounds = (containerWidth: number) => ({
  min: MIN_SIDEBAR_WIDTH,
  max: Math.max(
    MIN_SIDEBAR_WIDTH,
    Math.min(MAX_SIDEBAR_WIDTH, containerWidth - MIN_CHAT_WIDTH - RESIZE_HANDLE_WIDTH),
  ),
})

export const clampSidebarWidth = (width: number, containerWidth: number) => {
  const bounds = getSidebarBounds(containerWidth)

  return Math.min(Math.max(width, bounds.min), bounds.max)
}
