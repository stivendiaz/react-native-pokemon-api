import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { getPokemons } from '../api/pokeapi';
import { Pokemon } from '../types/pokemonTypes';

interface PokemonContextType {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  fetchPokemons: () => void;
}

export const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

interface PokemonProviderProps {
  children: ReactNode;
}

export const PokemonProvider: React.FC<PokemonProviderProps> = ({ children }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPokemons();
      setPokemons(data);
    } catch (err) {
      setError('Error al obtener los Pokémon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const contextValue = useMemo(
    () => ({
      pokemons,
      loading,
      error,
      fetchPokemons,
    }),
    [pokemons, loading, error],
  );

  return <PokemonContext.Provider value={contextValue}>{children}</PokemonContext.Provider>;
};
