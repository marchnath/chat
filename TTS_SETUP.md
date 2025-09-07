# Text-to-Speech (TTS) Integration

## Overview

This project includes a text-to-speech feature that allows users to listen to messages and hints in their selected learning language. The TTS functionality uses the browser's built-in Speech Synthesis API.

## Features

- **Multi-language support**: Automatically uses the user's selected learning language
- **Smart language mapping**: Maps display language names to proper speech synthesis language codes
- **Visual feedback**: Shows speaking/loading states with appropriate icons
- **Non-blocking UI**: TTS controls don't interfere with existing click handlers
- **Browser compatibility**: Gracefully handles browsers that don't support speech synthesis

## Implementation

### Core Components

#### 1. useTTS Hook (`hooks/useTTS.js`)

- Custom React hook that manages TTS functionality
- Maps learning languages to proper speech synthesis language codes
- Provides methods: `speak()`, `stop()`, `toggle()`
- Returns state: `isSpeaking`, `isLoading`, `isSupported`
- Automatically selects appropriate voice for the target language

#### 2. MessageBubble Component

- Added minimal TTS button positioned outside the bubble corner
- Uses Play/Square/Loader2 icons for a cleaner aesthetic
- Positioned with 50% opacity by default, full opacity on hover
- Scale animation (110%) on hover for subtle feedback
- AI messages: TTS button on top-right corner
- User messages: TTS button on top-left corner
- Prevents event bubbling to avoid conflicts with existing click handlers

#### 3. HintBubble Component

- Added TTS button at top-left corner, complementing the lightbulb at top-right
- Same minimal design language as MessageBubble
- Positioned outside the bubble for clean aesthetics
- Hover effects and animations match the overall design system

### Language Support

The TTS feature supports all languages available in the app:

- English (en-US)
- Spanish (es-ES)
- French (fr-FR)
- German (de-DE)
- Italian (it-IT)
- Portuguese (pt-PT)
- Russian (ru-RU)
- Japanese (ja-JP)
- Korean (ko-KR)
- Chinese (zh-CN)
- Arabic (ar-SA)

### Usage

1. Subtle TTS buttons appear as small circles positioned outside bubble corners
2. Buttons have 60% opacity by default, becoming fully visible on hover
3. Click the play icon (▶️) to start reading any message or hint aloud
4. While speaking, icon changes to a stop square (⏹️) and can be clicked to stop
5. During loading, a spinning loader icon is shown
6. Hover effects include gentle scaling (110%) for tactile feedback
7. The TTS automatically uses the user's selected learning language
8. Speech rate is set to 0.9 (slightly slower) for better language learning

### Design Philosophy

- **Minimal & Clean**: Small, unobtrusive buttons that don't clutter the interface
- **Contextual Positioning**: Different corners for different message types
- **Subtle Interactions**: Low opacity with smooth hover transitions
- **Consistent Iconography**: Play/Stop metaphor instead of volume controls
- **Accessible**: Proper ARIA labels and visual feedback

### Browser Compatibility

- **Supported**: Modern browsers with Speech Synthesis API
- **Fallback**: TTS buttons are hidden if the API is not supported
- **No errors**: Graceful degradation for unsupported browsers

### Integration Points

- Uses the existing `useProfileStore` to get the user's learning language
- Integrates seamlessly with existing UI without breaking functionality
- Maintains all existing click behaviors for word translation menus

## Future Enhancements

- Voice selection preferences
- Speech rate adjustment
- Pitch and volume controls
- Offline TTS support
- Custom voice training for better pronunciation
