# Marquis de Mayfair - Archetype Image Generator

Generate luxury erotic illustrations for all 16 archetypes using the xAI Grok API.

## Images Generated

The script creates social media-ready images (1024x1024) for:

| Archetype | File | Description |
|-----------|------|-------------|
| The Sovereign | `the_sovereign.png` | Keeper of Sacred Authority |
| The Devotee | `the_devotee.png` | Keeper of Sacred Surrender |
| The Artisan | `the_artisan.png` | Master of Sensation |
| The Phoenix | `the_phoenix.png` | Transformed Through Fire |
| The Weaver | `the_weaver.png` | Architect of Beautiful Restraint |
| The Chrysalis | `the_chrysalis.png` | Transformed Through Stillness |
| The Luminary | `the_luminary.png` | Radiant in Witness |
| The Oracle | `the_oracle.png` | Witness to Mysteries |
| The Apex | `the_apex.png` | Pure Instinct Unleashed |
| The Wild Heart | `the_wild_heart.png` | Joy in the Chase |
| The Guardian | `the_guardian.png` | Keeper of Souls |
| The Beloved | `the_beloved.png` | Treasured and Complete |
| The Protector | `the_protector.png` | Tender Authority |
| The Innocent | `the_innocent.png` | Eternal Youth of Spirit |
| The Shapeshifter | `the_shapeshifter.png` | Infinite Expressions |
| The Acolyte | `the_acolyte.png` | Sacred Service |

## Setup

### 1. Get xAI API Key

1. Visit [https://x.ai/api/](https://x.ai/api/)
2. Sign up for an account
3. Generate an API key

### 2. Install Dependencies

```bash
cd archetype-images
pip install -r requirements.txt
```

### 3. Set Environment Variable

```bash
export XAI_API_KEY="your_api_key_here"
```

Or on Windows:
```cmd
set XAI_API_KEY=your_api_key_here
```

## Usage

### Generate All Images

```bash
python generate_archetype_images.py
```

The script will:
- Skip any images that already exist
- Wait between API calls to respect rate limits
- Retry on temporary failures
- Display progress for each archetype

### Regenerate Specific Image

To regenerate a specific image, delete it first:

```bash
rm the_sovereign.png
python generate_archetype_images.py
```

## Image Style

Each image features:
- **Art Style**: Art nouveau meets art deco luxury illustration
- **Colors**: Gold gradient metallic line art (#C9A227, #F6C541)
- **Background**: Dark burgundy (#8B1538) and black
- **Composition**: Vertical playing card format with ornate borders
- **Elements**: Diamond crest placeholder at top, archetype name at bottom

## API Costs

Check current pricing at [https://x.ai/api/](https://x.ai/api/)

The script generates 16 images at 1024x1024 resolution.

## Social Media Sizes

The 1024x1024 images work well for:
- **Instagram**: Posts and Stories (1:1 ratio)
- **Twitter/X**: Timeline images
- **Facebook**: Posts
- **Pinterest**: Pins

For other platforms, you may want to resize:
- Instagram Stories: 1080x1920
- Twitter Header: 1500x500
- Facebook Cover: 1640x924

## Troubleshooting

### "API Key not set"
Ensure you've set the `XAI_API_KEY` environment variable.

### Rate Limiting
The script automatically waits and retries when rate limited.

### Timeout Errors
Network issues may cause timeouts. The script will retry automatically.

### Content Policy Issues
Some prompts may be rejected due to content policies. The script uses tasteful, non-explicit prompts designed to comply with API guidelines.

## License

These images are generated for Marquis de Mayfair brand use only.

