import { useState, useCallback } from "react";
import type { Deck, Flashcard } from "../types";
import { loadDecks, saveDecks, generateId } from "../utils/storage";

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>(() => loadDecks());

  const persist = useCallback((updated: Deck[]) => {
    setDecks(updated);
    saveDecks(updated);
  }, []);

  const addDeck = useCallback(
    (name: string, description: string) => {
      const now = Date.now();
      const deck: Deck = {
        id: generateId(),
        name,
        description,
        cards: [],
        createdAt: now,
        updatedAt: now,
      };
      persist([...decks, deck]);
      return deck;
    },
    [decks, persist],
  );

  const updateDeck = useCallback(
    (id: string, name: string, description: string) => {
      persist(
        decks.map((d) =>
          d.id === id ? { ...d, name, description, updatedAt: Date.now() } : d,
        ),
      );
    },
    [decks, persist],
  );

  const deleteDeck = useCallback(
    (id: string) => {
      persist(decks.filter((d) => d.id !== id));
    },
    [decks, persist],
  );

  const addCard = useCallback(
    (deckId: string, front: string, back: string) => {
      const card: Flashcard = {
        id: generateId(),
        front,
        back,
        confidence: 0,
        lastReviewed: null,
      };
      persist(
        decks.map((d) =>
          d.id === deckId
            ? { ...d, cards: [...d.cards, card], updatedAt: Date.now() }
            : d,
        ),
      );
      return card;
    },
    [decks, persist],
  );

  const updateCard = useCallback(
    (deckId: string, cardId: string, front: string, back: string) => {
      persist(
        decks.map((d) =>
          d.id === deckId
            ? {
                ...d,
                cards: d.cards.map((c) =>
                  c.id === cardId ? { ...c, front, back } : c,
                ),
                updatedAt: Date.now(),
              }
            : d,
        ),
      );
    },
    [decks, persist],
  );

  const deleteCard = useCallback(
    (deckId: string, cardId: string) => {
      persist(
        decks.map((d) =>
          d.id === deckId
            ? {
                ...d,
                cards: d.cards.filter((c) => c.id !== cardId),
                updatedAt: Date.now(),
              }
            : d,
        ),
      );
    },
    [decks, persist],
  );

  const updateCardConfidence = useCallback(
    (deckId: string, cardId: string, confidence: number) => {
      persist(
        decks.map((d) =>
          d.id === deckId
            ? {
                ...d,
                cards: d.cards.map((c) =>
                  c.id === cardId
                    ? { ...c, confidence, lastReviewed: Date.now() }
                    : c,
                ),
                updatedAt: Date.now(),
              }
            : d,
        ),
      );
    },
    [decks, persist],
  );

  return {
    decks,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    updateCardConfidence,
  };
}
