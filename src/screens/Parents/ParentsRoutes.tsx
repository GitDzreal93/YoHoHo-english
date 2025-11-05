import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ParentsScreen } from './ParentsScreen';

export const ParentsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ParentsScreen />} />
    </Routes>
  );
};