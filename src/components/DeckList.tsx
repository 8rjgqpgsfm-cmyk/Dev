import { useState } from "react";
import type { Deck } from "../types";

interface DeckListProps {
  decks: Deck[];
  onAddDeck: (name: string, description: string) => Deck;
  onUpdateDeck: (id: string, name: string, description: string) => void;
  onDeleteDeck: (id: string) => void;
  onSelectDeck: (deck: Deck) => void;
  onStudyDeck: (deck: Deck) => void;
}

export function DeckList({
  decks,
  onAddDeck,
  onUpdateDeck,
  onDeleteDeck,
  onSelectDeck,
  onStudyDeck,
}: DeckListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingId) {
      onUpdateDeck(editingId, name.trim(), description.trim());
      setEditingId(null);
    } else {
      onAddDeck(name.trim(), description.trim());
    }
    setName("");
    setDescription("");
    setShowForm(false);
  }

  function startEdit(deck: Deck) {
    setEditingId(deck.id);
    setName(deck.name);
    setDescription(deck.description);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setDescription("");
  }

  function getStats(deck: Deck) {
    const total = deck.cards.length;
    if (total === 0) return { total: 0, mastered: 0, learning: 0, newCards: 0 };
    const mastered = deck.cards.filter((c) => c.confidence >= 3).length;
    const learning = deck.cards.filter(
      (c) => c.confidence > 0 && c.confidence < 3,
    ).length;
    const newCards = deck.cards.filter((c) => c.confidence === 0).length;
    return { total, mastered, learning, newCards };
  }

  return (
    <div className="deck-list">
      <div className="section-header">
        <h2>Your Decks</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Deck
        </button>
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Deck" : "Create New Deck"}</h3>
          <input
            type="text"
            placeholder="Deck name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save" : "Create"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {decks.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No decks yet</h3>
          <p>Create your first deck to start learning!</p>
        </div>
      ) : (
        <div className="deck-grid">
          {decks.map((deck) => {
            const stats = getStats(deck);
            return (
              <div key={deck.id} className="card deck-card">
                <div className="deck-card-header">
                  <h3>{deck.name}</h3>
                  <div className="deck-actions">
                    <button
                      className="btn-icon"
                      onClick={() => startEdit(deck)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => onDeleteDeck(deck.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {deck.description && (
                  <p className="deck-description">{deck.description}</p>
                )}
                <div className="deck-stats">
                  <span className="stat">
                    <span className="stat-num">{stats.total}</span> cards
                  </span>
                  {stats.total > 0 && (
                    <>
                      <span className="stat stat-new">
                        <span className="stat-num">{stats.newCards}</span> new
                      </span>
                      <span className="stat stat-learning">
                        <span className="stat-num">{stats.learning}</span> learning
                      </span>
                      <span className="stat stat-mastered">
                        <span className="stat-num">{stats.mastered}</span> mastered
                      </span>
                    </>
                  )}
                </div>
                <div className="deck-card-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onSelectDeck(deck)}
                  >
                    Manage Cards
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onStudyDeck(deck)}
                    disabled={deck.cards.length === 0}
                  >
                    Study
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
