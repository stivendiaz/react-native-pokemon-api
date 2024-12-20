import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PokemonModal from '../../components/PokemonModal';
import { Pokemon } from '../../types/pokemonTypes';

describe('PokemonModal', () => {
  const mockPokemon: Pokemon = {
    name: 'charmander',
    weight: 85,
    height: 6,
    types: [{
        type: {
            name: 'fire',
            url: ''
        },
        slot: 0
    }],
    sprites: { front_default: 'https://example.com/charmander.png' },
  };

  it('displays pokemon details', () => {
    const { getByText, getByTestId } = render(
      <PokemonModal pokemon={mockPokemon} onClose={jest.fn()} />
    );

    expect(getByText('charmander')).toBeTruthy();
    expect(getByText('Weight: 85')).toBeTruthy();
    expect(getByText('Height: 6')).toBeTruthy();
    expect(getByText('Types: fire')).toBeTruthy();
    expect(getByTestId('pokemon-image-charmander')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <PokemonModal pokemon={mockPokemon} onClose={onCloseMock} />
    );

    fireEvent.press(getByTestId('close-modal'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
