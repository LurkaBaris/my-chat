'use client'

import { CustomInput } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal } from 'antd'
import { MessageCirclePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { startConversationByEmail } from '../actions/startConversation.action'
import {
  startConversationSchema,
  type StartConversationSchemaType,
} from '../model/startConversationSchema'
import styles from './StartConversationButton.module.css'

export const StartConversationButton = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<StartConversationSchemaType>({
    resolver: zodResolver(startConversationSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  })

  const closeModal = () => {
    if (isSubmitting) return

    setIsOpen(false)
    reset()
  }

  const handleCreate: SubmitHandler<StartConversationSchemaType> = async (data) => {
    try {
      const result = await startConversationByEmail(data)

      if (!result.success) {
        setError('email', { type: 'server', message: result.message })
        return
      }

      setIsOpen(false)
      reset()
      router.push(`/chat/${result.conversationId}`)
    } catch {
      setError('email', {
        type: 'server',
        message: 'Не удалось создать чат. Попробуйте ещё раз',
      })
    }
  }

  return (
    <>
      <Button
        block
        icon={<MessageCirclePlus aria-hidden size={18} />}
        onClick={() => setIsOpen(true)}
        type="primary"
      >
        Начать новый чат
      </Button>

      <Modal
        className={styles.modal}
        destroyOnHidden
        footer={null}
        closable={!isSubmitting}
        onCancel={closeModal}
        open={isOpen}
        title="Новый чат"
        width={460}
        wrapClassName={styles.modalWrap}
      >
        <Form
          className={styles.form}
          layout="vertical"
          noValidate
          onFinish={handleSubmit(handleCreate)}
        >
          <CustomInput
            autoFocus
            autoCapitalize="none"
            autoComplete="email"
            control={control}
            disabled={isSubmitting}
            id="conversation-email"
            label="Email пользователя"
            name="email"
            placeholder="example@mail.com"
            required
            spellCheck={false}
            type="email"
          />

          <div className={styles.actions}>
            <Button disabled={isSubmitting} onClick={closeModal}>
              Отмена
            </Button>
            <Button htmlType="submit" loading={isSubmitting} type="primary">
              Создать
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
