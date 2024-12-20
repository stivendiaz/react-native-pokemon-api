import { useState, useEffect } from 'react';
import { getPokemons } from '../api/pokeapi';
import { Pokemon } from '../types/pokemonTypes';

const PAGE_SIZE = 20;

const usePokemons = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Initial load effect with no dependencies: runs once
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { pokemons: initialPokemons, next } = await getPokemons(
          0,
          PAGE_SIZE,
        );
        setPokemons(initialPokemons);
        setOffset(PAGE_SIZE);
        if (!next) setHasMore(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
  }, []); // No dependencies, so this runs only once

  const fetchMorePokemons = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const { pokemons: newPokemons, next } = await getPokemons(
        offset,
        PAGE_SIZE,
      );
      setPokemons(prev => [...prev, ...newPokemons]);
      setOffset(prev => prev + PAGE_SIZE);
      if (!next) setHasMore(false);
    } catch (err) {
      console.error(err);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const refreshPokemons = async () => {
    setHasMore(true);
    setLoading(true);
    setError(null);
    try {
      const { pokemons: refreshedPokemons, next } = await getPokemons(
        0,
        PAGE_SIZE,
      );
      setPokemons(refreshedPokemons);
      setOffset(PAGE_SIZE);
      if (!next) setHasMore(false);
    } catch (err) {
      console.error(err);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return {
    pokemons,
    loading,
    error,
    fetchMorePokemons,
    hasMore,
    refreshPokemons,
  };
};

export default usePokemons;
