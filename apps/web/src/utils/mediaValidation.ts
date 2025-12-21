/**
 * Media format validation utilities
 *
 * Requirements:
 * - 1.2: THE System SHALL support audio files in MP3 and WAV formats
 * - 4.2: THE System SHALL support image files in PNG, JPG, JPEG, and WebP formats
 */

/**
 * Supported audio file extensions (case-insensitive)
 */
export const SUPPORTED_AUDIO_FORMATS = ['.mp3', '.wav'] as const;

/**
 * Supported image file extensions (case-insensitive)
 */
export const SUPPORTED_IMAGE_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'] as const;

/**
 * Extracts the file extension from a filename (including the dot)
 * Returns lowercase extension or empty string if no extension found
 */
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.slice(lastDotIndex).toLowerCase();
}

/**
 * Validates if a filename has a supported audio format
 *
 * @param filename - The filename to validate
 * @returns true if the file extension is .mp3 or .wav (case-insensitive)
 *
 * Requirements: 1.2
 */
export function isValidAudioFormat(filename: string): boolean {
  const extension = getFileExtension(filename);
  return SUPPORTED_AUDIO_FORMATS.includes(extension as typeof SUPPORTED_AUDIO_FORMATS[number]);
}

/**
 * Validates if a filename has a supported image format
 *
 * @param filename - The filename to validate
 * @returns true if the file extension is .png, .jpg, .jpeg, or .webp (case-insensitive)
 *
 * Requirements: 4.2
 */
export function isValidImageFormat(filename: string): boolean {
  const extension = getFileExtension(filename);
  return SUPPORTED_IMAGE_FORMATS.includes(extension as typeof SUPPORTED_IMAGE_FORMATS[number]);
}
