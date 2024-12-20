// utils/filterPokemons.ts
import { Pokemon } from '../types/pokemonTypes';

export default function filterPokemons(
  pokemons: Pokemon[],
  query: string,
): Pokemon[] {
  if (!query) return pokemons;
  return pokemons.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
}
