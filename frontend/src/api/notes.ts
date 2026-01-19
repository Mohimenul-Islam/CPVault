import api from "./axios";

export interface Note {
    id: number;
    problemName: string;
    problemLink?: string;
    keyTakeaway: string;
    errorLog?: string;
    solution: string;
    alternativeSolution?: string;
}

export async function getNotesByDeck(deckId: number): Promise<Note[]> {
    const res = await api.get(`/decks/${deckId}/notes`);
    return res.data;
}

export async function getNote(id: number): Promise<Note> {
    const res = await api.get(`/notes/${id}`);
    return res.data;
}
