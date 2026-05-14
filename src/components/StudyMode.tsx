import { useState, useCallback } from "react";
import type { Deck, Flashcard } from "../types";

interface StudyModeProps {
  deck: Deck;
  onUpdateConfidence: (
    deckId: string,
    cardId: string,
    confidence: number,
  ) => void;
  onFinish: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function StudyMode({
  deck,
  onUpdateConfidence,
  onFinish,
}: StudyModeProps) {
  const [cards] = useState<Flashcard[]>(() => shuffleArray(deck.cards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<
    { cardId: string; correct: boolean }[]
  >([]);
  const [finished, setFinished] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  const handleResponse = useCallback(
    (correct: boolean) => {
      const card = cards[currentIndex];
      const newConfidence = correct
        ? Math.min(card.confidence + 1, 3)
        : Math.max(card.confidence - 1, 0);

      onUpdateConfidence(deck.id, card.id, newConfidence);
      setResults((prev) => [...prev, { cardId: card.id, correct }]);

      if (currentIndex + 1 >= cards.length) {
        setFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      }
    },
    [cards, currentIndex, deck.id, onUpdateConfidence],
  );

  if (finished) {
    const correct = results.filter((r) => r.correct).length;
    const total = results.length;
    const percentage = Math.round((correct / total) * 100);

    return (
      <div className="study-results">
        <div className="card results-card">
          <h2>Session Complete!</h2>
          <div className="results-score">
            <div className="score-circle">
              <span className="score-number">{percentage}%</span>
            </div>
          </div>
          <div className="results-stats">
            <div className="result-stat correct">
              <span className="result-num">{correct}</span>
              <span className="result-label">Correct</span>
            </div>
            <div className="result-stat incorrect">
              <span className="result-num">{total - correct}</span>
              <span className="result-label">Incorrect</span>
            </div>
            <div className="result-stat total">
              <span className="result-num">{total}</span>
              <span className="result-label">Total</span>
            </div>
          </div>
          <div className="results-actions">
            <button className="btn btn-primary" onClick={onFinish}>
              Back to Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-mode">
      <div className="study-header">
        <button className="btn btn-secondary" onClick={onFinish}>
          ← Exit
        </button>
        <h2>{deck.name}</h2>
        <span className="study-progress-text">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="study-area">
        <div
          className={`flashcard-container ${isFlipped ? "flipped" : ""}`}
          onClick={() => setIsFlipped((f) => !f)}
        >
          <div className="flashcard">
            <div className="flashcard-front">
              <span className="flashcard-label">Question</span>
              <p className="flashcard-text">{currentCard.front}</p>
              <span className="flashcard-hint">Click to flip</span>
            </div>
            <div className="flashcard-back">
              <span className="flashcard-label">Answer</span>
              <p className="flashcard-text">{currentCard.back}</p>
            </div>
          </div>
        </div>

        {isFlipped && (
          <div className="study-actions">
            <button
              className="btn btn-incorrect"
              onClick={() => handleResponse(false)}
            >
              ✗ Didn&apos;t Know
            </button>
            <button
              className="btn btn-correct"
              onClick={() => handleResponse(true)}
            >
              ✓ Got It
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
