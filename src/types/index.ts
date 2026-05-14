export interface Flashcard {
  id: string;
  front: string;
  back: string;
  confidence: number; // 0-3: 0=new, 1=learning, 2=familiar, 3=mastered
  lastReviewed: number | null;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
  updatedAt: number;
}

export type View = "decks" | "cards" | "study" | "results";

export interface StudySession {
  deckId: string;
  cards: Flashcard[];
  currentIndex: number;
  results: { cardId: string; correct: boolean }[];
}
