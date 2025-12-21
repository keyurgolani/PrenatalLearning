import React, { useState, useCallback, useEffect, useRef } from 'react';
import { guestStorageService, type GuestDataSummary } from '../../services/guestStorageService';
import { profileService } from '../../services/profileService';

/**
 * Props for the DataMigrationModal component
 */
interface DataMigrationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** @deprecated No longer needed - data migrates to user account directly */
  profileId?: string;
  /** Callback when migration is complete */
  onMigrationComplete?: () => void;
  /** Callback when user skips migration */
  onSkip?: () => void;
}

/**
 * DataMigrationModal component for migrating guest localStorage data to server
 * 
 * Requirements:
 * - 6.6: Detect localStorage data on registration
 * - 6.6: Offer to migrate to new account
 * - 6.6: Transfer progress, preferences to server
 * - 6.6: Clear localStorage after migration
 */
export const DataMigrationModal: React.FC<DataMigrationModalProps> = ({
  isOpen,
  onClose,
  onMigrationComplete,
  onSkip,
}) => {
  const [dataSummary, setDataSummary] = useState<GuestDataSummary | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
    details?: Record<string, number>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Load guest data summary when modal opens
  useEffect(() => {
    if (isOpen) {
      const summary = guestStorageService.getGuestDataSummary();
      setDataSummary(summary);
      setMigrationResult(null);
      setError(null);
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isMigrating) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isMigrating, onClose]);

  /**
   * Handle migration of guest data to server
   */
  const handleMigrate = useCallback(async () => {
    setIsMigrating(true);
    setError(null);

    try {
      const result = await profileService.migrateLocalData();
      
      // Clear localStorage after successful migration
      guestStorageService.clearAllGuestData();
      
      setMigrationResult({
        success: true,
        message: result.message,
        details: result.migratedItems,
      });

      // Notify parent of completion
      if (onMigrationComplete) {
        onMigrationComplete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Migration failed. Please try again.';
      setError(errorMessage);
      setMigrationResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsMigrating(false);
    }
  }, [onMigrationComplete]);

  /**
   * Handle skipping migration
   */
  const handleSkip = useCallback(() => {
    if (onSkip) {
      onSkip();
    }
    onClose();
  }, [onSkip, onClose]);

  /**
   * Handle backdrop click to close modal (only if not migrating)
   */
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isMigrating) {
      onClose();
    }
  }, [isMigrating, onClose]);

  if (!isOpen) return null;

  const hasData = dataSummary && (
    dataSummary.hasProgress ||
    dataSummary.hasPreferences ||
    dataSummary.hasStreakData ||
    dataSummary.hasKickData ||
    dataSummary.hasJournalData
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="migration-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-pop-in"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-6 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h2 id="migration-modal-title" className="text-xl font-bold mb-1">
              Transfer Your Progress
            </h2>
            <p className="text-emerald-100 text-sm">
              We found data from your guest session
            </p>
          </div>

          {/* Close Button (only show if not migrating) */}
          {!isMigrating && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Close migration modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div 
                className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
                role="alert"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Migration Success */}
            {migrationResult?.success && (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Migration Complete!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Your progress has been transferred to your account.
                </p>
                {migrationResult.details && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    <p>Migrated: {migrationResult.details.progress || 0} stories, {migrationResult.details.preferences || 0} preferences</p>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Data Summary (before migration) */}
            {!migrationResult?.success && hasData && dataSummary && (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Would you like to transfer your guest data to your new account? This includes:
                </p>

                {/* Data Items */}
                <div className="space-y-2 mb-6">
                  {dataSummary.hasProgress && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Learning Progress</p>
                        <p className="text-sm text-gray-500">{dataSummary.completedStoriesCount} completed stories</p>
                      </div>
                    </div>
                  )}

                  {dataSummary.hasStreakData && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Learning Streak</p>
                        <p className="text-sm text-gray-500">{dataSummary.currentStreak} day streak</p>
                      </div>
                    </div>
                  )}

                  {dataSummary.hasPreferences && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Preferences</p>
                        <p className="text-sm text-gray-500">Theme, font size, and more</p>
                      </div>
                    </div>
                  )}

                  {dataSummary.hasKickData && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Kick Counter</p>
                        <p className="text-sm text-gray-500">{dataSummary.totalKicks} kicks recorded</p>
                      </div>
                    </div>
                  )}

                  {dataSummary.hasJournalData && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Journal Entries</p>
                        <p className="text-sm text-gray-500">{dataSummary.journalEntriesCount} entries</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleMigrate}
                    disabled={isMigrating}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isMigrating ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Transferring...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Transfer My Data</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSkip}
                    disabled={isMigrating}
                    className="w-full py-3 px-4 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Skip for now
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Your guest data will be cleared after transfer
                </p>
              </>
            )}

            {/* No Data to Migrate */}
            {!migrationResult?.success && !hasData && (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  No guest data found to migrate.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMigrationModal;
