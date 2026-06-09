import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StatsPanel from '../components/StatsPanel';

export default function ScreenList({
  books,
  deleteBook,
  toggleToRead, // 👈 1. RECUPERAMOS A NOVA FUNCIÓN DAS PROPIEDADES
  setScreen,
  styles,
  chartConfig,
  saveBooks,
  countryCounts,
  filterToRead,
  setFilterToRead
}) {

  const [searchQuery, setSearchQuery] = useState('');

  // Lóxica de filtrado protexida contra valores baleiros
  const filteredBooks = books.filter(book => {
    const matchesToRead = filterToRead ? book.toRead === true : true;
    if (!matchesToRead) return false;

    const query = searchQuery.toLowerCase();
    if (!query) return true;

    return (
      (book.title?.toLowerCase().includes(query) || false) ||
      (book.author?.toLowerCase().includes(query) || false) ||
      (book.country?.toLowerCase().includes(query) || false) ||
      (book.year?.toString().includes(query) || false) || 
      (book.readInYear?.toString().includes(query) || false)
    );
  });


  const bulkUploadBooks = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (!result.canceled) {
        const fileUri = result.assets.uri; 
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const jsonBooks = JSON.parse(fileContent);
        if (Array.isArray(jsonBooks)) {
          const updatedBooks = [...books, ...jsonBooks];
          saveBooks(updatedBooks);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // 👈 2. CORRIXIDO: Buscamos a posición real do libro e avisamos a Firebase
  const toggleBookStatus = (item) => {
    const realIndex = books.findIndex(b => b.id === item.id); // Buscamos polo ID único de Firebase
    if (realIndex !== -1) {
      toggleToRead(realIndex); // Chamamos á función da nube
    }
  };

  const handleIndividualDelete = (item) => {
    const realIndex = books.findIndex(b => b.id === item.id); // Buscamos polo ID único de Firebase
    if (realIndex !== -1) {
      deleteBook(realIndex);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#25292e' }}>
      {/* Botón de volver */}
      <TouchableOpacity style={styles.backButtonFloating} onPress={() => setScreen('home')}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>←</Text>
      </TouchableOpacity>
        
      {/* Menú de ferramentas superior */}
      <TouchableOpacity 
        style={{
          position: 'absolute', top: 50, right: 20, zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'
        }} 
        onPress={bulkUploadBooks}
      >
        <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
      </TouchableOpacity>

      <FlatList
        style={styles.container}
        data={filteredBooks}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Usamos o ID único de Firebase para a lista
        ListHeaderComponent={
          <View>
            <StatsPanel books={books} styles={styles} chartConfig={chartConfig} countryCounts={countryCounts} filterToRead={filterToRead} setFilterToRead={setFilterToRead} />
            <View style={{ paddingHorizontal: 20, marginTop: 0 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#1a1d21', 
                borderRadius: 12, 
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#333'
              }}>
                <Ionicons name="search" size={18} color="#666" />
                <TextInput
                  style={{
                    flex: 1,
                    color: '#fff',
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    fontSize: 14
                  }}
                  placeholder="Search title, author, country or year..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={{ paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#333', alignItems: 'center' }}>
              <Text style={{ color: '#888', fontSize: 12, marginTop: 8 }}>{filteredBooks.length} books found</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1a1d21',
              padding: 15,
              marginVertical: 5,
              marginHorizontal: 20,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#333',
              zIndex: 5
            }}>
              {/* Información do libro */}
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: '#aaa', fontSize: 14 }}>{item.author} ({item.country})</Text>
                <Text style={{ color: item.toRead ? '#ff9f43' : '#8e41e5', fontSize: 12, marginTop: 4, fontWeight: '600' }}>
                  {item.toRead ? 'To Read' : 'Read'}
                </Text>
              </View>

              {/* Botóns de Estado e Borrar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 20 }}>
                
                <TouchableOpacity 
                  onPress={() => toggleBookStatus(item)}
                  style={{ 
                    padding: 10, 
                    backgroundColor: item.toRead ? 'rgba(255, 159, 67, 0.15)' : 'rgba(142, 65, 229, 0.15)', 
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: item.toRead ? '#ff9f43' : '#8e41e5'
                  }}
                >
                  <Ionicons 
                    name={item.toRead ? "book-outline" : "checkmark-done-circle"} 
                    size={18} 
                    color={item.toRead ? "#ff9f43" : "#8e41e5"} 
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleIndividualDelete(item)}
                  style={{ 
                    padding: 10, 
                    backgroundColor: 'rgba(234, 32, 39, 0.1)', 
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(234, 32, 39, 0.4)'
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#ea2027" />
                </TouchableOpacity>

              </View>
            </View>
          );
        }}
      />
    </View>
  );
}