import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { migrateGuestKicks } from './guestDataMigration';
import { storageService } from './storageService';
import { get, post } from './apiClient';

// Mock dependencies
vi.mock('./storageService', () => ({
  storageService: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  }
}));

vi.mock('./apiClient', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

describe('guestDataMigration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('migrateGuestKicks', () => {
    it('should return 0 when there are no guest kicks', async () => {
      (storageService.get as Mock).mockReturnValue(null);
      
      const result = await migrateGuestKicks();
      
      expect(result).toBe(0);
      expect(get).not.toHaveBeenCalled();
      expect(post).not.toHaveBeenCalled();
    });

    it('should migrate valid kicks when no recent journal entries exist', async () => {
      // Mock guest kicks
      const mockKicks = {
        guest: {
          profileId: 'guest-123',
          kicks: [
            { id: 'k1', timestamp: 1700000000000 },
            { id: 'k2', timestamp: 1700000100000 }
          ],
          totalKicks: 2
        }
      };
      (storageService.get as Mock).mockReturnValue(JSON.stringify(mockKicks));

      // Mock no recent journal entries
      (get as Mock).mockResolvedValue({ entries: [] });
      
      // Mock successful post
      (post as Mock).mockResolvedValue({ success: true });

      const result = await migrateGuestKicks();

      expect(result).toBe(2);
      expect(post).toHaveBeenCalledTimes(1);
    });

    it('should not migrate kicks older than the latest journal entry', async () => {
      const latestJournalTime = 1700000200000;
      
      // Mock guest kicks (older than journal)
      const mockKicks = {
        guest: {
          profileId: 'guest-123',
          kicks: [
            { id: 'k1', timestamp: 1700000000000 }, // Older
            { id: 'k2', timestamp: 1700000100000 }  // Older
          ],
          totalKicks: 2
        }
      };
      (storageService.get as Mock).mockReturnValue(JSON.stringify(mockKicks));

      // Mock existing recent journal entry with newer timestamp
      (get as Mock).mockResolvedValue({ 
        entries: [{ 
          id: 'j1', 
          journalDate: '2023-11-15T00:00:00.000Z',
          createdAt: new Date(latestJournalTime).toISOString() 
        }] 
      });

      const result = await migrateGuestKicks();

      expect(result).toBe(0);
      expect(post).not.toHaveBeenCalled();
    });

    it('should only migrate kicks newer than the latest journal entry', async () => {
      const latestJournalTime = 1700000100000;
      
      // Mock guest kicks (mixed)
      const mockKicks = {
        guest: {
          profileId: 'guest-123',
          kicks: [
            { id: 'k1', timestamp: 1700000000000 }, // Older
            { id: 'k2', timestamp: 1700000200000 }  // Newer
          ],
          totalKicks: 2
        }
      };
      (storageService.get as Mock).mockReturnValue(JSON.stringify(mockKicks));

      // Mock existing recent journal entry
      (get as Mock).mockResolvedValue({ 
        entries: [{ 
          id: 'j1', 
          journalDate: '2023-11-14T00:00:00.000Z',
          createdAt: new Date(latestJournalTime).toISOString() 
        }] 
      });

      // Mock successful post
      (post as Mock).mockResolvedValue({ success: true });

      const result = await migrateGuestKicks();

      expect(result).toBe(1);
      expect(post).toHaveBeenCalledTimes(1);
    });
  });
});
