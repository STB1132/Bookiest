import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StatsPanel from '../components/StatsPanel';

export default function ScreenList({
  books,
  deleteBook,
  toggleToRead,
  setScreen,
  styles,
  chartConfig,
  saveBooks,
  countryCounts,
  filterToRead,
  setFilterToRead
}) {

  const [searchQuery, setSearchQuery] = useState('');

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
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        let fileContent = '';

        // 1. Compatibilidad para WEB (Netlify)
        if (selectedFile.file) {
          fileContent = await selectedFile.file.text();
        } 
        // 2. Compatibilidad para Móvil (Expo Native)
        else if (selectedFile.uri) {
          fileContent = await FileSystem.readAsStringAsync(selectedFile.uri);
        }

        if (!fileContent) {
          console.error('No se pudo leer el archivo.');
          return;
        }

        const jsonBooks = JSON.parse(fileContent);

        if (Array.isArray(jsonBooks)) {
          // Asignamos un ID único a cada libro si no lo tiene
          const formattedBooks = jsonBooks.map((b, index) => ({
            ...b,
            id: b.id || `${Date.now()}-${index}`,
            toRead: typeof b.toRead === 'boolean' ? b.toRead : false,
          }));

          const updatedBooks = [...books, ...formattedBooks];
          saveBooks(updatedBooks);
        } else {
          alert('El archivo JSON debe contener un array [] de libros.');
        }
      }
    } catch (err) {
      console.error('Error al importar libros:', err);
      alert('Error al leer el archivo JSON.');
    }
  };


  const toggleBookStatus = (item) => {
    const realIndex = books.findIndex(b => b.id === item.id);
    if (realIndex !== -1) {
      toggleToRead(realIndex);
    }
  };

  const handleIndividualDelete = (item) => {
    const realIndex = books.findIndex(b => b.id === item.id);
    if (realIndex !== -1) {
      deleteBook(realIndex);
    }
  };

  return (
    <View style={styles.listMainContainer}>
      
      {/* Botón de volver */}
      <TouchableOpacity style={styles.backButtonFloatingWithBackground} onPress={() => setScreen('home')}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>
        
      {/* Menú de ferramentas superior */}
      <TouchableOpacity style={styles.topToolsButton} onPress={bulkUploadBooks}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
      </TouchableOpacity>

      <FlatList
        style={styles.container}
        data={filteredBooks}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        ListHeaderComponent={
          <View>
            <StatsPanel books={books} styles={styles} chartConfig={chartConfig} countryCounts={countryCounts} filterToRead={filterToRead} setFilterToRead={setFilterToRead} />
            <View style={styles.searchBarWrapper}>
              <View style={styles.searchBarInner}>
                <Ionicons name="search" size={20} color="#64748b" />
                <TextInput
                  style={styles.searchBarInput}
                  placeholder="Search title, author, country or year..."
                  placeholderTextColor="#64748b"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.booksFoundWrapper}>
              <Text style={styles.booksFoundText}>{filteredBooks.length} books found</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <View style={styles.bookListItemCard}>
              {/* Información do libro */}
              <View style={styles.bookInfoColumn}>
                <Text style={styles.bookListItemTitle}>{item.title}</Text>
                <Text style={styles.bookListItemSub}>{item.author} ({item.country})</Text>
                
                {/* Badge de estado (To Read / Read) */}
                <View style={item.toRead ? styles.badgeStateToRead : styles.badgeStateRead}>
                  <Text style={styles.badgeStateText}>
                    {item.toRead ? 'To Read' : 'Read'}
                  </Text>
                </View>
              </View>

              {/* Botóns de Estado e Borrar */}
              <View style={styles.listActionsWrapper}>
                
                {/* Botón de Estado */}
                <TouchableOpacity 
                  onPress={() => toggleBookStatus(item)}
                  style={item.toRead ? styles.actionBtnStatusToRead : styles.actionBtnStatusRead}
                >
                  <Ionicons 
                    name={item.toRead ? "book" : "checkmark-done-circle"} 
                    size={18} 
                    color={item.toRead ? "#5881f7" : "#fff"} 
                  />
                </TouchableOpacity>

                {/* Botón de Borrar */}
                <TouchableOpacity onPress={() => handleIndividualDelete(item)} style={styles.actionBtnDelete}>
                  <Ionicons name="trash-outline" size={18} color="#bc4141" />
                </TouchableOpacity>

              </View>
            </View>
          );
        }}
      />
    </View>
  );
}