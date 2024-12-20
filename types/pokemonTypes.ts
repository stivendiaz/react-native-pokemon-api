export interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonSprites {
    front_default: string | null;
    [key: string]: any;
  }
  
  export interface Pokemon {
    name: string;
    url?: string;
    sprites: PokemonSprites;
    weight: number;
    height: number;
    types: PokemonType[];
  }
  
  export interface PokemonAPIResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
      name: string;
      url: string;
    }>;
  }
  