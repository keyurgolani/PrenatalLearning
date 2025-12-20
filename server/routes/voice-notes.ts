import { Router, type Request, type Response, type NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { requireAuthWithUser } from '../middleware/index.js';
import { createVoiceNoteSchema } from '../validators/voiceNote.js';
import {
  getVoiceNotesCollection,
  VOICE_NOTE_MAX_DURATION_SECONDS,
  type VoiceNoteDocument,
} from '../models/VoiceNote.js';
import { getJournalEntriesCollection } from '../models/JournalEntry.js';
import {
  uploadVoiceNote as uploadToGridFS,
  downloadVoiceNote,
  deleteVoiceNote as deleteFromGridFS,
  VOICE_NOTE_CONSTRAINTS,
} from '../db/gridfs.js';

const router = Router();

// All voice note routes require authentication
router.use(requireAuthWithUser);

/**
 * POST /api/voice-notes
 * Upload a voice note to GridFS and store metadata
 * 
 * Request body:
 * - journalEntryId: string - ID of the journal entry to link to
 * - duration: number - Duration in seconds (max 300 = 5 minutes)
 * - mimeType: string - Audio MIME type (audio/webm, audio/mp4, audio/mpeg, audio/ogg)
 * - audioData: string - Base64 encoded audio data
 * 
 * Requirements: 12.4, 12.7, 12.8
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Extract and validate metadata fields
    const { journalEntryId, duration, mimeType, audioData } = req.body;

    // Check for required audioData field
    if (!audioData || typeof audioData !== 'string') {
      return res.status(400).json({
        error: 'Validation failed',
        details: [{ field: 'audioData', message: 'Audio data is required and must be a base64 string' }],
      });
    }

    // Decode base64 audio data
    let audioBuffer: Buffer;
    try {
      audioBuffer = Buffer.from(audioData, 'base64');
    } catch {
      return res.status(400).json({
        error: 'Validation failed',
        details: [{ field: 'audioData', message: 'Invalid base64 encoded audio data' }],
      });
    }

    // Validate metadata using Zod schema
    const validationResult = createVoiceNoteSchema.safeParse({
      journalEntryId,
      duration,
      mimeType,
      size: audioBuffer.length,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const validatedData = validationResult.data;

    // Validate duration limit (5 minutes max) - Requirements: 12.7
    if (validatedData.duration > VOICE_NOTE_MAX_DURATION_SECONDS) {
      return res.status(400).json({
        error: 'Validation failed',
        details: [{
          field: 'duration',
          message: `Voice note duration exceeds maximum of ${VOICE_NOTE_MAX_DURATION_SECONDS} seconds (5 minutes)`,
        }],
      });
    }

    // Validate file size
    if (audioBuffer.length > VOICE_NOTE_CONSTRAINTS.maxFileSizeBytes) {
      return res.status(400).json({
        error: 'Validation failed',
        details: [{
          field: 'audioData',
          message: `Voice note size exceeds maximum of ${VOICE_NOTE_CONSTRAINTS.maxFileSizeBytes / (1024 * 1024)}MB`,
        }],
      });
    }

    // Validate ObjectId format for journalEntryId
    if (!ObjectId.isValid(validatedData.journalEntryId)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: [{ field: 'journalEntryId', message: 'Invalid journal entry ID format' }],
      });
    }

    const journalEntryObjectId = new ObjectId(validatedData.journalEntryId);

    // Verify journal entry exists and belongs to user
    const journalCollection = getJournalEntriesCollection();
    const journalEntry = await journalCollection.findOne({
      _id: journalEntryObjectId,
      userId: user._id,
    });

    if (!journalEntry) {
      return res.status(404).json({
        error: 'Journal entry not found or does not belong to your account',
      });
    }

    // Upload audio to GridFS - Requirements: 12.4, 12.8
    const fileId = await uploadToGridFS(audioBuffer, {
      profileId: user._id.toString(),
      journalEntryId: validatedData.journalEntryId,
      mimeType: validatedData.mimeType,
      duration: validatedData.duration,
    });

    // Store metadata in VoiceNote collection
    const voiceNotesCollection = getVoiceNotesCollection();
    const now = new Date();

    const voiceNoteDoc: VoiceNoteDocument = {
      userId: user._id,
      journalEntryId: journalEntryObjectId,
      duration: validatedData.duration,
      fileId,
      mimeType: validatedData.mimeType,
      size: audioBuffer.length,
      createdAt: now,
    };

    const result = await voiceNotesCollection.insertOne(voiceNoteDoc as any);
    const voiceNoteId = result.insertedId;

    // Link voice note to journal entry by adding to voiceNoteIds array
    await journalCollection.updateOne(
      { _id: journalEntryObjectId },
      { 
        $push: { voiceNoteIds: voiceNoteId },
        $set: { updatedAt: now },
      }
    );

    console.log(`Voice note created: ${voiceNoteId} for journal entry: ${validatedData.journalEntryId}`);

    return res.status(201).json({
      message: 'Voice note uploaded successfully',
      voiceNote: {
        id: voiceNoteId.toString(),
        journalEntryId: validatedData.journalEntryId,
        duration: validatedData.duration,
        mimeType: validatedData.mimeType,
        size: audioBuffer.length,
        createdAt: now.toISOString(),
      },
    });
  } catch (error) {
    // Handle GridFS upload errors
    if (error instanceof Error && error.message.includes('Voice note')) {
      return res.status(400).json({
        error: 'Upload failed',
        details: [{ field: 'audioData', message: error.message }],
      });
    }
    next(error);
  }
});

/**
 * GET /api/voice-notes/:id
 * Stream audio from GridFS
 * 
 * Requirements: 12.5
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid voice note ID format',
      });
    }

    const voiceNoteId = new ObjectId(id);

    // Find voice note metadata
    const voiceNotesCollection = getVoiceNotesCollection();
    const voiceNote = await voiceNotesCollection.findOne({ _id: voiceNoteId });

    if (!voiceNote) {
      return res.status(404).json({
        error: 'Voice note not found',
      });
    }

    // Verify the voice note belongs to user
    if (!voiceNote.userId.equals(user._id)) {
      return res.status(403).json({
        error: 'Access denied. Voice note does not belong to your account.',
      });
    }

    // Download from GridFS and stream to response
    const { stream, metadata } = await downloadVoiceNote(voiceNote.fileId);

    // Set appropriate headers for audio streaming
    res.setHeader('Content-Type', metadata.mimeType);
    res.setHeader('Content-Length', metadata.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'private, max-age=3600');

    // Pipe the stream to response
    stream.pipe(res);

    // Handle stream errors
    stream.on('error', (error) => {
      console.error('Error streaming voice note:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming voice note' });
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Voice note not found') {
      return res.status(404).json({ error: 'Voice note file not found in storage' });
    }
    next(error);
  }
});

/**
 * DELETE /api/voice-notes/:id
 * Delete voice note from GridFS and metadata
 * 
 * Requirements: 12.6
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid voice note ID format',
      });
    }

    const voiceNoteId = new ObjectId(id);

    // Find voice note metadata
    const voiceNotesCollection = getVoiceNotesCollection();
    const voiceNote = await voiceNotesCollection.findOne({ _id: voiceNoteId });

    if (!voiceNote) {
      return res.status(404).json({
        error: 'Voice note not found',
      });
    }

    // Verify the voice note belongs to user
    if (!voiceNote.userId.equals(user._id)) {
      return res.status(403).json({
        error: 'Access denied. Voice note does not belong to your account.',
      });
    }

    // Delete from GridFS
    try {
      await deleteFromGridFS(voiceNote.fileId);
    } catch (gridfsError) {
      console.error('Error deleting voice note from GridFS:', gridfsError);
      // Continue with metadata deletion even if GridFS deletion fails
      // The file might have already been deleted
    }

    // Delete metadata from VoiceNote collection
    await voiceNotesCollection.deleteOne({ _id: voiceNoteId });

    // Remove voice note reference from journal entry
    const journalCollection = getJournalEntriesCollection();
    await journalCollection.updateOne(
      { _id: voiceNote.journalEntryId },
      {
        $pull: { voiceNoteIds: voiceNoteId },
        $set: { updatedAt: new Date() },
      }
    );

    console.log(`Voice note deleted: ${id}`);

    return res.status(200).json({
      message: 'Voice note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
