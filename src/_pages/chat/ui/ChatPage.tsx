'use client'

import type { ConversationPreview } from '@/entities/conversation'
import { StartConversationButton } from '@/features/start-conversation'
import type { AuthUser } from '@/shared/lib'
import { ChatListWidget } from '@/widgets/chat-list'
import { Avatar } from 'antd'
import clsx from 'clsx'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { clampSidebarWidth, type ResizeStart } from '../lib/sidebarResize'
import { DEFAULT_SIDEBAR_WIDTH } from '../model/constants'
import styles from './ChatPage.module.css'

interface ChatPageProps {
  actions: ReactNode
  authUser: AuthUser
  children: ReactNode
  conversations: ConversationPreview[]
}

export const ChatPage = ({ actions, authUser, children, conversations }: ChatPageProps) => {
  const layoutRef = useRef<HTMLDivElement>(null)
  const resizeStartRef = useRef<ResizeStart | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

  const updateSidebarWidth = (width: number) => {
    const containerWidth = layoutRef.current?.getBoundingClientRect().width

    if (!containerWidth) return

    setSidebarWidth(clampSidebarWidth(width, containerWidth))
  }

  const finishResize = () => {
    resizeStartRef.current = null
    setIsResizing(false)
  }

  const handleResizePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    resizeStartRef.current = {
      pointerX: event.clientX,
      sidebarWidth,
    }
    setIsResizing(true)
  }

  const handleResizePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const resizeStart = resizeStartRef.current

    if (!resizeStart) return

    updateSidebarWidth(resizeStart.sidebarWidth + event.clientX - resizeStart.pointerX)
  }

  const handleResizePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    finishResize()
  }

  useEffect(() => {
    const layout = layoutRef.current

    if (!layout) return

    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width

      setSidebarWidth((currentWidth) => clampSidebarWidth(currentWidth, containerWidth))
    })

    observer.observe(layout)

    return () => observer.disconnect()
  }, [])

  const displayName = authUser.name?.trim() || authUser.email?.trim() || 'Пользователь'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <main className={clsx(styles.page, isResizing && styles.pageResizing)}>
      <div
        className={styles.layout}
        ref={layoutRef}
        style={{ '--sidebar-width': `${sidebarWidth}px` } as CSSProperties}
      >
        <ChatListWidget conversations={conversations}>
          <StartConversationButton />
          <div className={styles.userBar}>
            <div className={styles.userProfile}>
              <Avatar className={styles.userAvatar} size={32}>
                {avatarLetter}
              </Avatar>

              <div className={styles.userMeta}>
                <p className={styles.userName}>{authUser.name || 'Пользователь'}</p>

                {authUser.email && <p className={styles.userEmail}>{authUser.email}</p>}
              </div>
            </div>

            <div className={styles.userActions}>{actions}</div>
          </div>
        </ChatListWidget>

        <button
          className={clsx(styles.resizeHandle, isResizing && styles.resizeHandleActive)}
          onDoubleClick={() => updateSidebarWidth(DEFAULT_SIDEBAR_WIDTH)}
          onLostPointerCapture={finishResize}
          onPointerCancel={handleResizePointerUp}
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          type="button"
        />

        {children}
      </div>
    </main>
  )
}
