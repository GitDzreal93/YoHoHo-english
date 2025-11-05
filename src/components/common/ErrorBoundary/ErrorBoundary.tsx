import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/index';
import { Button } from '@components/ui';
import { Icon } from '@components/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
  opacity: 0.5;
`;

const ErrorTitle = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.lg};
  max-width: 400px;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const ErrorDetails = styled.details`
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.md};
  text-align: left;
  max-width: 600px;

  summary {
    cursor: pointer;
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.gray[700]};
    margin-bottom: ${theme.spacing.sm};
  }

  pre {
    background: ${theme.colors.gray[900]};
    color: ${theme.colors.gray[100]};
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
    overflow-x: auto;
    font-size: ${theme.typography.fontSize.sm};
    margin-top: ${theme.spacing.sm};
  }
`;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // sendErrorToService(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>🚨</ErrorIcon>
          <ErrorTitle>哎呀，出错了！</ErrorTitle>
          <ErrorMessage>
            应用程序遇到了意外错误。请尝试刷新页面或返回首页。
          </ErrorMessage>

          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Button onClick={this.handleReload} icon={<Icon name="refresh" />}>
              刷新页面
            </Button>
            <Button variant="secondary" onClick={this.handleGoHome} icon={<Icon name="home" />}>
              返回首页
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>查看错误详情</summary>
              <pre>
                {this.state.error.stack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}