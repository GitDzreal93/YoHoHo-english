import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const ButtonStyled = styled(motion.button)<{
  $variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  $size: 'sm' | 'md' | 'lg';
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.animations.duration.normal} ${theme.animations.ease.out};
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          height: 40px;
          gap: ${theme.spacing.xs};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          height: 56px;
          gap: ${theme.spacing.sm};
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          height: 48px;
          gap: ${theme.spacing.sm};
        `;
    }
  }}

  /* Variant styles */
  ${({ $variant }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: white;
          color: ${theme.colors.primary[600]};
          border: 2px solid ${theme.colors.primary[500]};
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            background: ${theme.colors.primary[50]};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary[600]};

          &:hover:not(:disabled) {
            background: ${theme.colors.primary[50]};
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, ${theme.colors.error[500]}, ${theme.colors.error[600]});
          color: white;
          box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.4);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
          color: white;
          box-shadow: ${theme.shadows.button};

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(251, 146, 60, 0.4);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Loading spinner */
  &:disabled::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  type = 'button',
  ...props
}) => {
  return (
    <ButtonStyled
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </ButtonStyled>
  );
};