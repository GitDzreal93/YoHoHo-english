# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cartoon English flashcard project that organizes and categorizes cartoon images for English learning purposes. The project contains a large collection of cartoon-style images that are automatically categorized into different themes.

## Key Files and Structure

- `categories.json` - Main data file containing categorized image information with English/Chinese names
- `generate_categories.py` - Script that categorizes images based on filename keywords using pattern matching
- `json_to_xlsx.py` - Utility script that converts the categorized JSON data to Excel format
- `cartoon_english_flashcards.xlsx` - Excel output containing all categorized flashcard data
- `resource/all/` - Directory containing all source cartoon images
- `resource/categorized/` - Directory structure with 22 themed subdirectories containing organized images

## Image Categories

The project automatically sorts images into 22 categories:
- animals (largest category with 700+ images)
- art_and_craft, buildings_and_places, clothing_and_accessories
- events_and_celebrations, fantasy_and_mythology, food_and_drink
- games_and_toys, household_items, music_and_instruments
- nature, office_and_school, others (miscellaneous)
- professions, science_and_education, sports_and_fitness
- technology, tools_and_equipment, transportation, weather_and_climate

## Common Development Tasks

### Running the categorization script:
```bash
python3 generate_categories.py
```

### Converting JSON to Excel:
```bash
python3 json_to_xlsx.py
```

### Working with the data:
- The categorization uses keyword matching based on English words in filenames
- Each category has defined keywords in `generate_categories.py`
- Images are copied from `resource/all/` to appropriate category folders in `resource/categorized/`

## Data Format

The `categories.json` follows this structure:
```json
{
  "categories": [
    {
      "id": "category_name",
      "name": {"en": "English Name", "zh": "中文名"},
      "images": ["filename1.png", "filename2.png", ...]
    }
  ]
}
```

## Code Quality Standards

### 1. Code Reusability
- **Don't Repeat Yourself (DRY)**: Reuse existing code whenever possible
- **Component-based architecture**: Create reusable components for common functionality
- **Utility functions**: Extract common logic into utility functions
- **Custom hooks**: Create reusable hooks for stateful logic
- **Before writing new code**: Check if similar functionality already exists

### 2. Code Cleanliness
- **Test code**: Remove test code and temporary debugging code before committing
- **Console.log**: Remove console.log statements in production code
- **Dead code**: Regularly remove unused imports, variables, and functions
- **Commented code**: Delete commented-out code instead of leaving it in the codebase
- **Keep it clean**: Maintain a clean, professional codebase at all times

### 3. Component Library Usage
- **Prefer component libraries**: Use established component libraries (Ant Design Mobile, etc.) over custom styling
- **Custom styling exceptions**: Only create custom styles for:
  - Animation effects and transitions
  - Game-specific interactions
  - Three.js/WebGL visualizations
- **Consistent styling**: Maintain design system consistency across the application
- **Component composition**: Build complex components by composing simpler ones

### 4. Development Guidelines
- **TypeScript优先**: All new code should be written in TypeScript
- **Responsive design**: Ensure all components work across different screen sizes
- **Performance awareness**: Consider performance implications when writing code
- **Accessibility**: Follow WCAG guidelines for accessibility
- **Documentation**: Document complex logic and component usage

## Project Architecture

### Frontend Application (New)
- **Framework**: React 18 + TypeScript
- **Mobile**: Capacitor for iOS/Android deployment
- **UI Library**: Ant Design Mobile + custom components
- **Animation**: Framer Motion + Three.js for complex animations
- **State Management**: Zustand for lightweight state management
- **Styling**: Styled-components + CSS-in-JS
- **Build Tool**: Vite for fast development and building

### Data Structure
- **Categories**: 22 predefined categories with bilingual support
- **Images**: PNG format with consistent naming conventions
- **Audio**: English and Chinese pronunciation files
- **Local Storage**: User progress, settings, and offline data
- **No Backend**: Pure frontend architecture with local storage

## Notes

- This project has evolved from a Python-based data organization tool to a full-featured mobile application
- The main workflow now involves React development, mobile deployment, and user experience design
- Images are optimized for mobile viewing and lazy loading
- Categories support both English and Chinese names for bilingual learning applications
- The application is designed to work offline-first with optional cloud sync capabilities