import { Pokemon } from './pokemonTypes';

export type PokemonContextType = {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  fetchMorePokemons: (initial?: boolean) => Promise<void>;
  hasMore: boolean;
  refreshPokemons: () => void;
};
