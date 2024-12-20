import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PokemonContext } from '../context/PokemonContext';
import PokemonListItem from '../components/PokemonListItem';
import PokemonModal from '../components/PokemonModal';
import filterPokemons from '../utils/filterPokemons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pokemon } from '../types/pokemonTypes';

const PokemonListScreen: React.FC = () => {
  const {
    pokemons,
    loading,
    error,
    fetchMorePokemons,
    hasMore,
    refreshPokemons,
  } = useContext(PokemonContext)!;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const filteredPokemons = filterPokemons(pokemons, searchQuery);

  const handleLoadMore = () => {
    // Only load more if conditions are met
    if (!loading && hasMore && searchQuery === '') {
      fetchMorePokemons();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="search-input"
        />
      </SafeAreaView>

      {loading && pokemons.length === 0 && (
        <ActivityIndicator testID="loading-indicator" style={styles.loading} />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PokemonListItem
            pokemon={item}
            onPress={() => setSelectedPokemon(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={loading && pokemons.length > 0}
        onRefresh={refreshPokemons}
        ListFooterComponent={
          loading && hasMore && pokemons.length > 0 ? (
            <ActivityIndicator style={{ margin: 20 }} />
          ) : null
        }
      />

      <Modal visible={!!selectedPokemon} transparent animationType="slide">
        {selectedPokemon && (
          <PokemonModal
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={refreshPokemons}
        testID="refresh-button"
      >
        <Ionicons name="refresh" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default PokemonListScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  loading: {
    marginTop: 50,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#EE1515',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
