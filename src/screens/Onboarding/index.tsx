import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WelcomeScreen } from './WelcomeScreen';
import { AgeSelectionScreen } from './AgeSelectionScreen';

export const OnboardingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/age" element={<AgeSelectionScreen />} />
    </Routes>
  );
};