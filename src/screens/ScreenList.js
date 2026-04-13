import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StatsPanel from '../components/StatsPanel';

export default function ScreenList({
  books,
  deleteBook,
  setScreen,
  styles,
  chartConfig,
  saveBooks,
  countryCounts,
  filterToRead,
  setFilterToRead
}) {

 const [searchQuery, setSearchQuery] = useState('');
  // 1. Lóxica de filtrado
 const filteredBooks = books.filter(book => {
  // Primeiro aplicamos o filtro de "To Read" que xa tiñas
  const matchesToRead = filterToRead ? book.toRead === true : true;
  if (!matchesToRead) return false;

  const query = searchQuery.toLowerCase();
  
  // Se non hai busca, amosamos todos
  if (!query) return true;

  // Lóxica de busca en múltiples campos:
  return (
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.country.toLowerCase().includes(query) ||
    book.year?.toString().includes(query) || // Busca por ano de publicación
    (book.readInYear?.toString().includes(query)) // Busca por ano de lectura (o que gardamos antes)
  );
});


  // --- ENGADE ESTO AQUÍ (DAQUÍ SAEN AS VARIABLES QUE FALTAN) ---
  const currentYear = new Date().getFullYear();
  const readThisYear = books.filter(book => !book.toRead && parseInt(book.year) === currentYear).length;
  const leftInSprint = books.filter(book => book.toRead === true).length;


  // 2. Estados para Selección
  const [selectedIndices, setSelectedIndices] = useState([]);
  const isSelectionMode = selectedIndices.length > 0;

  const toggleSelect = (index) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const deleteSelected = () => {
    Alert.alert(
      "Delete Selection",
      `Are you sure you want to delete ${selectedIndices.length} books?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            // Filter original list removing those that match with index on the filter list
            const booksToRemove = selectedIndices.map(i => filteredBooks[i]);
            const updatedBooks = books.filter(b => !booksToRemove.includes(b));
            
            saveBooks(updatedBooks);
            setSelectedIndices([]);
          } 
        }
      ]
    );
  };


  const bulkUploadBooks = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (!result.canceled) {
        const fileUri = result.assets[0].uri; 
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const jsonBooks = JSON.parse(fileContent);
        if (Array.isArray(jsonBooks)) {
          const updatedBooks = [...books, ...jsonBooks];
          saveBooks(updatedBooks);
          Alert.alert('Success', jsonBooks.length + ' books added!');
        }
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };



  const handleExportJSON = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "my_books_backup.json";
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(books, null, 2));
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert("Error", "Could not export data.");
    }
  };

  const showGlobalMenu = () => {
    const options = [
      { text: "Upload JSON (Import)", onPress: bulkUploadBooks },
      { text: "Download JSON (Export)", onPress: handleExportJSON },
    ];

    if (isSelectionMode) {
      options.push({ text: "🗑️ Delete Selected", onPress: deleteSelected, style: 'destructive' });
      options.push({ text: "Clear Selection", onPress: () => setSelectedIndices([]) });
    } else {
      options.push({ 
        text: "✅ Select Books", 
        onPress: () => { if (filteredBooks.length > 0) setSelectedIndices([0]); } 
      });
    }

    options.push({ text: "Cancel", style: "cancel" });
    Alert.alert("Database Actions", "Choose an option:", options);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#25292e' }}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButtonFloating} onPress={() => setScreen('home')}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>←</Text>
      </TouchableOpacity>
        
      {/* Home menu button */}
      <TouchableOpacity 
        style={{
          position: 'absolute', top: 50, right: 20, zIndex: 10,
          backgroundColor: isSelectionMode ? "#8e41e5" : "rgba(0,0,0,0.5)",
          width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'
        }} 
        onPress={showGlobalMenu}
      >
        {isSelectionMode ? (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{selectedIndices.length}</Text>
        ) : (
          <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
        )}
      </TouchableOpacity>

      <FlatList
        style={styles.container}
        data={filteredBooks}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={
          <View>
            <StatsPanel books={books} styles={styles} chartConfig={chartConfig} countryCounts={countryCounts }   filterToRead={filterToRead} setFilterToRead={setFilterToRead} />
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
                  clearButtonMode="while-editing" // Só para iOS, engade unha 'X' para borrar
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* O teu botón de filtrado actual mantense debaixo */}
            <View style={{ paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#333', alignItems: 'center' }}>
              <Text style={{ color: '#888', fontSize: 12, marginTop: 8 }}>{filteredBooks.length} books found</Text>
            </View>
          </View>
        }

        renderItem={({ item, index }) => {
          const isSelected = selectedIndices.includes(index);

          const showIndividualMenu = () => {
            Alert.alert(
              "Options", `What to do with "${item.title}"?`,
              [
                // Dentro de renderItem -> showIndividualMenu
                {
                  text: item.toRead ? "Mark as Finished ✅" : "Mark to Read 📖",
                  onPress: () => {
                    const updatedBooks = [...books];
                    // Buscamos o libro pola súa referencia única (neste caso título)
                    const realIndex = books.findIndex(b => b.title === item.title);
                    
                    if (realIndex !== -1) {
                      const finishingNow = item.toRead; // Se estaba en "To Read" e prememos, é que o rematamos
                      
                      updatedBooks[realIndex] = {
                        ...updatedBooks[realIndex],
                        toRead: !item.toRead,
                        // Engadimos ou actualizamos o ano de lectura se o estamos rematando
                        readInYear: finishingNow ? new Date().getFullYear() : updatedBooks[realIndex].readInYear
                      };

                      saveBooks(updatedBooks);
                    }
                  }
                },

                { text: "Delete Book 🗑️", style: "destructive", onPress: () => deleteBook(index) },
                { text: "Cancel", style: "cancel" }
              ]
            );
          };

          return (
            <TouchableOpacity 
              style={[
                styles.bookItemRow, 
                isSelected && { backgroundColor: 'rgba(142, 65, 229, 0.2)', borderColor: '#8e41e5', borderWidth: 1 }
              ]} 
              onPress={() => isSelectionMode ? toggleSelect(index) : showIndividualMenu()}
              onLongPress={() => toggleSelect(index)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {isSelectionMode && (
                  <Ionicons 
                    name={isSelected ? "checkbox" : "square-outline"} 
                    size={22} color={isSelected ? "#8e41e5" : "#666"} style={{ marginRight: 12 }} 
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookTitle}>
                    {item.title}{' '}
                    {item.toRead && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>📖 TO READ</Text>
                      </View>
                    )}
                  </Text>
                  <Text style={styles.bookSub}>{item.author}  ({item.country}) {item.year}</Text>
                </View>
              </View>
              {!isSelectionMode && (
                <TouchableOpacity onPress={showIndividualMenu} style={{ padding: 10 }}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#888" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <View style={{ marginTop: 30, marginBottom: 60 }}>
            <Button title="Back to Home" onPress={() => setScreen('home')} />
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#bbb' }}>No books found.</Text>
          </View>
        }
      />
    </View>
  );
}
