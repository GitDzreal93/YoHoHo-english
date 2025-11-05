import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'game' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  disabled?: boolean;
  className?: string;
}

const CardStyled = styled(motion.div)<{
  $variant: 'default' | 'glass' | 'game' | 'elevated';
  $padding: 'sm' | 'md' | 'lg';
  $hover: boolean;
  $disabled: boolean;
}>`
  border-radius: ${theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  transition: all ${theme.animations.duration.normal} ${theme.animations.ease.out};
  position: relative;
  overflow: hidden;

  /* Padding variants */
  ${({ $padding }) => {
    switch ($padding) {
      case 'sm':
        return `padding: ${theme.spacing.sm};`;
      case 'lg':
        return `padding: ${theme.spacing.lg};`;
      default:
        return `padding: ${theme.spacing.md};`;
    }
  }}

  /* Variant styles */
  ${({ $variant }) => {
    switch ($variant) {
      case 'glass':
        return `
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: ${theme.shadows.card};
        `;
      case 'game':
        return `
          background: white;
          border-radius: ${theme.borderRadius.xl};
          box-shadow: ${theme.shadows.md};
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
        `;
      case 'elevated':
        return `
          background: white;
          box-shadow: ${theme.shadows.lg};
          border: 1px solid ${theme.colors.gray[200]};
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.95);
          box-shadow: ${theme.shadows.md};
        `;
    }
  }}

  /* Hover effect */
  ${({ $hover, $disabled }) => $hover && !$disabled && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.xl};
    }
  `}

  /* Disabled state */
  ${({ $disabled }) => $disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  `}

  /* Game variant hover effect */
  ${({ $variant, $hover, $disabled }) =>
    $variant === 'game' && $hover && !$disabled && `
    &:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 16px 32px rgba(31, 38, 135, 0.2);
    }
  `}
`;

const RippleEffect = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: scale(0);
  animation: ripple 0.6s ease-out;

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  variant = 'default',
  padding = 'md',
  hover = true,
  disabled = false,
  className,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      // Create ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      e.currentTarget.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      onClick();
    }
  };

  return (
    <CardStyled
      $variant={variant}
      $padding={padding}
      $hover={hover && !!onClick}
      $disabled={disabled}
      onClick={handleClick}
      className={className}
      whileHover={hover && onClick && !disabled ? { y: -4 } : {}}
      whileTap={onClick && !disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </CardStyled>
  );
};