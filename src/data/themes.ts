import type { Theme } from '../types/theme';

/**
 * Curated theme definitions for the Learning Hub
 * Requirements: 1.1, 1.2 - Soft, calming colors suitable for extended reading
 * Each theme maintains WCAG AA contrast ratios for accessibility
 */
export const themes: Theme[] = [
  {
    id: 'blossom',
    name: 'Cherry Blossom',
    description: 'Soft pinks and warm whites for a gentle, nurturing feel',
    colors: {
      primary: '#E91E63',
      secondary: '#F8BBD9',
      background: 'from-pink-50 via-rose-50 to-white',
      headerGradient: 'linear-gradient(to right, #E91E63, #F06292, #EC407A)',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
      border: '#FDE7EF',
      success: '#10B981',
      categoryColors: {
        all: '#9CA3AF',
        science: '#6366F1',
        technology: '#06B6D4',
        biology: '#10B981',
        math: '#F59E0B',
        psychology: '#A855F7',
        language: '#F43F5E',
        finance: '#22C55E',
        society: '#F97316',
      },
    },
    preview: 'linear-gradient(135deg, #FDE7EF 0%, #FCE4EC 50%, #F8BBD9 100%)',
  },
  {
    id: 'ocean',
    name: 'Ocean Calm',
    description: 'Soothing blues and teals for a peaceful, serene experience',
    colors: {
      primary: '#0891B2',
      secondary: '#A5F3FC',
      background: 'from-cyan-50 via-sky-50 to-white',
      headerGradient: 'linear-gradient(to right, #0891B2, #06B6D4, #22D3EE)',
      surface: '#FFFFFF',
      text: '#1E3A5F',
      textMuted: '#64748B',
      border: '#E0F7FA',
      success: '#059669',
      categoryColors: {
        all: '#94A3B8',
        science: '#4F46E5',
        technology: '#0EA5E9',
        biology: '#14B8A6',
        math: '#EAB308',
        psychology: '#8B5CF6',
        language: '#EC4899',
        finance: '#16A34A',
        society: '#EA580C',
      },
    },
    preview: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)',
  },
  {
    id: 'meadow',
    name: 'Spring Meadow',
    description: 'Fresh greens and soft yellows for an uplifting, natural vibe',
    colors: {
      primary: '#16A34A',
      secondary: '#BBF7D0',
      background: 'from-green-50 via-lime-50 to-white',
      headerGradient: 'linear-gradient(to right, #16A34A, #22C55E, #4ADE80)',
      surface: '#FFFFFF',
      text: '#1A3D1F',
      textMuted: '#4B5563',
      border: '#DCFCE7',
      success: '#059669',
      categoryColors: {
        all: '#9CA3AF',
        science: '#4338CA',
        technology: '#0891B2',
        biology: '#15803D',
        math: '#CA8A04',
        psychology: '#9333EA',
        language: '#E11D48',
        finance: '#16A34A',
        society: '#EA580C',
      },
    },
    preview: 'linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 50%, #C5E1A5 100%)',
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Calming purples and soft lilacs for relaxation',
    colors: {
      primary: '#9333EA',
      secondary: '#E9D5FF',
      background: 'from-purple-50 via-violet-50 to-white',
      headerGradient: 'linear-gradient(to right, #9333EA, #A855F7, #C084FC)',
      surface: '#FFFFFF',
      text: '#2E1065',
      textMuted: '#6B7280',
      border: '#F3E8FF',
      success: '#10B981',
      categoryColors: {
        all: '#9CA3AF',
        science: '#4F46E5',
        technology: '#0EA5E9',
        biology: '#10B981',
        math: '#F59E0B',
        psychology: '#A855F7',
        language: '#F43F5E',
        finance: '#22C55E',
        society: '#F97316',
      },
    },
    preview: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)',
  },
];

/**
 * Get theme by ID
 */
export function getThemeById(themeId: string): Theme | undefined {
  return themes.find((theme) => theme.id === themeId);
}

/**
 * Get the default theme
 */
export function getDefaultTheme(): Theme {
  return themes[0]; // Cherry Blossom is the default
}

export default themes;
