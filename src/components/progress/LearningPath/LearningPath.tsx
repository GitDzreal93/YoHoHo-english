import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Button, Icon } from '@components/index';

interface LearningNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'lesson' | 'game' | 'quiz' | 'achievement';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress?: number;
  total?: number;
  requiredScore?: number;
  unlockedAt?: string;
  completedAt?: string;
}

interface LearningPathProps {
  nodes: LearningNode[];
  currentNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  compact?: boolean;
}

const PathContainer = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  overflow-x: auto;
`;

const PathTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: \1}
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const PathContent = styled.div<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: ${({ $compact }) => $compact ? '600px' : '800px'};
  padding: ${theme.spacing.lg} 0;
  position: relative;
`;

const PathLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: ${theme.colors.gray[300};
  transform: translateY(-50%);
  z-index: 1;
`;

const PathProgress = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  background: \1}
  transform: translateY(-50%);
  z-index: 2;
`;

const LearningNodeContainer = styled(motion.div)<{
  $status: 'locked' | 'available' | 'in_progress' | 'completed';
  $isCurrent: boolean;
}>`
  position: relative;
  z-index: 3;
  cursor: ${({ $status }) => ($status === 'locked' ? 'not-allowed' : 'pointer')};
  opacity: ${({ $status }) => ($status === 'locked' ? 0.6 : 1)};
`;

const NodeCircle = styled.div<{
  $status: 'locked' | 'available' | 'in_progress' | 'completed';
  $type: 'lesson' | 'game' | 'quiz' | 'achievement';
  $isCurrent: boolean;
}>`
  width: ${({ $compact }) => $compact ? '60px' : '80px'};
  height: ${({ $compact }) => $compact ? '60px' : '80px'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $compact }) => $compact ? '24px' : '32px'};
  position: relative;
  border: 4px solid ${({ $status, $type, $isCurrent, theme }) => {
    if ($isCurrent) return theme.colors.warning[600];
    switch ($status) {
      case 'completed':
        return theme.colors.success[600];
      case 'in_progress':
        return theme.colors.primary[600];
      case 'available':
        return theme.colors.gray[400];
      case 'locked':
        return theme.colors.gray[300];
      default:
        return theme.colors.gray[400];
    }
  }};
  background: ${({ $status, $type, theme }) => {
    if ($status === 'completed') return theme.colors.success[500];
    if ($status === 'in_progress') return theme.colors.primary[500];
    if ($status === 'locked') return theme.colors.gray[200];

    switch ($type) {
      case 'achievement':
        return theme.colors.warning[500];
      case 'quiz':
        return theme.colors.error[500];
      case 'game':
        return theme.colors.purple[500];
      default:
        return theme.colors.blue[500];
    }
  }};
  color: white;
  transition: all 0.3s ease;
  box-shadow: ${({ $isCurrent }) => $isCurrent ? `0 0 20px rgba(255, 193, 7, 0.6)` : 'none'};

  ${({ $status }) => $status !== 'locked' && `
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  `}
`;

const NodeIcon = styled.div`
  font-size: inherit;
`;

const NodeProgress = styled.div<{ $compact: boolean }>`
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: \1}
  color: white;
  border-radius: 50%;
  width: ${({ $compact }) => $compact ? '20px' : '24px'};
  height: ${({ $compact }) => $compact ? '20px' : '24px'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $compact }) => $compact ? '10px' : '12px'};
  font-weight: ${theme.typography.fontWeight.bold};
  border: 2px solid white;
`;

const NodeInfo = styled.div<{ $compact: boolean }>`
  position: absolute;
  top: ${({ $compact }) => $compact ? '70px' : '90px'};
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  min-width: 120px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  ${LearningNodeContainer}:hover & {
    opacity: 1;
  }
`;

const NodeTitle = styled.div<{ $compact: boolean }>`
  font-size: ${({ $compact }) => $compact ? theme.typography.fontSize.sm : theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: \1}
  margin-bottom: ${theme.spacing.xs};
  white-space: nowrap;
`;

const NodeDescription = styled.div<{ $compact: boolean }>`
  font-size: ${({ $compact }) => $compact ? theme.typography.fontSize.xs : theme.typography.fontSize.sm};
  color: \1}
  max-width: 150px;
  line-height: 1.3;
`;

const NodeStatus = styled.div<{ $status: 'locked' | 'available' | 'in_progress' | 'completed' }>`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'completed': return theme.colors.success[600];
      case 'in_progress': return theme.colors.primary[600];
      case 'available': return theme.colors.warning[600];
      case 'locked': return theme.colors.gray[500];
      default: return theme.colors.gray[600];
    }
  }};
  margin-top: ${theme.spacing.xs};
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const getNodeIcon = (type: string): string => {
  switch (type) {
    case 'lesson': return '📚';
    case 'game': return '🎮';
    case 'quiz': return '📝';
    case 'achievement': return '🏆';
    default: return '📖';
  }
};

export const LearningPath: React.FC<LearningPathProps> = ({
  nodes,
  currentNodeId,
  onNodeClick,
  compact = false
}) => {
  const completedCount = nodes.filter(node => node.status === 'completed').length;
  const progressPercentage = nodes.length > 0 ? (completedCount / nodes.length) * 100 : 0;

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.status !== 'locked' && onNodeClick) {
      onNodeClick(nodeId);
    }
  };

  return (
    <PathContainer>
      <PathTitle>
        <Icon name="path" />
        学习路径
      </PathTitle>

      <PathContent $compact={compact}>
        <PathLine />
        <PathProgress
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {nodes.map((node, index) => {
          const isCurrent = node.id === currentNodeId;
          const progress = node.progress && node.total ? Math.round((node.progress / node.total) * 100) : 0;

          return (
            <LearningNodeContainer
              key={node.id}
              $status={node.status}
              $isCurrent={isCurrent}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: node.status !== 'locked' ? 1.1 : 1 }}
              whileTap={{ scale: node.status !== 'locked' ? 0.95 : 1 }}
              onClick={() => handleNodeClick(node.id)}
            >
              <NodeCircle
                $status={node.status}
                $type={node.type}
                $isCurrent={isCurrent}
              >
                <NodeIcon>{getNodeIcon(node.type)}</NodeIcon>

                {node.status === 'in_progress' && node.progress && node.total && (
                  <NodeProgress $compact={compact}>
                    {progress}%
                  </NodeProgress>
                )}

                {node.status === 'locked' && (
                  <LockOverlay>🔒</LockOverlay>
                )}
              </NodeCircle>

              <NodeInfo $compact={compact}>
                <NodeTitle $compact={compact}>{node.title}</NodeTitle>
                <NodeDescription $compact={compact}>{node.description}</NodeDescription>
                <NodeStatus $status={node.status}>
                  {node.status === 'completed' && '已完成'}
                  {node.status === 'in_progress' && '进行中'}
                  {node.status === 'available' && '可开始'}
                  {node.status === 'locked' && '未解锁'}
                </NodeStatus>
              </NodeInfo>
            </LearningNodeContainer>
          );
        })}
      </PathContent>
    </PathContainer>
  );
};