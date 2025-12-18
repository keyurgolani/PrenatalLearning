# Audio Stories Directory

This directory contains audio narration files for the Prenatal Learning Hub stories.

## Directory Structure

```
public/audio/stories/
├── 1/                    # Story 1 audio files
│   ├── manifest.txt      # Audio manifest file
│   ├── intro-p1.mp3      # Introduction paragraph 1
│   ├── intro-p2.mp3      # Introduction paragraph 2
│   └── ...
├── 2/                    # Story 2 audio files
│   └── ...
└── 32/                   # Story 32 audio files
    └── ...
```

## Supported Formats

- MP3 (.mp3)
- WAV (.wav)

## Manifest File Format

Each story directory should contain a `manifest.txt` file that maps audio files to story paragraphs.

**Format:** `sectionName|paragraphIndex|filename|transcriptText`

**Example:**

```
# Audio Manifest for Story 1
# Format: sectionName|paragraphIndex|filename|transcriptText
introduction|0|intro-p1.mp3|Hello, little one. Today we're going on the most amazing journey...
introduction|1|intro-p2.mp3|Take a deep breath, dear mother...
coreContent|0|core-p1.mp3|About 13.8 billion years ago...
```

## Section Names

- `introduction` - Opening narrative
- `coreContent` - Main educational content
- `interactiveSection` - Interactive learning elements
- `integration` - Closing and integration content

## Adding Audio Files

1. Create audio files for each paragraph in the story
2. Name files descriptively (e.g., `intro-p1.mp3`, `core-p3.mp3`)
3. Add entries to `manifest.txt` mapping files to paragraphs
4. Include the full transcript text for verification
