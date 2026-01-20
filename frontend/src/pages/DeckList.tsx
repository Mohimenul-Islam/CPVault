import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicDecks, getMyDecks, type Deck } from "../api/decks";
import { useAuth } from "../auth/AuthContext";

export default function DeckList() {
    const { token } = useAuth();

    const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
    const [myDecks, setMyDecks] = useState<Deck[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPublicDecks()
            .then(setPublicDecks)
            .catch(() => setError("Failed to load public decks"));

        if (token) {
            getMyDecks()
                .then(setMyDecks)
                .catch(() => setError("Failed to load your decks"));
        }
    }, [token]);

    return (
        <div style={{ maxWidth: 800, margin: "2rem auto" }}>
            <h2>Public Decks</h2>

            {publicDecks.map((deck) => (
                <div key={deck.id}>
                    <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
                </div>
            ))}

            {token && (
                <>
                    <h2 style={{ marginTop: "2rem" }}>My Decks</h2>

                    {myDecks.map((deck) => (
                        <div key={deck.id}>
                            <Link to={`/decks/${deck.id}`}>
                                {deck.name} {deck.isPublic ? "(Public)" : "(Private)"}
                            </Link>
                        </div>
                    ))}
                </>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
