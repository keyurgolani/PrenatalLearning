import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { getDatabase } from './connection.js';

// GridFS bucket name for voice notes
const VOICE_NOTES_BUCKET_NAME = 'voiceNotes';

// Voice note constraints
export const VOICE_NOTE_CONSTRAINTS = {
  maxDurationSeconds: 300, // 5 minutes
  maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg'],
};

let voiceNotesBucket: GridFSBucket | null = null;

/**
 * Get or create the GridFS bucket for voice notes
 */
export function getVoiceNotesBucket(): GridFSBucket {
  if (!voiceNotesBucket) {
    const db = getDatabase();
    voiceNotesBucket = new GridFSBucket(db, {
      bucketName: VOICE_NOTES_BUCKET_NAME,
      chunkSizeBytes: 255 * 1024, // 255KB chunks
    });
  }
  return voiceNotesBucket;
}


/**
 * Upload a voice note to GridFS
 */
export async function uploadVoiceNote(
  audioBuffer: Buffer,
  metadata: {
    profileId: string;
    journalEntryId?: string;
    mimeType: string;
    duration: number;
  }
): Promise<ObjectId> {
  // Validate constraints
  if (metadata.duration > VOICE_NOTE_CONSTRAINTS.maxDurationSeconds) {
    throw new Error(
      `Voice note duration exceeds maximum of ${VOICE_NOTE_CONSTRAINTS.maxDurationSeconds} seconds`
    );
  }

  if (audioBuffer.length > VOICE_NOTE_CONSTRAINTS.maxFileSizeBytes) {
    throw new Error(
      `Voice note size exceeds maximum of ${VOICE_NOTE_CONSTRAINTS.maxFileSizeBytes} bytes`
    );
  }

  if (!VOICE_NOTE_CONSTRAINTS.allowedMimeTypes.includes(metadata.mimeType)) {
    throw new Error(
      `Invalid mime type. Allowed types: ${VOICE_NOTE_CONSTRAINTS.allowedMimeTypes.join(', ')}`
    );
  }

  const bucket = getVoiceNotesBucket();
  const filename = `voice-note-${Date.now()}.${getExtensionFromMimeType(metadata.mimeType)}`;

  return new Promise((resolve, reject) => {
    const readableStream = Readable.from(audioBuffer);
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        profileId: metadata.profileId,
        journalEntryId: metadata.journalEntryId,
        mimeType: metadata.mimeType,
        duration: metadata.duration,
        uploadedAt: new Date(),
      },
    });

    readableStream
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id));
  });
}


/**
 * Download a voice note from GridFS
 */
export async function downloadVoiceNote(fileId: ObjectId): Promise<{
  stream: NodeJS.ReadableStream;
  metadata: {
    filename: string;
    mimeType: string;
    length: number;
    uploadDate: Date;
  };
}> {
  const bucket = getVoiceNotesBucket();
  const db = getDatabase();
  
  // Get file metadata
  const filesCollection = db.collection(`${VOICE_NOTES_BUCKET_NAME}.files`);
  const fileDoc = await filesCollection.findOne({ _id: fileId });
  
  if (!fileDoc) {
    throw new Error('Voice note not found');
  }

  const downloadStream = bucket.openDownloadStream(fileId);

  return {
    stream: downloadStream,
    metadata: {
      filename: fileDoc.filename,
      mimeType: fileDoc.metadata?.mimeType || 'audio/webm',
      length: fileDoc.length,
      uploadDate: fileDoc.uploadDate,
    },
  };
}

/**
 * Delete a voice note from GridFS
 */
export async function deleteVoiceNote(fileId: ObjectId): Promise<void> {
  const bucket = getVoiceNotesBucket();
  await bucket.delete(fileId);
}

/**
 * Check if a voice note exists
 */
export async function voiceNoteExists(fileId: ObjectId): Promise<boolean> {
  const db = getDatabase();
  const filesCollection = db.collection(`${VOICE_NOTES_BUCKET_NAME}.files`);
  const count = await filesCollection.countDocuments({ _id: fileId });
  return count > 0;
}

/**
 * Get file extension from mime type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
  };
  return mimeToExt[mimeType] || 'bin';
}

/**
 * Reset the bucket instance (useful for testing)
 */
export function resetVoiceNotesBucket(): void {
  voiceNotesBucket = null;
}
