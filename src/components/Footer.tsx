import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Footer component with supportive message
 * 
 * Requirements:
 * - 4.1: Display a soft gradient background using calming colors
 * - 12.4: Support screen reader navigation with semantic HTML structure
 */
export const Footer: React.FC = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  return (
    <footer 
      className="py-6 px-4 lg:px-6 xl:px-8 2xl:px-12 mt-auto transition-theme"
      role="contentinfo"
      aria-label="Site footer"
      style={{ 
        background: isDark 
          ? currentTheme.colors.surface 
          : 'linear-gradient(to right, rgb(243 232 255), rgb(253 242 248), rgb(219 234 254))'
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-4">
          <span className="text-3xl">💜</span>
        </div>
        <p 
          className="font-medium mb-2"
          style={{ color: isDark ? currentTheme.colors.text : '#6b21a8' }}
        >
          Every moment of learning is a gift of love
        </p>
        <p 
          className="text-sm max-w-lg mx-auto"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#9333ea' }}
        >
          The bond you're creating through these stories will last a lifetime. 
          Your voice, your love, and your presence are the greatest gifts you can give your baby.
        </p>
        <div 
          className="mt-6 pt-6"
          style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#e9d5ff'}` }}
        >
          <p 
            className="text-xs"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#a855f7' }}
          >
            Prenatal Learning Hub • Nurturing minds before birth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
