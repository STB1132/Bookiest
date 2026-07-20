import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      (book.title?.toLowerCase() || '').includes(query) ||
      (book.author?.toLowerCase() || '').includes(query) ||
      (book.country?.toLowerCase() || '').includes(query) ||
      (book.year?.toString() || '').includes(query) || 
      (book.readInYear?.toString() || '').includes(query)
    );
  });

    const bulkUploadBooks = async () => {
    console.log('Iniciando importación...');

    // --- SOLUCIÓN PARA WEB (Netlify) ---
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          const jsonBooks = JSON.parse(text);

          if (Array.isArray(jsonBooks)) {
            const formattedBooks = jsonBooks.map((b, index) => ({
              ...b,
              id: b.id || `${Date.now()}-${index}`,
              toRead: typeof b.toRead === 'boolean' ? b.toRead : false,
            }));

            const updatedBooks = [...books, ...formattedBooks];
            saveBooks(updatedBooks);
            alert(`¡Éxito! Se añadieron ${jsonBooks.length} libros.`);
          } else {
            alert('El archivo JSON debe ser una lista/array [] de libros.');
          }
        } catch (err) {
          console.error('Error al procesar el JSON en web:', err);
          alert('El archivo no es un JSON válido.');
        }
      };

      input.click(); // Abre el explorador de archivos directamente en la web
      return;
    }

    // --- SOLUCIÓN PARA MÓVIL (iOS / Android) ---
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const jsonBooks = JSON.parse(fileContent);

        if (Array.isArray(jsonBooks)) {
          const formattedBooks = jsonBooks.map((b, index) => ({
            ...b,
            id: b.id || `${Date.now()}-${index}`,
            toRead: typeof b.toRead === 'boolean' ? b.toRead : false,
          }));

          const updatedBooks = [...books, ...formattedBooks];
          saveBooks(updatedBooks);
        }
      }
    } catch (err) {
      console.error('Error en móvil:', err);
    }
  };

  // Busca estas funcións dentro de ScreenList.js e substitúeas por estas:
  const toggleBookStatus = (item) => {
    // En lugar de buscar o realIndex en local, pasámoslle o obxecto directo
    toggleToRead(item); 
  };

  const handleIndividualDelete = (item) => {
    // Pasámoslle o obxecto directo para identificalo polo seu ID único de Firebase
    deleteBook(item); 
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
                    color={item.toRead ? "#8b88d3" : "#fff"} 
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