import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Pokemon } from '../types/pokemonTypes';

interface PokemonModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, onClose }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent} testID="pokemon-modal-content">
        {pokemon.sprites.front_default && (
          <Image
            testID={`pokemon-image-${pokemon.name}`}
            style={styles.largeImage}
            source={{ uri: pokemon.sprites.front_default }}
          />
        )}
        <Text style={styles.title}>{pokemon.name}</Text>
        <Text>Weight: {pokemon.weight}</Text>
        <Text>Height: {pokemon.height}</Text>
        <Text>Types: {pokemon.types.map((t) => t.type.name).join(', ')}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-modal">
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PokemonModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  largeImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#EE1515',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
