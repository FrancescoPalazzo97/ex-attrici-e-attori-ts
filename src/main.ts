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
    const data: unknown = await res.json();
    if (!isValid(data)) throw new Error('Formato non valido');
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Errore nel recupero dei dati dell'attrice:`, e);
    } else {
      console.error('Errore sconosciuto:', e);
    }
  }
  return null
};