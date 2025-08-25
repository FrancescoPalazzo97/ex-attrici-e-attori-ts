const API_URL = 'http://localhost:3333';
import type { Actress } from "./types";

const nationalities = [
  'American',
  'British',
  'Astrualian',
  'Israeli-American',
  'South African',
  'French',
  'Indian',
  'Israeli',
  'Spanish',
  'South Korean',
  'Chinese'
];

const isValid = (data: unknown): data is Actress => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    typeof data.id === 'number' &&
    'name' in data &&
    typeof data.name === 'string' &&
    'birth_year' in data &&
    typeof data.birth_year === 'number' &&
    'death_year' in data &&
    typeof data.death_year === 'number' &&
    'biography' in data &&
    typeof data.biography === 'string' &&
    'image' in data &&
    typeof data.image === 'string' &&
    'most_famous_movies' in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every(movie => typeof movie === 'string') &&
    'awards' in data &&
    typeof data.awards === 'string' &&
    'nationality' in data &&
    typeof data.nationality === 'string' &&
    nationalities.includes(data.nationality)
  )
};

const getActress = async (id: number): Promise<Actress | null> => {
  try {
    const res = await fetch(`${API_URL}/actresses/${id}`);
    if (!res.ok) throw new Error(`Errore ${res.status}: ${res.statusText}`);
    const data: unknown = await res.json();
    if (!isValid(data)) throw new Error('Formato non valido');
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Errore nel recupero dei dati dell'attrice:`, e);
    } else {
      console.error('Errore sconosciuto:', e);
    }
    return null
  }
};

const getAllActress = async (): Promise<Actress[]> => {
  try {
    const res = await fetch(`${API_URL}/actresses`);
    if (!res.ok) throw new Error(`Errore ${res.status}: ${res.statusText}`);
    const data: unknown = res.json();
    if (!Array.isArray(data)) throw new Error(`Formato non valido`);
    const validActress = data.filter(d => isValid(d));
    return validActress;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Errore nel recupero dei dati delle attrici:`, e);
    } else {
      console.error('Errore sconosciuto:', e);
    }
    return [];
  }
}

const getActresses = async (arr: number[]): Promise<(Actress | null)[]> => {
  try {
    return await Promise.all(arr.map(id => getActress(id)));
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Errore nel recupero dei dati delle attrici:`, e);
    } else {
      console.error('Errore sconosciuto:', e);
    }
    return [];
  }
}

const generateId = (): number => Math.floor(Math.random() * 99999);

const createActress = (data: Omit<Actress, 'id'>): Actress => {
  return {
    id: generateId(),
    ...data
  }
}

const updateActress = (actress: Actress, updates: Partial<Omit<Actress, 'id' | 'name'>>): Actress => {
  return {
    ...actress,
    ...updates
  }
}