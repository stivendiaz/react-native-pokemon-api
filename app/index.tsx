import React from 'react';
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
import { useContext } from 'react';
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
    fetchPokemons,
  } = useContext(PokemonContext)!;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPokemon, setSelectedPokemon] = React.useState<Pokemon | null>(null);

  const filteredPokemons = filterPokemons(pokemons, searchQuery);

  return (
    <View style={styles.container}>
      {/* Barra de Búsqueda dentro de SafeAreaView */}
      <SafeAreaView>
        <TextInput
          style={styles.searchInput}
          placeholder="Search a Pokemon..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="search-input"
        />
      </SafeAreaView>

      {/* Indicador de Carga */}
      {loading && <ActivityIndicator testID="loading-indicator" style={styles.loading} />}

      {/* Mensaje de Error */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Lista de Pokémon */}
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
      />

      {/* Modal para Mostrar Detalles del Pokémon Seleccionado */}
      <Modal visible={!!selectedPokemon} transparent animationType="slide">
        {selectedPokemon && (
          <PokemonModal
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </Modal>

      {/* Botón Flotante para Refrescar la Lista de Pokémon */}
      <TouchableOpacity
        style={styles.fab}
        onPress={fetchPokemons}
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
