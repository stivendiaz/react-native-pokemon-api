import axios from 'axios';
import { PokemonAPIResponse, Pokemon } from '../types/pokemonTypes';

export const getPokemons = async (limit = 20): Promise<Pokemon[]> => {
  const response = await axios.get<PokemonAPIResponse>(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const results = response.data.results;

  const detailedPokemons: Pokemon[] = await Promise.all(
    results.map(async (pokemon) => {
      const detail = await axios.get<Pokemon>(pokemon.url);
      return detail.data;
    })
  );

  return detailedPokemons;
};
