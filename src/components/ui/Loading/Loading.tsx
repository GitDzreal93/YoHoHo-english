import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@styles/index';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  overlay?: boolean;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div<{ $overlay: boolean; $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  ${({ $overlay }) => $overlay && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 9999;
  `}

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return 'padding: 20px;';
      case 'lg':
        return 'padding: 40px;';
      default:
        return 'padding: 30px;';
    }
  }}
`;

const Spinner = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  border: 3px solid ${theme.colors.gray[200]};
  border-top: 3px solid ${({ $color }) => $color || theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return 'width: 24px; height: 24px;';
      case 'lg':
        return 'width: 48px; height: 48px; border-width: 4px;';
      default:
        return 'width: 32px; height: 32px;';
    }
  }}
`;

const Dots = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color || theme.colors.primary[500]};
  animation: ${pulse} 1.4s ease-in-out infinite both;

  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
  &:nth-child(3) { animation-delay: 0s; }
`;

const LoadingText = styled.p<{ $size: 'sm' | 'md' | 'lg' }>`
  color: ${theme.colors.gray[600]};
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `font-size: ${theme.typography.fontSize.sm};`;
      case 'lg':
        return `font-size: ${theme.typography.fontSize.lg};`;
      default:
        return `font-size: ${theme.typography.fontSize.base};`;
    }
  }}
`;

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = theme.colors.primary[500],
  text,
  overlay = false,
}) => {
  return (
    <LoadingContainer $overlay={overlay} $size={size}>
      <Spinner $size={size} $color={color} />
      {text && <LoadingText $size={size}>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export const DotsLoading: React.FC<LoadingProps> = ({
  size = 'md',
  color = theme.colors.primary[500],
  text,
  overlay = false,
}) => {
  return (
    <LoadingContainer $overlay={overlay} $size={size}>
      <Dots>
        <Dot $color={color} />
        <Dot $color={color} />
        <Dot $color={color} />
      </Dots>
      {text && <LoadingText $size={size}>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export const Skeleton: React.FC<{
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}> = ({
  width = '100%',
  height = '20px',
  borderRadius = theme.borderRadius.sm,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${theme.colors.gray[200]} 25%, ${theme.colors.gray[100]} 50%, ${theme.colors.gray[200]} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'skeleton 1.5s infinite',
      }}
    />
  );
};

// Add skeleton animation to global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes skeleton {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(style);