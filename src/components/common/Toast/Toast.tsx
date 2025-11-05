import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Icon } from '@components/ui';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled(motion.div)<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ $type }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success[500];
      case 'error':
        return theme.colors.error[500];
      case 'warning':
        return theme.colors.warning[500];
      case 'info':
      default:
        return theme.colors.info[500];
    }
  }};
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  z-index: 10000;
  min-width: 200px;
  max-width: 90vw;
  animation: ${slideIn} 0.3s ease-out;
`;

const IconWrapper = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

const Message = styled.div`
  flex: 1;
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.normal};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const getIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'info';
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <ToastContainer
      $type={type}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <IconWrapper>
        <Icon name={getIcon(type)} size="md" />
      </IconWrapper>
      <Message>{message}</Message>
      <CloseButton onClick={onClose}>
        <Icon name="close" size="sm" />
      </CloseButton>
    </ToastContainer>
  );
};

// Toast Manager for handling multiple toasts
interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  autoClose?: boolean;
  duration?: number;
}

interface ToastManagerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export const ToastManager: React.FC<ToastManagerProps> = ({ toasts, onRemove }) => {
  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, right: 20, zIndex: 10000 }}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
          autoClose={toast.autoClose}
          duration={toast.duration}
          style={{ marginBottom: '10px' }}
        />
      ))}
    </div>
  );
};