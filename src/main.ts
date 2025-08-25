const API_URL = 'http://localhost:3333';
import type { Person, Actress, Actor } from "./types";

const actressNationalities = [
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

const actorNationalities = [
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
  'Chinese',
  'Scottish',
  'New Zealand',
  'Hong Kong',
  'German',
  'Canadian',
  'Irish'
];

const isPersonValid = (data: unknown): data is Person => {
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
    typeof data.image === 'string'
  )
}

const isActressValid = (data: unknown): data is Actress => {
  return (
    isPersonValid(data) &&
    'most_famous_movies' in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every(movie => typeof movie === 'string') &&
    'awards' in data &&
    typeof data.awards === 'string' &&
    'nationality' in data &&
    typeof data.nationality === 'string' &&
    actressNationalities.includes(data.nationality)
  )
};

const isActorValid = (data: unknown): data is Actor => {
  return (
    isPersonValid(data) &&
    'know_for' in data &&
    data.know_for instanceof Array &&
    data.know_for.length === 3 &&
    data.know_for.every(movie => typeof movie === 'string') &&
    'awards' in data &&
    data.awards instanceof Array &&
    (data.awards.length === 1 || data.awards.length === 2) &&
    data.awards.every(award => typeof award === 'string') &&
    'nationality' in data &&
    typeof data.nationality === 'string' &&
    actorNationalities.includes(data.nationality)
  )
}

const getActress = async (id: number): Promise<Actress | null> => {
  try {
    const res = await fetch(`${API_URL}/actresses/${id}`);
    if (!res.ok) throw new Error(`Errore ${res.status}: ${res.statusText}`);
    const data: unknown = await res.json();
    if (!isActressValid(data)) throw new Error('Formato non valido');
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

const getActor = async (id: number): Promise<Actor | null> => {
  try {
    const res = await fetch(`${API_URL}/actors/${id}`);
    if (!res.ok) throw new Error(`Errore ${res.status}: ${res.statusText}`);
    const data: unknown = await res.json();
    if (!isActorValid(data)) throw new Error('Formato non valido');
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Errore nel recupero dei dati dell'attore:`, e);
    } else {
      console.error('Errore sconosciuto:', e);
    }
    return null
  }
}

const getAllActress = async (): Promise<Actress[]> => {
  try {
    const res = await fetch(`${API_URL}/actresses`);
    if (!res.ok) throw new Error(`Errore ${res.status}: ${res.statusText}`);
    const data: unknown = res.json();
    if (!Array.isArray(data)) throw new Error(`Formato non valido`);
    const validActress = data.filter(d => isActressValid(d));
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

const getAllActors = async (): Promise<Actor[]> => {
  try {
    const res = await fetch(`${API_URL}/actors`);
    if (!res.ok) throw new Error(`Errore ${res.status}: ${res.statusText}`);
    const data: unknown = res.json();
    if (!Array.isArray(data)) throw new Error(`Formato non valido`);
    const validActors = data.filter(d => isActorValid(d));
    return validActors;
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

const getActors = async (arr: number[]): Promise<(Actor | null)[]> => {
  try {
    return await Promise.all(arr.map(id => getActor(id)));
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

const createActor = (data: Omit<Actor, 'id'>): Actor => {
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

const updateActor = (actor: Actor, updates: Partial<Omit<Actor, 'id' | 'name'>>): Actor => {
  return {
    ...actor,
    ...updates
  }
}

const randomElement = <T>(arr: T[]): T => {
  if (arr.length === 0) throw new Error('Array vuoto: impossibile selezionare un elemento casuale');
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const createRandomCouple = async (): Promise<[Actress, Actor]> => {
  const allActors = await getAllActors();
  const allActresses = await getAllActress();
  return [randomElement(allActresses), randomElement(allActors)];
}