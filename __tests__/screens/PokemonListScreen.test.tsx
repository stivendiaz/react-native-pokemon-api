import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react-native';
import PokemonListScreen from '../../app/index';
import { PokemonContext } from '../../context/PokemonContext';
import { Pokemon } from '../../types/pokemonTypes';

// Mock for @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { Text } = jest.requireActual('react-native'); // Import Text inside the mock factory
  return {
    Ionicons: ({ name }: { name: string }) => (
      <Text testID="mocked-ionicon">Ionicon: {name}</Text>
    ),
  };
});

// Mock for expo-router
jest.mock('expo-router', () => ({
  Stack: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

// Mock for react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native'); // Import View inside the mock factory
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

// Mock Pokémon data
const mockPokemons: Pokemon[] = [
  {
    name: 'bulbasaur',
    weight: 69,
    height: 7,
    types: [
      { type: { name: 'grass', url: '' }, slot: 0 },
      { type: { name: 'poison', url: '' }, slot: 0 },
    ],
    sprites: { front_default: 'https://example.com/bulbasaur.png' },
  },
  {
    name: 'ivysaur',
    weight: 130,
    height: 10,
    types: [
      { type: { name: 'grass', url: '' }, slot: 0 },
      { type: { name: 'poison', url: '' }, slot: 0 },
    ],
    sprites: { front_default: 'https://example.com/ivysaur.png' },
  },
  {
    name: 'charmander',
    weight: 85,
    height: 6,
    types: [{ type: { name: 'fire', url: '' }, slot: 0 }],
    sprites: { front_default: 'https://example.com/charmander.png' },
  },
];

describe('PokemonListScreen', () => {
  const mockFetchMorePokemons = jest.fn();
  const mockRefreshPokemons = jest.fn();

  const renderWithContext = (
    props?: Partial<React.ContextType<typeof PokemonContext>>,
  ) => {
    return render(
      <PokemonContext.Provider
        value={{
          pokemons: mockPokemons,
          loading: false,
          error: null,
          fetchMorePokemons: mockFetchMorePokemons,
          refreshPokemons: mockRefreshPokemons,
          hasMore: true,
          ...props,
        }}
      >
        <PokemonListScreen />
      </PokemonContext.Provider>,
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

    fireEvent.changeText(searchInput, 'ivy');

    await waitFor(() => {
      expect(queryByText('bulbasaur')).toBeNull();
      expect(queryByText('charmander')).toBeNull();
      expect(queryByText('ivysaur')).toBeTruthy();
    });
  });

  it('calls refreshPokemons when refresh button is pressed', () => {
    const { getByTestId } = renderWithContext();
    const refreshButton = getByTestId('refresh-button');

    fireEvent.press(refreshButton);
    expect(mockRefreshPokemons).toHaveBeenCalled();
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

    fireEvent.press(getByTestId('pokemon-item-bulbasaur'));

    const modalContent = getByTestId('pokemon-modal-content');
    expect(within(modalContent).getByText('bulbasaur')).toBeTruthy();

    fireEvent.press(getByTestId('close-modal'));
    await waitFor(() => {
      expect(queryByTestId('pokemon-modal-content')).toBeNull();
    });
  });

  it('displays pokemons after loading them from the API', async () => {
    const { rerender, getByTestId, queryByText } = render(
      <PokemonContext.Provider
        value={{
          pokemons: [],
          loading: true,
          error: null,
          fetchMorePokemons: mockFetchMorePokemons,
          refreshPokemons: mockRefreshPokemons,
          hasMore: true,
        }}
      >
        <PokemonListScreen />
      </PokemonContext.Provider>,
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();

    rerender(
      <PokemonContext.Provider
        value={{
          pokemons: mockPokemons,
          loading: false,
          error: null,
          fetchMorePokemons: mockFetchMorePokemons,
          refreshPokemons: mockRefreshPokemons,
          hasMore: true,
        }}
      >
        <PokemonListScreen />
      </PokemonContext.Provider>,
    );

    await waitFor(() => {
      expect(queryByText('bulbasaur')).toBeTruthy();
      expect(queryByText('ivysaur')).toBeTruthy();
      expect(queryByText('charmander')).toBeTruthy();
    });
  });

  it('search engine filters the list when query changes', async () => {
    const { getByTestId, queryByText } = renderWithContext();

    fireEvent.changeText(getByTestId('search-input'), 'char');

    await waitFor(() => {
      expect(queryByText('bulbasaur')).toBeNull();
      expect(queryByText('ivysaur')).toBeNull();
      expect(queryByText('charmander')).toBeTruthy();
    });
  });
});
