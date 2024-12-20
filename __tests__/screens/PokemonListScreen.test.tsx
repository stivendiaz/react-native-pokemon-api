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
  {
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

  it('displays a list of pokemons', () => {
    const { getByText, getByTestId } = renderWithContext();
    expect(getByText('bulbasaur')).toBeTruthy();
    expect(getByText('ivysaur')).toBeTruthy();
    expect(getByText('charmander')).toBeTruthy();
    expect(getByTestId('refresh-button')).toBeTruthy();
  });

  it('filters pokemons by search query', async () => {
    const { getByTestId, queryByText } = renderWithContext();
    const searchInput = getByTestId('search-input');

    // Initially all three pokemons are visible
    expect(queryByText('bulbasaur')).toBeTruthy();
    expect(queryByText('ivysaur')).toBeTruthy();
    expect(queryByText('charmander')).toBeTruthy();

    // Type "ivy" in search
    fireEvent.changeText(searchInput, 'ivy');

    // Only ivysaur should remain
    await waitFor(() => {
      expect(queryByText('bulbasaur')).toBeNull();
      expect(queryByText('charmander')).toBeNull();
      expect(queryByText('ivysaur')).toBeTruthy();
    });
  });

  it('calls fetchPokemons when refresh button is pressed', () => {
    const { getByTestId } = renderWithContext();
    const refreshButton = getByTestId('refresh-button');

    fireEvent.press(refreshButton);
    expect(mockFetchPokemons).toHaveBeenCalled();
  });

  it('displays loading indicator when loading is true', () => {
    const { getByTestId } = renderWithContext({ loading: true, pokemons: [] });
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays error message if error is provided', () => {
    const { getByText } = renderWithContext({ error: 'Error fetching data' });
    expect(getByText('Error fetching data')).toBeTruthy();
  });

  it('shows modal when a pokemon is selected and closes it', async () => {
    const { getByTestId, queryByTestId } = renderWithContext();

    // Press on bulbasaur list item
    fireEvent.press(getByTestId('pokemon-item-bulbasaur'));

    // Check for bulbasaur inside the modal only
    const modalContent = getByTestId('pokemon-modal-content');
    expect(within(modalContent).getByText('bulbasaur')).toBeTruthy();

    // Press close modal
    fireEvent.press(getByTestId('close-modal'));
    await waitFor(() => {
      expect(queryByTestId('pokemon-modal-content')).toBeNull();
    });
  });

  // New test: Ensuring that Pokémon are displayed correctly after loading them from the API
  it('displays pokemons after loading them from the API', async () => {
    // Initially loading is true, no pokemons
    const { rerender, getByTestId, queryByText } = render(
      <PokemonContext.Provider
        value={{
          pokemons: [],
          loading: true,
          error: null,
          fetchPokemons: mockFetchPokemons,
        }}
      >
        <PokemonListScreen />
      </PokemonContext.Provider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(queryByText('bulbasaur')).toBeNull();
    expect(queryByText('ivysaur')).toBeNull();
    expect(queryByText('charmander')).toBeNull();

    // Simulate that loading finished and pokemons are now available
    rerender(
      <PokemonContext.Provider
        value={{
          pokemons: mockPokemons,
          loading: false,
          error: null,
          fetchPokemons: mockFetchPokemons,
        }}
      >
        <PokemonListScreen />
      </PokemonContext.Provider>
    );

    // Wait for rerender
    await waitFor(() => {
      expect(queryByText('bulbasaur')).toBeTruthy();
      expect(queryByText('ivysaur')).toBeTruthy();
      expect(queryByText('charmander')).toBeTruthy();
    });
  });

  // Additional explicit test: Testing the search engine functionality in isolation
  it('search engine filters the list when query changes', async () => {
    const { getByTestId, queryByText } = renderWithContext();

    // Type "char" in search
    fireEvent.changeText(getByTestId('search-input'), 'char');

    await waitFor(() => {
      // Only charmander matches
      expect(queryByText('bulbasaur')).toBeNull();
      expect(queryByText('ivysaur')).toBeNull();
      expect(queryByText('charmander')).toBeTruthy();
    });
  });
});
