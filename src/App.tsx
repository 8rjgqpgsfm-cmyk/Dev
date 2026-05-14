import { useState } from "react";
import type { Deck, View } from "./types";
import { useDecks } from "./hooks/useDecks";
import { DeckList } from "./components/DeckList";
import { CardManager } from "./components/CardManager";
import { StudyMode } from "./components/StudyMode";
import "./App.css";

function App() {
  const {
    decks,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    updateCardConfidence,
  } = useDecks();

  const [view, setView] = useState<View>("decks");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  const selectedDeck = decks.find((d) => d.id === selectedDeckId) ?? null;

  function handleSelectDeck(deck: Deck) {
    setSelectedDeckId(deck.id);
    setView("cards");
  }

  function handleStudyDeck(deck: Deck) {
    setSelectedDeckId(deck.id);
    setView("study");
  }

  function handleBack() {
    setView("decks");
    setSelectedDeckId(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={handleBack} style={{ cursor: "pointer" }}>
          🧠 FlashLearn
        </h1>
        <p className="app-subtitle">Master anything, one card at a time</p>
      </header>
      <main className="app-main">
        {view === "decks" && (
          <DeckList
            decks={decks}
            onAddDeck={addDeck}
            onUpdateDeck={updateDeck}
            onDeleteDeck={deleteDeck}
            onSelectDeck={handleSelectDeck}
            onStudyDeck={handleStudyDeck}
          />
        )}
        {view === "cards" && selectedDeck && (
          <CardManager
            deck={selectedDeck}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onBack={handleBack}
          />
        )}
        {view === "study" && selectedDeck && (
          <StudyMode
            deck={selectedDeck}
            onUpdateConfidence={updateCardConfidence}
            onFinish={handleBack}
          />
        )}
      </main>
    </div>
  );
}

export default App;
