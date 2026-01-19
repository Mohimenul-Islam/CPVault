import api from "./axios";

export interface Deck {
    id: number;
    name: string;
    isPublic: boolean;
    isOwner: boolean;
}

export async function getPublicDecks(): Promise<Deck[]> {
    const res = await api.get("/decks/public");
    return res.data;
}

export async function getMyDecks(): Promise<Deck[]> {
    const res = await api.get("/decks/mine");
    return res.data;
}

export async function getDeck(id: number): Promise<Deck> {
    const res = await api.get(`/decks/${id}`);
    return res.data;
}

export async function createDeck(name: string, isPublic: boolean): Promise<Deck> {
    const res = await api.post("/decks", { name, isPublic });
    return res.data;
}
