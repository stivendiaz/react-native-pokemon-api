import { useContext } from 'react';
import { PokemonContext } from '../context/PokemonContext';
import { PokemonContextType } from '../types/PokemonContextTypes';

const usePokemonContext = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error(
      'usePokemonContext should be used inside a PokemonProvider',
    );
  }
  return context;
};

export default usePokemonContext;
