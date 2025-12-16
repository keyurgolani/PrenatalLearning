import React from 'react';

/**
 * Footer component with supportive message
 * 
 * Requirements:
 * - 4.1: Display a soft gradient background using calming colors
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-4">
          <span className="text-3xl">💜</span>
        </div>
        <p className="text-purple-800 font-medium mb-2">
          Every moment of learning is a gift of love
        </p>
        <p className="text-purple-600 text-sm max-w-lg mx-auto">
          The bond you're creating through these stories will last a lifetime. 
          Your voice, your love, and your presence are the greatest gifts you can give your baby.
        </p>
        <div className="mt-6 pt-6 border-t border-purple-200">
          <p className="text-purple-500 text-xs">
            Prenatal Learning Hub • Nurturing minds before birth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
