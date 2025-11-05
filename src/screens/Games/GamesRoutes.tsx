import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameSelectionScreen } from './GameSelectionScreen';
import { SoundTreasureHunt } from '@games/SoundTreasureHunt';
import { MagicPuzzle } from '@games/MagicPuzzle';
import { RainbowBubbles } from '@games/RainbowBubbles';
import { AnimalMusicBox } from '@games/AnimalMusicBox';
import { MemoryFlip } from '@games/MemoryFlip';
import { WordArtist } from '@games/WordArtist';

export const GamesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<GameSelectionScreen />} />
      <Route path="/sound-treasure-hunt" element={<SoundTreasureHunt />} />
      <Route path="/magic-puzzle" element={<MagicPuzzle />} />
      <Route path="/rainbow-bubbles" element={<RainbowBubbles />} />
      <Route path="/animal-music-box" element={<AnimalMusicBox />} />
      <Route path="/memory-flip" element={<MemoryFlip />} />
      <Route path="/word-artist" element={<WordArtist />} />
    </Routes>
  );
};