import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PokemonListItem from '../../components/PokemonListItem';
import { Pokemon } from '../../types/pokemonTypes';

describe('PokemonListItem', () => {
  const mockPokemon: Pokemon = {
    name: 'pikachu',
    weight: 60,
    height: 4,
    types: [
      {
        type: {
          name: 'electric',
          url: '',
        },
        slot: 0,
      },
    ],
    sprites: { front_default: 'https://example.com/pikachu.png' },
  };

  it('renders pokemon name and image', () => {
    const { getByText, getByTestId } = render(
      <PokemonListItem pokemon={mockPokemon} onPress={jest.fn()} />,
    );

    expect(getByText('pikachu')).toBeTruthy();
    expect(getByTestId('pokemon-image-pikachu')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <PokemonListItem pokemon={mockPokemon} onPress={onPressMock} />,
    );

    fireEvent.press(getByTestId('pokemon-item-pikachu'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
