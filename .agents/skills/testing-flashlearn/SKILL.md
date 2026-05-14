---
name: testing-flashlearn
description: Test the FlashLearn flashcard app end-to-end. Use when verifying deck/card CRUD, study mode, or persistence changes.
---

# Testing FlashLearn

## Local Dev Setup

1. Run `npm install` in the repo root
2. Run `npm run dev` — the app starts on `http://localhost:5173` (or next available port)
3. Open the URL in the browser

## Core Test Flows

### Deck Management
- Click "+ New Deck" to create a deck with name and description
- Verify the deck card appears in the grid with correct title, description, and "0 cards" stat
- The "Study" button should be disabled when the deck has 0 cards
- Edit (pencil icon) and Delete (trash icon) are in the deck card header

### Card Management
- Click "Manage Cards" on a deck to enter the card manager view
- Click "+ Add Card" to show the form with Front (Question) and Back (Answer) textareas
- After adding, cards appear as previews showing both sides and a confidence badge ("New" initially)
- Cards can be edited (pencil icon) or deleted (trash icon)

### Study Mode
- Click "Study" on a deck with cards to enter study mode
- Cards are shuffled randomly each session
- The card starts showing the question side with a "Click to flip" hint
- Click the card to flip it — it shows the answer with a purple gradient background
- After flipping, two buttons appear: "Didn't Know" (red) and "Got It" (green)
- Response buttons are NOT visible before flipping — this is an important assertion
- Progress is shown as "X / Y" and a progress bar fills as you advance
- After the last card, a results screen shows: percentage score, correct/incorrect/total counts

### Confidence Tracking
- "Got It" increments confidence: New(0) → Learning(1) → Familiar(2) → Mastered(3)
- "Didn't Know" decrements confidence (minimum 0)
- Deck stats on the main page reflect updated confidence levels

### Persistence
- All data is stored in localStorage under key `flashcard-app-decks`
- Refresh the page (F5) after making changes and verify data is preserved
- This is a critical test — broken persistence means data loss

## Lint & Build

```bash
npm run lint    # ESLint
npm run build   # TypeScript + Vite production build
```

## Devin Secrets Needed

None — this is a purely client-side app with no backend or authentication.
