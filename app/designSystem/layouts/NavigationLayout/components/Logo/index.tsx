import { useDesignSystem } from '@/designSystem/provider'
import { useNavigate } from '@remix-run/react'
import { Flex, Typography } from 'antd'
import React, { ImgHTMLAttributes } from 'react'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  isLabel?: boolean
}

export const Logo: React.FC<Props> = ({
  height = 50,
  isLabel = false,
  style,
  ...props
}) => {
  const router = useNavigate()
  const { isMobile } = useDesignSystem()

  const goTo = (url: string) => {
    router(url)
  }

  return (
    <Flex
      align="center"
      gap={isMobile ? 5 : 10}
      wrap="nowrap"
      onClick={() => goTo('/home')}
    >
      <img
        src={
          'https://t4.ftcdn.net/jpg/04/80/07/65/240_F_480076596_9kBMBjheEMPoR422SJp0olzqMHuthBtu.jpg'
        }
        {...props}
        alt="Logo"
        height={height}
        style={{
          borderRadius: '5px',
          cursor: 'pointer',
          objectFit: 'contain',
          height: isMobile ? '40px' : '100px',
          maxWidth: '100%',
        }}
        onError={event => {
          const target = event.target as HTMLImageElement
          target.onerror = null
          target.src = 'https://i.imgur.com/2dcDGIE.png'
        }}
      />
      {isLabel && (
        <Typography.Title level={4} style={{ margin: '0px' }}>
          HR Management System
        </Typography.Title>
      )}
    </Flex>
  )
}
