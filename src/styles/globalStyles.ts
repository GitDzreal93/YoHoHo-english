import styled, { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *:focus {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.base};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.gray[900]};
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    font-size: 16px;
  }

  /* 移动端优化 */
  @media (max-width: ${theme.breakpoints.sm}) {
    body {
      font-size: 14px;
    }

    #root {
      font-size: 14px;
    }
  }

  /* 大屏优化 */
  @media (min-width: ${theme.breakpoints.lg}) {
    body {
      font-size: 18px;
    }

    #root {
      font-size: 18px;
    }
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray[100]};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[300]};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gray[400]};
  }

  /* 选中文字样式 */
  ::selection {
    background-color: ${theme.colors.primary[200]};
    color: ${theme.colors.primary[900]};
  }

  /* 图片优化 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 按钮优化 */
  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
  }

  /* 输入框优化 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  /* 链接样式 */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* 禁用拖拽 */
  img, svg {
    -webkit-user-drag: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  /* 触摸优化 */
  @media (hover: none) and (pointer: coarse) {
    button, a, [role="button"] {
      min-height: 44px;
      min-width: 44px;
    }
  }

  /* 防止长按选择 */
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* 安全区域适配 */
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }

  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .safe-area-left {
    padding-left: env(safe-area-inset-left);
  }

  .safe-area-right {
    padding-right: env(safe-area-inset-right);
  }

  .safe-area-all {
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
`;

export const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};

  @media (min-width: ${theme.breakpoints.lg}) {
    max-width: 768px;
  }
`;

export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TextGradient = styled.span`
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: ${theme.shadows.card};
`;

export const ButtonGradient = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  box-shadow: ${theme.shadows.button};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(251, 146, 60, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;