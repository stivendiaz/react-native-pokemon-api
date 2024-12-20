import { useState, useEffect } from 'react';
import { getPokemons } from '../api/pokeapi';
import { Pokemon } from '../types/pokemonTypes';

const usePokemons = () => {
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
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  return { pokemons, loading, error, fetchPokemons };
};

export default usePokemons;
