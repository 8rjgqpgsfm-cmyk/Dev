import { useState } from "react";
import type { Deck } from "../types";

interface CardManagerProps {
  deck: Deck;
  onAddCard: (deckId: string, front: string, back: string) => void;
  onUpdateCard: (
    deckId: string,
    cardId: string,
    front: string,
    back: string,
  ) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
  onBack: () => void;
}

const CONFIDENCE_LABELS = ["New", "Learning", "Familiar", "Mastered"];
const CONFIDENCE_CLASSES = ["new", "learning", "familiar", "mastered"];

export function CardManager({
  deck,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onBack,
}: CardManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    if (editingId) {
      onUpdateCard(deck.id, editingId, front.trim(), back.trim());
      setEditingId(null);
    } else {
      onAddCard(deck.id, front.trim(), back.trim());
    }
    setFront("");
    setBack("");
    setShowForm(false);
  }

  function startEdit(cardId: string, cardFront: string, cardBack: string) {
    setEditingId(cardId);
    setFront(cardFront);
    setBack(cardBack);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setFront("");
    setBack("");
  }

  return (
    <div className="card-manager">
      <div className="section-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <h2>{deck.name}</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Card
        </button>
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Card" : "Add New Card"}</h3>
          <div className="card-form-fields">
            <div className="form-field">
              <label>Front (Question)</label>
              <textarea
                placeholder="Enter the question or term"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                rows={3}
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Back (Answer)</label>
              <textarea
                placeholder="Enter the answer or definition"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save" : "Add Card"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {deck.cards.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-icon">🃏</div>
          <h3>No cards yet</h3>
          <p>Add your first flashcard to this deck!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {deck.cards.map((card) => (
            <div key={card.id} className="card flashcard-preview">
              <div className="flashcard-preview-content">
                <div className="flashcard-side">
                  <span className="side-label">Front</span>
                  <p>{card.front}</p>
                </div>
                <div className="flashcard-divider" />
                <div className="flashcard-side">
                  <span className="side-label">Back</span>
                  <p>{card.back}</p>
                </div>
              </div>
              <div className="flashcard-preview-footer">
                <span
                  className={`confidence-badge ${CONFIDENCE_CLASSES[card.confidence]}`}
                >
                  {CONFIDENCE_LABELS[card.confidence]}
                </span>
                <div className="card-actions">
                  <button
                    className="btn-icon"
                    onClick={() => startEdit(card.id, card.front, card.back)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => onDeleteCard(deck.id, card.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
