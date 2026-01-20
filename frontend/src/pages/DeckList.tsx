import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicDecks, getMyDecks, createDeck, type Deck } from "../api/decks";
import { useAuth } from "../auth/AuthContext";

export default function DeckList() {
    const { token, logout } = useAuth();

    const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
    const [myDecks, setMyDecks] = useState<Deck[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newDeckName, setNewDeckName] = useState("");
    const [newDeckPublic, setNewDeckPublic] = useState(false);
    const [creating, setCreating] = useState(false);

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

    const handleCreateDeck = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setError(null);

        try {
            const newDeck = await createDeck(newDeckName, newDeckPublic);
            setMyDecks([...myDecks, newDeck]);
            if (newDeckPublic) {
                setPublicDecks([...publicDecks, newDeck]);
            }
            setNewDeckName("");
            setNewDeckPublic(false);
            setShowCreateForm(false);
        } catch (err) {
            setError("Failed to create deck");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "2rem auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2>CPVault</h2>
                {token && <button onClick={logout}>Logout</button>}
            </div>

            {token && (
                <>
                    <h3>My Decks</h3>

                    {!showCreateForm ? (
                        <button onClick={() => setShowCreateForm(true)} style={{ marginBottom: "1rem" }}>
                            + New Deck
                        </button>
                    ) : (
                        <form onSubmit={handleCreateDeck} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
                            <div>
                                <label>Deck Name</label>
                                <input
                                    type="text"
                                    value={newDeckName}
                                    onChange={(e) => setNewDeckName(e.target.value)}
                                    required
                                    style={{ display: "block", marginTop: "0.5rem", width: "100%" }}
                                />
                            </div>
                            <div style={{ marginTop: "0.5rem" }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newDeckPublic}
                                        onChange={(e) => setNewDeckPublic(e.target.checked)}
                                    />
                                    {" "}Make Public
                                </label>
                            </div>
                            <div style={{ marginTop: "1rem" }}>
                                <button type="submit" disabled={creating}>
                                    {creating ? "Creating..." : "Create Deck"}
                                </button>
                                <button type="button" onClick={() => setShowCreateForm(false)} style={{ marginLeft: "0.5rem" }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {myDecks.map((deck) => (
                        <div key={deck.id} style={{ marginBottom: "0.5rem" }}>
                            <Link to={`/decks/${deck.id}`}>
                                {deck.name} {deck.isPublic ? "(Public)" : "(Private)"}
                            </Link>
                        </div>
                    ))}
                </>
            )}

            <h3 style={{ marginTop: "2rem" }}>Public Decks</h3>

            {publicDecks.length === 0 && <p>No public decks yet.</p>}

            {publicDecks.map((deck) => (
                <div key={deck.id} style={{ marginBottom: "0.5rem" }}>
                    <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
                </div>
            ))}

            {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </div>
    );
}
