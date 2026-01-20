import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDeck, type Deck } from "../api/decks";
import { getNotesByDeck, type Note } from "../api/notes";

export default function DeckDetails() {
    const { id } = useParams();
    const deckId = Number(id);

    const [deck, setDeck] = useState<Deck | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const deckData = await getDeck(deckId);
                setDeck(deckData);

                const notesData = await getNotesByDeck(deckId);
                setNotes(notesData);
            } catch (err: any) {
                if (err.response?.status === 403) {
                    setError("You do not have access to this deck");
                } else if (err.response?.status === 404) {
                    setError("Deck not found");
                } else {
                    setError("Failed to load deck");
                }
            } finally {
                setLoading(false);
            }
        }

        if (!isNaN(deckId)) load();
    }, [deckId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!deck) return null;

    return (
        <div style={{ maxWidth: 900, margin: "2rem auto" }}>
            <h2>{deck.name}</h2>
            <p>{deck.isPublic ? "Public deck" : "Private deck"}</p>

            <h3 style={{ marginTop: "2rem" }}>Notes</h3>

            {notes.length === 0 && <p>No notes yet.</p>}

            {notes.map((note) => (
                <div key={note.id} style={{ marginBottom: "1.5rem" }}>
                    <h4>{note.problemName}</h4>

                    {note.problemLink && (
                        <a href={note.problemLink} target="_blank">
                            Problem link
                        </a>
                    )}

                    <p><strong>Key takeaway:</strong> {note.keyTakeaway}</p>
                    <p><strong>Solution:</strong> {note.solution}</p>

                    {note.alternativeSolution && (
                        <p><strong>Alternative:</strong> {note.alternativeSolution}</p>
                    )}

                    {note.errorLog && (
                        <p><strong>Error log:</strong> {note.errorLog}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
