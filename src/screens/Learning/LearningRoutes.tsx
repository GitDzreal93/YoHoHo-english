import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CategoryScreen } from './CategoryScreen';
import { FlashcardScreen } from './FlashcardScreen';

export const LearningRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoryScreen />} />
      <Route path="/categories" element={<CategoryScreen />} />
      <Route path="/category/:categoryId" element={<FlashcardScreen />} />
    </Routes>
  );
};