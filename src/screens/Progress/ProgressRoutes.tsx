import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProgressScreen } from './ProgressScreen';

export const ProgressRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProgressScreen />} />
    </Routes>
  );
};