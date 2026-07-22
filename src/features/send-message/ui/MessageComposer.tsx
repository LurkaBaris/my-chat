'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { App, Button, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea.js'
import { Paperclip } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { sendMessage } from '../actions/sendMessage.action'
import {
  MESSAGE_MAX_LENGTH,
  sendMessageSchema,
  type SendMessageSchemaType,
} from '../model/sendMessageSchema'
import styles from './MessageComposer.module.css'

interface MessageComposerProps {
  conversationId: string
}

export const MessageComposer = ({ conversationId }: MessageComposerProps) => {
  const { notification } = App.useApp()
  const {
    control,
    handleSubmit,
    resetField,
    setFocus,
    formState: { isSubmitting },
  } = useForm<SendMessageSchemaType>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      conversationId,
      body: '',
    },
  })
  const body = useWatch({ control, name: 'body' })
  const isSendDisabled = isSubmitting || !body.trim()

  const showError = (description: string) => {
    notification.error({
      title: 'Сообщение не отправлено',
      description,
      key: 'send-message-error',
      placement: 'topRight',
    })
  }

  const onSubmit = async ({ body }: SendMessageSchemaType) => {
    try {
      const result = await sendMessage(conversationId, body)

      if (!result.success) {
        showError(result.message)
        return
      }

      resetField('body')
    } catch {
      showError('Не удалось отправить сообщение')
    } finally {
      setFocus('body')
    }
  }

  const submitMessage = handleSubmit(onSubmit)

  const onPressEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return

    event.preventDefault()
    submitMessage()
  }

  return (
    <form className={styles.composer} noValidate onSubmit={submitMessage}>
      <Tooltip title="Прикрепить файл">
        <Button
          className={styles.attachButton}
          color="default"
          disabled={isSubmitting}
          htmlType="button"
          icon={<Paperclip aria-hidden size={20} strokeWidth={1.8} />}
          shape="circle"
          type="text"
        />
      </Tooltip>

      <Controller
        control={control}
        name="body"
        render={({ field, fieldState }) => (
          <div className={styles.field}>
            <label className={styles.visuallyHidden} htmlFor="chat-message">
              Сообщение
            </label>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              className={styles.textarea}
              id="chat-message"
              maxLength={MESSAGE_MAX_LENGTH}
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              onPressEnter={onPressEnter}
              placeholder="Напишите сообщение..."
              readOnly={isSubmitting}
              ref={field.ref}
              status={fieldState.error ? 'error' : undefined}
              value={field.value}
            />
          </div>
        )}
      />

      <Button
        className={styles.sendButton}
        disabled={isSendDisabled}
        htmlType="submit"
        loading={isSubmitting}
        type="primary"
      >
        Отправить
      </Button>
    </form>
  )
}
