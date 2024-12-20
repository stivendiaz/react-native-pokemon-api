// __tests__/screens/PokemonListScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, within } from '@testing-library/react-native';
import PokemonListScreen from '../../app/index';
import { PokemonContext } from '../../context/PokemonContext';
import { Pokemon } from '../../types/pokemonTypes';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: (props: any) => <Text testID="mocked-ionicon">Ionicon: {props.name}</Text>,
  };
});

jest.mock('expo-router', () => ({
  Stack: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => (
      <View testID="safe-area-provider">{children}</View>
    ),
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <View testID="safe-area-view">{children}</View>
    ),
    useSafeAreaInsets: () => ({ top: 0, left: 0, bottom: 0, right: 0 }),
  };
});

const mockPokemons: Pokemon[] = [
  {
    name: 'bulbasaur',
    weight: 69,
    height: 7,
    types: [{
        type: {
            name: 'grass',
            url: ''
        },
        slot: 0
    }, {
        type: {
            name: 'poison',
            url: ''
        },
        slot: 0
    }],
    sprites: { front_default: 'https://example.com/bulbasaur.png' },
  },
  {
    name: 'ivysaur',
    weight: 130,
    height: 10,
    types: [{
        type: {
            name: 'grass',
            url: ''
        },
        slot: 0
    }, {
        type: {
            name: 'poison',
            url: ''
        },
        slot: 0
    }],
    sprites: { front_default: 'https://example.com/ivysaur.png' },
  },
];

describe('PokemonListScreen', () => {
  const mockFetchPokemons = jest.fn();

  const renderWithContext = (props?: Partial<React.ContextType<typeof PokemonContext>>) => {
    return render(
      <PokemonContext.Provider
        value={{
          pokemons: mockPokemons,
          loading: false,
          error: null,
          fetchPokemons: mockFetchPokemons,
          ...props,
        }}
      >
        <PokemonListScreen />
      </PokemonContext.Provider>
    );
  };

  it('shows modal when a pokemon is selected and closes it', async () => {
    const { getByTestId, queryByTestId } = renderWithContext();
  
    // Press on bulbasaur list item
    fireEvent.press(getByTestId('pokemon-item-bulbasaur'));
  
    // Now locate the modal content
    const modalContent = getByTestId('pokemon-modal-content');
  
    // Check for bulbasaur inside the modal only
    expect(within(modalContent).getByText('bulbasaur')).toBeTruthy();
  
    // Press close modal
    fireEvent.press(getByTestId('close-modal'));
  
    // Wait for the modal content to be removed
    await waitFor(() => {
      expect(queryByTestId('pokemon-modal-content')).toBeNull();
    });
  });
});
