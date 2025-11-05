import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { theme } from '@styles/index';
import { Button, Card, Icon } from '@components/index';
import { useAppStore } from '@stores/index';
import { useHapticFeedback } from '@hooks/index';

const AgeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  color: white;
`;

const AgeCard = styled(Card)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const AgeTitle = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  font-family: ${theme.typography.fontFamily.display};
`;

const AgeSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing.xl};
  opacity: 0.9;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const AgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 600px;
`;

const AgeOption = styled(motion.button)<{ $selected: boolean }>`
  background: ${({ $selected }) => $selected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${({ $selected }) => $selected ? theme.colors.warning[500] : 'rgba(255, 255, 255, 0.3)'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
  }

  ${({ $selected }) => $selected && `
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
  `}
`;

const AgeIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.sm};
`;

const AgeRange = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.xs};
`;

const AgeDescription = styled.div`
  font-size: ${theme.typography.fontSize.base};
  opacity: 0.9;
  text-align: center;
  line-height: ${theme.typography.lineHeight.normal};
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  width: 100%;
  max-width: 400px;
`;

const ageOptions = [
  {
    age: '3-4',
    icon: '👶',
    range: '3-4岁',
    description: '启蒙阶段\n适合刚开始接触英语的小朋友',
    level: 'beginner' as const,
  },
  {
    age: '4-5',
    icon: '🧒',
    range: '4-5岁',
    description: '进阶阶段\n有基础英语认知的小朋友',
    level: 'intermediate' as const,
  },
  {
    age: '5-6',
    icon: '👦',
    range: '5-6岁',
    description: '提高阶段\n准备上小学的大朋友',
    level: 'advanced' as const,
  },
];

export const AgeSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAppStore();
  const { onButtonPress, onSuccess } = useHapticFeedback();

  const [selectedAge, setSelectedAge] = React.useState(ageOptions[1]); // Default to 4-5 years

  const handleBack = () => {
    onButtonPress();
    navigate('/onboarding/welcome');
  };

  const handleContinue = () => {
    onButtonPress();
    onSuccess();

    if (user) {
      // Update user with age and level
      const ageNumber = parseInt(selectedAge.age.split('-')[0]);
      updateUser({
        age: ageNumber,
        level: selectedAge.level,
      });
    }

    // Navigate to home screen
    navigate('/');
  };

  return (
    <AgeContainer>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <AgeIcon style={{ fontSize: '80px', marginBottom: theme.spacing.lg }}>🎂</AgeIcon>
      </motion.div>

      <AgeCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AgeTitle>选择你的年龄段</AgeTitle>
        <AgeSubtitle>
          根据年龄选择适合的学习难度，让学习更有趣更有效！
        </AgeSubtitle>
      </AgeCard>

      <AgeGrid>
        {ageOptions.map((option, index) => (
          <AgeOption
            key={option.age}
            $selected={selectedAge.age === option.age}
            onClick={() => {
              setSelectedAge(option);
              onButtonPress();
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div>{option.icon}</div>
            <AgeRange>{option.range}</AgeRange>
            <AgeDescription>{option.description}</AgeDescription>
          </AgeOption>
        ))}
      </AgeGrid>

      <NavigationButtons>
        <Button
          variant="secondary"
          onClick={handleBack}
          fullWidth
          icon={<Icon name="previous" />}
        >
          上一步
        </Button>

        <Button
          onClick={handleContinue}
          fullWidth
          icon={<Icon name="next" />}
        >
          开始学习
        </Button>
      </NavigationButtons>
    </AgeContainer>
  );
};