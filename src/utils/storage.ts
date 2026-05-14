import type { Deck } from "../types";

const STORAGE_KEY = "flashcard-app-decks";

export function loadDecks(): Deck[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data) as Deck[];
}

export function saveDecks(decks: Deck[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function generateId(): string {
  return crypto.randomUUID();
}
