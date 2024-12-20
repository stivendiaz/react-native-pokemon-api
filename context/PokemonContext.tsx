import React, { createContext, PropsWithChildren } from 'react';
import usePokemons from '../hooks/usePokemons';
import { PokemonContextType } from '../types/PokemonContextTypes';

export const PokemonContext = createContext<PokemonContextType | null>(null);

export const PokemonProvider = ({ children }: PropsWithChildren<object>) => {
  const {
    pokemons,
    loading,
    error,
    fetchMorePokemons,
    hasMore,
    refreshPokemons,
  } = usePokemons();
  return (
    <PokemonContext.Provider
      value={{
        pokemons,
        loading,
        error,
        fetchMorePokemons,
        hasMore,
        refreshPokemons,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
