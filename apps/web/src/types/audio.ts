export interface AudioInfo {
  sectionName: string;
  storyId: number | null;
  storyTitle: string;
  audioSources: string[];
  partDurations: number[];
}

export interface AudioState extends AudioInfo {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  currentPartIndex: number;
}
