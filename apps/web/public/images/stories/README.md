# Image Stories Directory

This directory contains visual content files for the Prenatal Learning Hub stories.

## Directory Structure

```
public/images/stories/
├── 1/                    # Story 1 image files
│   ├── manifest.txt      # Image manifest file
│   ├── cosmic-seed.png   # Example image
│   └── ...
├── 2/                    # Story 2 image files
│   └── ...
└── 32/                   # Story 32 image files
    └── ...
```

## Supported Formats

- PNG (.png)
- JPG (.jpg)
- JPEG (.jpeg)
- WebP (.webp)

## Manifest File Format

Each story directory should contain a `manifest.txt` file that maps image files to story sections.

**Format:** `sectionName|position|filename|altText|caption`

**Example:**

```
# Image Manifest for Story 1
# Format: sectionName|position|filename|altText|caption
introduction|before|cosmic-seed.png|A tiny glowing seed representing the universe before the Big Bang|The universe began smaller than a grain of sand
coreContent|after|star-forge.png|Stars forging elements in their cores|Stars are cosmic forges
```

## Section Names

- `introduction` - Opening narrative
- `coreContent` - Main educational content
- `interactiveSection` - Interactive learning elements
- `integration` - Closing and integration content

## Position Values

- `before` - Display image before the section content
- `after` - Display image after the section content
- `inline` - Display image inline within the content

## Adding Image Files

1. Create or source images for each story section
2. Name files descriptively (e.g., `cosmic-seed.png`, `star-forge.png`)
3. Add entries to `manifest.txt` mapping files to sections
4. Include meaningful alt text for accessibility
5. Optionally add captions for additional context
