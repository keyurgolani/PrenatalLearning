import type { Category, CategoryId } from '../types';

/**
 * Category definitions with distinct colors for visual differentiation
 * Requirements: 5.1 - At least 8 distinct categories
 * Requirements: 4.3 - Distinct, harmonious colors for each category
 */
export const categories: Category[] = [
  {
    id: 'all',
    name: 'All Categories',
    color: 'bg-gray-500',
  },
  {
    id: 'science',
    name: 'Science & Universe',
    color: 'bg-indigo-500',
  },
  {
    id: 'technology',
    name: 'Technology & AI',
    color: 'bg-cyan-500',
  },
  {
    id: 'biology',
    name: 'Biology & Life',
    color: 'bg-emerald-500',
  },
  {
    id: 'math',
    name: 'Mathematics',
    color: 'bg-amber-500',
  },
  {
    id: 'psychology',
    name: 'Psychology & Mind',
    color: 'bg-purple-500',
  },
  {
    id: 'language',
    name: 'Language & Communication',
    color: 'bg-rose-500',
  },
  {
    id: 'finance',
    name: 'Finance & Economics',
    color: 'bg-green-500',
  },
  {
    id: 'society',
    name: 'Society & Culture',
    color: 'bg-orange-500',
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find((cat) => cat.id === id);
}

/**
 * Get all categories excluding 'all'
 */
export function getFilterableCategories(): Category[] {
  return categories.filter((cat) => cat.id !== 'all');
}

export default categories;
