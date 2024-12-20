// components/PokemonListItem.tsx
import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Pokemon } from '../types/pokemonTypes';

interface PokemonListItemProps {
  pokemon: Pokemon;
  onPress: () => void;
}

const PokemonListItem: React.FC<PokemonListItemProps> = ({
  pokemon,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={`pokemon-item-${pokemon.name}`} // Asignación correcta
    >
      {pokemon.sprites.front_default && (
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.image}
          testID={`pokemon-image-${pokemon.name}`} // Asignación correcta
        />
      )}
      <Text style={styles.name}>{pokemon.name}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(PokemonListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 }, // Sombra para iOS
    shadowOpacity: 0.25, // Sombra para iOS
    shadowRadius: 3.84, // Sombra para iOS
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
