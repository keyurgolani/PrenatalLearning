// Database connection
export {
  connectToDatabase,
  getDatabase,
  getClient,
  isConnected,
  closeConnection,
  healthCheck,
} from './connection.js';

// GridFS for voice notes
export {
  getVoiceNotesBucket,
  uploadVoiceNote,
  downloadVoiceNote,
  deleteVoiceNote,
  voiceNoteExists,
  resetVoiceNotesBucket,
  VOICE_NOTE_CONSTRAINTS,
} from './gridfs.js';

// Database initialization
export {
  initializeDatabase,
  dropAllCollections,
  COLLECTIONS,
} from './init.js';
