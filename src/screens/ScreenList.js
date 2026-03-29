import React from 'react';
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import StatsPanel from '../components/StatsPanel';

export default function ScreenList({
  books,
  deleteBook,
  setScreen,
  styles,
  chartConfig,
  saveBooks,
  countryCounts,
  filterToRead,      // Estado do filtro
  setFilterToRead    // Función para cambiar o filtro
}) {

  // 1. Lóxica de filtrado: filtramos os libros antes de renderizar
  const filteredBooks = filterToRead 
    ? books.filter(book => book.toRead === true) 
    : books;

  return (
    <View style={{ flex: 1, backgroundColor: '#25292e' }}>
        <TouchableOpacity 
        style={styles.backButtonFloating} 
        onPress={() => setScreen('home')}
        >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        
      <FlatList
        style={styles.container}
        data={filteredBooks} // Usamos a lista filtrada
        keyExtractor={(_, index) => index.toString()}

        // CABECEIRA: Gráficos + Botón de Filtro
        ListHeaderComponent={
        <View>
            <StatsPanel
            books={books}
            styles={styles}
            chartConfig={chartConfig}
            countryCounts={countryCounts} 
            />
            
            {/* Selector de Filtro */}
            <View style={{ paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#333', alignItems: 'center' }}>
            
            <TouchableOpacity 
                onPress={() => setFilterToRead(!filterToRead)}
                style={{
                backgroundColor: filterToRead ? "#8e41e5" : "#444",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                }}
            >
                <Text style={{ 
                color: '#fff', 
                fontSize: 12,      // <--- AQUÍ CONTROLAS O TAMAÑO
                fontWeight: 'bold',
                textAlign: 'center'
                }}>
                {filterToRead ? "Showing: TO READ 📖" : "Showing: ALL BOOKS 📚"}
                </Text>
            </TouchableOpacity>

            <Text style={{ color: '#888', fontSize: 10, textAlign: 'center', marginTop: 8 }}>
                {filteredBooks.length} books found
            </Text>
            </View>
        </View>
        }


       renderItem={({ item, index }) => {
  
        const showMenu = () => {
            Alert.alert(
            "Options", 
            `What do you want to do with "${item.title}"?`,
            [
                {
                text: item.toRead ? "Mark as Finished ✅" : "Mark to Read 📖",
                onPress: () => {
                    const updatedBooks = [...books];
                    // Buscamos o libro real por título (máis seguro que o index se hai filtros)
                    const realIndex = books.findIndex(b => b.title === item.title);
                    if (realIndex !== -1) {
                    updatedBooks[realIndex].toRead = !item.toRead;
                    saveBooks(updatedBooks); // Asegúrate de pasar saveBooks como prop
                    }
                }
                },
                {
                text: "Delete Book 🗑️",
                style: "destructive",
                onPress: () => deleteBook(index)
                },
                {
                text: "Cancel",
                style: "cancel"
                }
            ]
            );
        };

  return (
    <TouchableOpacity 
      style={styles.bookItemRow} 
      onLongPress={showMenu} // Tamén funciona deixando pulsado
      activeOpacity={0.7}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.bookTitle}>
          {item.title}{' '}
          {item.toRead && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>📖 TO READ</Text>
            </View>
          )}
        </Text>
        <Text style={styles.bookSub}>
          {item.author} ({item.gender}) - {item.country} - {item.year}
        </Text>
      </View>

      {/* Botón de tres puntos en lugar da X */}
      <TouchableOpacity onPress={showMenu} style={{ padding: 10 }}>
        <Text style={{ color: '#888', fontSize: 20, fontWeight: 'bold' }}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}}



        // PÉ DA LISTA
        ListFooterComponent={
          <View style={{ marginTop: 30, marginBottom: 60 }}>
            <Button title="Back to Home" onPress={() => setScreen('home')} />
          </View>
        }

        // Mensaxe se a lista está baleira
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#bbb' }}>No books found in this category.</Text>
          </View>
        }
      />
    </View>
  );
}
