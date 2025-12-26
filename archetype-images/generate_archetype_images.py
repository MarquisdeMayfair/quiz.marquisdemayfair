#!/usr/bin/env python3
"""
Marquis de Mayfair - Archetype Image Generator
Generates luxury erotic illustrations for each of the 16 archetypes
using the xAI Grok API for image generation.

Usage:
    export XAI_API_KEY="your_api_key_here"
    python generate_archetype_images.py

Images will be saved to the current directory with appropriate filenames.
"""

import os
import sys
import json
import base64
import requests
from pathlib import Path
import time

# xAI Grok API Configuration
API_URL = "https://api.x.ai/v1/images/generations"
API_KEY = os.environ.get("XAI_API_KEY")

# Image size optimized for social media (Instagram, Twitter, Facebook)
IMAGE_SIZE = "1024x1024"

# The 16 Archetypes with their details for prompt crafting
ARCHETYPES = {
    "the_sovereign": {
        "name": "The Sovereign",
        "title": "Keeper of Sacred Authority",
        "historical": "Catherine the Great",
        "mythological": "Zeus/Hera",
        "essence": "commanding authority, quiet power, regal dominance",
        "visual_elements": "crown, scepter, throne, commanding pose",
        "gender_presentation": "powerful feminine figure"
    },
    "the_devotee": {
        "name": "The Devotee", 
        "title": "Keeper of Sacred Surrender",
        "historical": "Empress Josephine",
        "mythological": "Psyche",
        "essence": "graceful surrender, elegant submission, devoted trust",
        "visual_elements": "kneeling pose, collar, upward gaze, soft vulnerability",
        "gender_presentation": "elegant feminine figure"
    },
    "the_artisan": {
        "name": "The Artisan",
        "title": "Master of Sensation",
        "historical": "Discipline as art form",
        "mythological": "Hephaestus",
        "essence": "skilled precision, artistic control, masterful intensity",
        "visual_elements": "flogger, precise hands, focused expression, tools of craft",
        "gender_presentation": "strong masculine figure"
    },
    "the_phoenix": {
        "name": "The Phoenix",
        "title": "Transformed Through Fire",
        "historical": "Frida Kahlo",
        "mythological": "Phoenix/Prometheus",
        "essence": "transcendence through intensity, rebirth, fiery transformation",
        "visual_elements": "flames, rising pose, marks of passion, ecstatic expression",
        "gender_presentation": "radiant feminine figure"
    },
    "the_weaver": {
        "name": "The Weaver",
        "title": "Architect of Beautiful Restraint",
        "historical": "Renaissance rope arts",
        "mythological": "Arachne",
        "essence": "artistic bondage, creative restraint, meditative binding",
        "visual_elements": "intricate rope patterns, skilled hands, geometric designs",
        "gender_presentation": "focused masculine figure"
    },
    "the_chrysalis": {
        "name": "The Chrysalis",
        "title": "Transformed Through Stillness",
        "historical": "Botticelli's Venus",
        "mythological": "Andromeda",
        "essence": "peaceful surrender in bondage, cocoon-like safety, metamorphosis",
        "visual_elements": "wrapped in rope, serene expression, suspended beauty",
        "gender_presentation": "graceful feminine figure"
    },
    "the_luminary": {
        "name": "The Luminary",
        "title": "Radiant in Witness",
        "historical": "Mata Hari",
        "mythological": "Aphrodite",
        "essence": "magnetic exhibition, confident display, radiant presence",
        "visual_elements": "stage presence, revealing attire, confident pose, spotlight",
        "gender_presentation": "alluring feminine figure"
    },
    "the_oracle": {
        "name": "The Oracle",
        "title": "Witness to Mysteries",
        "historical": "Anaïs Nin",
        "mythological": "Artemis",
        "essence": "mysterious observation, sacred witnessing, perceptive gaze",
        "visual_elements": "veiled figure, observing eyes, shadows, mysterious presence",
        "gender_presentation": "enigmatic feminine figure"
    },
    "the_apex": {
        "name": "The Apex",
        "title": "Pure Instinct Unleashed",
        "historical": "The Wild Hunt",
        "mythological": "Fenrir",
        "essence": "primal power, predatory instinct, raw animalistic energy",
        "visual_elements": "wolf-like features, hunting pose, wild hair, fierce eyes",
        "gender_presentation": "powerful masculine figure"
    },
    "the_wild_heart": {
        "name": "The Wild Heart",
        "title": "Joy in the Chase",
        "historical": "Atalanta",
        "mythological": "Daphne",
        "essence": "thrilling flight, joyful pursuit, wild freedom",
        "visual_elements": "running pose, flowing hair, forest setting, anticipation",
        "gender_presentation": "athletic feminine figure"
    },
    "the_guardian": {
        "name": "The Guardian",
        "title": "Keeper of Souls",
        "historical": "The ideal protector",
        "mythological": "Hades",
        "essence": "protective authority, complete ownership, devoted care",
        "visual_elements": "protective stance, collar in hand, watchful presence",
        "gender_presentation": "strong masculine figure"
    },
    "the_beloved": {
        "name": "The Beloved",
        "title": "Treasured and Complete",
        "historical": "Royal consorts",
        "mythological": "Persephone",
        "essence": "treasured possession, complete belonging, devoted surrender",
        "visual_elements": "collar adorned, kneeling in devotion, cherished expression",
        "gender_presentation": "beautiful feminine figure"
    },
    "the_protector": {
        "name": "The Protector",
        "title": "Tender Authority",
        "historical": "The nurturing guide",
        "mythological": "Demeter",
        "essence": "nurturing dominance, gentle authority, loving guidance",
        "visual_elements": "embracing pose, gentle yet firm, protective arms",
        "gender_presentation": "warm masculine figure"
    },
    "the_innocent": {
        "name": "The Innocent",
        "title": "Eternal Youth of Spirit",
        "historical": "The preserved wonder",
        "mythological": "Hebe",
        "essence": "playful vulnerability, cherished innocence, healing regression",
        "visual_elements": "soft features, playful pose, cherished expression",
        "gender_presentation": "youthful feminine figure"
    },
    "the_shapeshifter": {
        "name": "The Shapeshifter",
        "title": "Infinite Expressions",
        "historical": "David Bowie",
        "mythological": "Loki",
        "essence": "fluid identity, versatile power, dual nature",
        "visual_elements": "mirror reflection, dual aspects, transforming figure",
        "gender_presentation": "androgynous figure"
    },
    "the_acolyte": {
        "name": "The Acolyte",
        "title": "Sacred Service",
        "historical": "Temple attendants",
        "mythological": "Hestia",
        "essence": "devoted service, sacred duty, worshipful devotion",
        "visual_elements": "serving pose, attentive expression, ritual elements",
        "gender_presentation": "graceful figure"
    }
}


def create_prompt(archetype_key, archetype_data):
    """
    Create a detailed prompt for the Grok API to generate a luxury playing card style image.
    """
    prompt = f"""Create a luxury erotic illustration in the style of an ornate playing card for "{archetype_data['name']}" - {archetype_data['title']}.

STYLE REQUIREMENTS:
- Art nouveau meets art deco luxury illustration style
- Gold gradient metallic line art on dark burgundy/black background
- Ornate decorative border with filigree patterns like a luxury playing card
- Include a diamond crest logo placeholder at the top center
- Elegant, sensual but tasteful - high-end boudoir aesthetic
- The figure should embody {archetype_data['essence']}

VISUAL ELEMENTS:
- {archetype_data['gender_presentation']} as the central figure
- Visual motifs: {archetype_data['visual_elements']}
- Historical inspiration: {archetype_data['historical']}
- Mythological essence: {archetype_data['mythological']}

COMPOSITION:
- Vertical playing card composition
- The archetype name "{archetype_data['name']}" elegantly scripted at the bottom
- Gold, champagne, and warm amber color palette for the line art
- Rich burgundy (#8B1538) and deep black background
- Luminous gold highlights (#C9A227, #F6C541)
- Sensual pose that suggests intimacy without explicit content
- The figure should be alluring and empowered, never degrading

Create this as a collectible art piece worthy of a luxury brand, suitable for social media sharing."""

    return prompt


def generate_image(archetype_key, archetype_data, output_dir):
    """
    Generate an image for a single archetype using the Grok API.
    """
    if not API_KEY:
        print("ERROR: XAI_API_KEY environment variable not set!")
        print("Please set your API key: export XAI_API_KEY='your_key_here'")
        sys.exit(1)
    
    prompt = create_prompt(archetype_key, archetype_data)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "grok-2-image",
        "prompt": prompt,
        "n": 1,
        "response_format": "b64_json"
    }
    
    print(f"\n🎨 Generating image for {archetype_data['name']}...")
    print(f"   Essence: {archetype_data['essence']}")
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
        
        if response.status_code == 200:
            result = response.json()
            
            # Handle different response formats
            if "data" in result and len(result["data"]) > 0:
                image_data = result["data"][0]
                
                # Check for b64_json format
                if "b64_json" in image_data:
                    image_bytes = base64.b64decode(image_data["b64_json"])
                elif "url" in image_data:
                    # If URL is returned, download the image
                    img_response = requests.get(image_data["url"])
                    image_bytes = img_response.content
                else:
                    print(f"   ❌ Unexpected response format for {archetype_data['name']}")
                    return False
                
                # Save the image
                filename = f"{archetype_key}.png"
                filepath = output_dir / filename
                
                with open(filepath, "wb") as f:
                    f.write(image_bytes)
                
                print(f"   ✅ Saved: {filepath}")
                return True
            else:
                print(f"   ❌ No image data in response for {archetype_data['name']}")
                print(f"   Response: {json.dumps(result, indent=2)[:500]}")
                return False
                
        elif response.status_code == 429:
            print(f"   ⏳ Rate limited. Waiting 60 seconds...")
            time.sleep(60)
            return generate_image(archetype_key, archetype_data, output_dir)
        else:
            print(f"   ❌ Error {response.status_code}: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"   ⏳ Request timed out for {archetype_data['name']}. Retrying...")
        time.sleep(10)
        return generate_image(archetype_key, archetype_data, output_dir)
    except Exception as e:
        print(f"   ❌ Exception: {str(e)}")
        return False


def main():
    """
    Main function to generate all archetype images.
    """
    print("=" * 60)
    print("  MARQUIS DE MAYFAIR - ARCHETYPE IMAGE GENERATOR")
    print("  Generating luxury erotic illustrations for 16 archetypes")
    print("=" * 60)
    
    # Create output directory
    output_dir = Path(__file__).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n📁 Output directory: {output_dir}")
    
    # Check for API key
    if not API_KEY:
        print("\n" + "=" * 60)
        print("ERROR: XAI_API_KEY environment variable not set!")
        print("=" * 60)
        print("\nTo use this script, you need an xAI API key.")
        print("1. Sign up at https://x.ai/api/")
        print("2. Get your API key")
        print("3. Run: export XAI_API_KEY='your_api_key_here'")
        print("4. Then run this script again")
        print("\n" + "=" * 60)
        sys.exit(1)
    
    # Generate images for each archetype
    successful = 0
    failed = 0
    
    for archetype_key, archetype_data in ARCHETYPES.items():
        # Check if image already exists
        existing_file = output_dir / f"{archetype_key}.png"
        if existing_file.exists():
            print(f"\n⏭️  Skipping {archetype_data['name']} (already exists)")
            successful += 1
            continue
        
        if generate_image(archetype_key, archetype_data, output_dir):
            successful += 1
        else:
            failed += 1
        
        # Rate limiting - wait between requests
        time.sleep(3)
    
    # Summary
    print("\n" + "=" * 60)
    print("  GENERATION COMPLETE")
    print("=" * 60)
    print(f"  ✅ Successful: {successful}")
    print(f"  ❌ Failed: {failed}")
    print(f"  📁 Images saved to: {output_dir}")
    print("=" * 60)
    
    if failed > 0:
        print("\nTo retry failed images, simply run the script again.")
        print("Existing images will be skipped.")


if __name__ == "__main__":
    main()

