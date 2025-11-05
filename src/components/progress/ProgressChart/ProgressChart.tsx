import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Icon } from '@components/index';

interface ProgressChartProps {
  title: string;
  value: number;
  maxValue: number;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  showPercentage?: boolean;
  animated?: boolean;
  subtitle?: string;
}

const ChartContainer = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  text-align: center;
  min-width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '200px';
      case 'medium': return '250px';
      case 'large': return '300px';
      default: return '250px';
    }
  }};
`;

const ChartTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.md};
`;

const CircleChart = styled.svg<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  transform: rotate(-90deg);
  margin: ${theme.spacing.md} 0;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: ${theme.colors.gray[200]};
  stroke-width: 12;
`;

const CircleProgress = styled(motion.circle)<{ $color: string }>`
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;

const PercentageText = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small': return theme.typography.fontSize['2xl'];
      case 'medium': return theme.typography.fontSize['3xl'];
      case 'large': return theme.typography.fontSize['4xl'];
      default: return theme.typography.fontSize['3xl'];
    }
  }};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
  margin: ${theme.spacing.sm} 0;
`;

const ChartSubtitle = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600];
  margin-top: ${theme.spacing.sm};
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.gray[200]};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900];
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray[600];
  margin-top: ${theme.spacing.xs};
`;

export const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  value,
  maxValue,
  color = theme.colors.primary[500],
  size = 'medium',
  showPercentage = true,
  animated = true,
  subtitle
}) => {
  const percentage = Math.round((value / maxValue) * 100);
  const radius = size === 'small' ? 60 : size === 'large' ? 100 : 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / maxValue) * circumference;

  const getSizeValue = () => {
    switch (size) {
      case 'small': return 120;
      case 'large': return 200;
      default: return 160;
    }
  };

  return (
    <ChartContainer $size={size}>
      <ChartTitle>{title}</ChartTitle>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <CircleChart $size={getSizeValue()}>
          <CircleBackground
            cx={getSizeValue() / 2}
            cy={getSizeValue() / 2}
            r={normalizedRadius}
          />
          <CircleProgress
            $color={color}
            cx={getSizeValue() / 2}
            cy={getSizeValue() / 2}
            r={normalizedRadius}
            strokeDasharray={circumference + ' ' + circumference}
            initial={animated ? { strokeDashoffset: circumference } : {}}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </CircleChart>

        <PercentageText $size={size}>
          {showPercentage ? `${percentage}%` : `${value}/${maxValue}`}
        </PercentageText>
      </div>

      {subtitle && (
        <ChartSubtitle>{subtitle}</ChartSubtitle>
      )}

      <ProgressStats>
        <StatItem>
          <StatValue>{value}</StatValue>
          <StatLabel>已完成</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{maxValue - value}</StatValue>
          <StatLabel>待完成</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{percentage}%</StatValue>
          <StatLabel>完成率</StatLabel>
        </StatItem>
      </ProgressStats>
    </ChartContainer>
  );
};