// types/PokemonContextTypes.ts
import { Pokemon } from '../types/pokemonTypes';

export interface PokemonContextType {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  selectedPokemon: Pokemon | null;
  fetchPokemons: () => void;
  selectPokemon: (pokemon: Pokemon) => void;
  deselectPokemon: () => void;
}
