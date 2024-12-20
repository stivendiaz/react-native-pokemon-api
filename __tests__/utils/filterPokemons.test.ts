import filterPokemons from '../../utils/filterPokemons';
import { Pokemon } from '../../types/pokemonTypes';

describe('filterPokemons', () => {
  const mockPokemons: Pokemon[] = [
    {
      name: 'bulbasaur',
      weight: 69,
      height: 7,
      types: [
        {
          type: {
            name: 'grass',
            url: '',
          },
          slot: 0,
        },
        {
          type: {
            name: 'poison',
            url: '',
          },
          slot: 0,
        },
      ],
      sprites: { front_default: 'url-to-bulbasaur-image' },
    },
    {
      name: 'ivysaur',
      weight: 130,
      height: 10,
      types: [
        {
          type: {
            name: 'grass',
            url: '',
          },
          slot: 0,
        },
        {
          type: {
            name: 'poison',
            url: '',
          },
          slot: 0,
        },
      ],
      sprites: { front_default: 'url-to-ivysaur-image' },
    },
    {
      name: 'charmander',
      weight: 85,
      height: 6,
      types: [
        {
          type: {
            name: 'fire',
            url: '',
          },
          slot: 0,
        },
      ],
      sprites: { front_default: 'url-to-charmander-image' },
    },
  ];

  it('returns all pokemons if query is empty', () => {
    const result = filterPokemons(mockPokemons, '');
    expect(result).toHaveLength(3);
  });

  it('filters pokemons by name (case-insensitive)', () => {
    const result = filterPokemons(mockPokemons, 'IVY');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('ivysaur');
  });

  it('returns empty array if no match is found', () => {
    const result = filterPokemons(mockPokemons, 'xyz');
    expect(result).toHaveLength(0);
  });
});
