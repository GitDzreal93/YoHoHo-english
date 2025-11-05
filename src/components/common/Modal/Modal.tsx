import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { theme } from '@styles/index';
import { Button } from '@components/ui';
import { Icon } from '@components/ui';

interface ModalProps {
  type: string;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
`;

const ModalContainer = styled(motion.div)<{ $size: 'sm' | 'md' | 'lg' | 'full' }>`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  width: 100%;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return 'max-width: 400px;';
      case 'lg':
        return 'max-width: 600px;';
      case 'full':
        return 'max-width: 100%; height: 100%; max-height: 100%;';
      default:
        return 'max-width: 500px;';
    }
  }}
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.gray[500]};
  font-size: 24px;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[700]};
  }
`;

const ModalContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const ModalFooter = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;

// Predefined Modal Types
const SettingsModal = ({ onClose }: { onClose: () => void }) => (
  <>
    <ModalHeader>
      <ModalTitle>设置</ModalTitle>
      <ModalCloseButton onClick={onClose}>
        <Icon name="close" />
      </ModalCloseButton>
    </ModalHeader>
    <ModalContent>
      <p>设置内容...</p>
    </ModalContent>
    <ModalFooter>
      <Button onClick={onClose}>确定</Button>
    </ModalFooter>
  </>
);

const AchievementModal = ({ onClose }: { onClose: () => void }) => (
  <>
    <ModalHeader>
      <ModalTitle>🎉 新成就解锁！</ModalTitle>
      <ModalCloseButton onClick={onClose}>
        <Icon name="close" />
      </ModalCloseButton>
    </ModalHeader>
    <ModalContent style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
      <h3>学习达人</h3>
      <p>连续学习7天，太棒了！</p>
    </ModalContent>
    <ModalFooter>
      <Button onClick={onClose}>太棒了！</Button>
    </ModalFooter>
  </>
);

const ParentAuthModal = ({ onClose }: { onClose: () => void }) => (
  <>
    <ModalHeader>
      <ModalTitle>家长验证</ModalTitle>
      <ModalCloseButton onClick={onClose}>
        <Icon name="close" />
      </ModalCloseButton>
    </ModalHeader>
    <ModalContent>
      <p>请输入家长密码以进入家长控制面板</p>
      <input
        type="password"
        placeholder="请输入密码"
        style={{
          width: '100%',
          padding: '12px',
          border: `1px solid ${theme.colors.gray[300]}`,
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.base,
          marginTop: theme.spacing.md,
        }}
      />
    </ModalContent>
    <ModalFooter>
      <Button variant="secondary" onClick={onClose}>
        取消
      </Button>
      <Button>确认</Button>
    </ModalFooter>
  </>
);

const MODAL_COMPONENTS: Record<string, React.ComponentType<{ onClose: () => void }>> = {
  settings: SettingsModal,
  achievement: AchievementModal,
  parentAuth: ParentAuthModal,
};

export const Modal: React.FC<ModalProps> = ({
  type,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const ModalComponent = MODAL_COMPONENTS[type];

  return createPortal(
    <AnimatePresence>
      <Backdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
      >
        <ModalContainer
          $size={size}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {ModalComponent ? (
            <ModalComponent onClose={onClose} />
          ) : (
            <>
              {(title || showCloseButton) && (
                <ModalHeader>
                  {title && <ModalTitle>{title}</ModalTitle>}
                  {showCloseButton && (
                    <ModalCloseButton onClick={onClose}>
                      <Icon name="close" />
                    </ModalCloseButton>
                  )}
                </ModalHeader>
              )}
              {children && <ModalContent>{children}</ModalContent>}
            </>
          )}
        </ModalContainer>
      </Backdrop>
    </AnimatePresence>,
    document.body
  );
};

// Hook for managing modals
export const useModal = () => {
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  const [modalProps, setModalProps] = React.useState<Record<string, any>>({});

  const showModal = (type: string, props: Record<string, any> = {}) => {
    setActiveModal(type);
    setModalProps(props);
  };

  const hideModal = () => {
    setActiveModal(null);
    setModalProps({});
  };

  const ModalComponent = activeModal ? (
    <Modal
      type={activeModal}
      onClose={hideModal}
      {...modalProps}
    />
  ) : null;

  return {
    showModal,
    hideModal,
    activeModal,
    ModalComponent,
  };
};