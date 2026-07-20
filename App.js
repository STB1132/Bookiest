import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// Importa aquí tu ScreenList si lo tienes en un archivo separado
import ScreenList from './ScreenList';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [books, setBooks] = useState([]);
  
  // Campos del formulario individual
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [country, setCountry] = useState('');

  // Cargar libros al iniciar
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      let data = null;
      if (Platform.OS === 'web') {
        data = localStorage.getItem('books');
      } else {
        data = await AsyncStorage.getItem('books');
      }

      if (data) {
        setBooks(JSON.parse(data));
      }
    } catch (err) {
      console.error('Error cargando libros:', err);
    }
  };

  const saveBooks = async (newBooks) => {
    try {
      // Formateamos para asegurar que TODOS los libros sean objetos válidos
      const formattedBooks = newBooks.map((b, index) => {
        if (typeof b === 'string') {
          return {
            id: `${Date.now()}-${index}`,
            title: b,
            author: 'Desconocido',
            country: 'Unknown',
            toRead: false,
          };
        }
        return {
          ...b,
          id: b.id ? b.id.toString() : `${Date.now()}-${index}`,
          title: b.title || 'Sin título',
          author: b.author || 'Desconocido',
          toRead: typeof b.toRead === 'boolean' ? b.toRead : false,
        };
      });

      // 1. Actualizar estado de React con copia nueva
      setBooks([...formattedBooks]);

      // 2. Guardar según plataforma (Web vs Native)
      const jsonString = JSON.stringify(formattedBooks);
      if (Platform.OS === 'web') {
        localStorage.setItem('books', jsonString);
      } else {
        await AsyncStorage.setItem('books', jsonString);
      }
    } catch (err) {
      console.error('Error guardando libros:', err);
    }
  };

  // Guardar un solo libro desde el formulario
  const handleAddSingleBook = () => {
    if (!title.trim()) return;

    const newBook = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim() || 'Autor Desconocido',
      country: country.trim() || 'Unknown',
      toRead: false,
      year: new Date().getFullYear().toString(),
    };

    const updatedBooks = [...books, newBook];
    saveBooks(updatedBooks);

    // Limpiar campos y volver
    setTitle('');
    setAuthor('');
    setCountry('');
    setScreen('list');
  };

  const deleteBook = (index) => {
    const updated = [...books];
    updated.splice(index, 1);
    saveBooks(updated);
  };

  const toggleToRead = (index) => {
    const updated = [...books];
    updated[index].toRead = !updated[index].toRead;
    saveBooks(updated);
  };

  // --- PANTALLAS ---

  if (screen === 'add') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Añadir un libro</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Título del libro *"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={author}
          onChangeText={setAuthor}
        />

        <TextInput
          style={styles.input}
          placeholder="País"
          value={country}
          onChangeText={setCountry}
        />

        <Button title="Guardar Libro" onPress={handleAddSingleBook} />
        <View style={{ marginTop: 10 }}>
          <Button title="Volver" onPress={() => setScreen('home')} color="#666" />
        </View>
      </View>
    );
  }

  if (screen === 'list') {
    return (
      <ScreenList
        books={books}
        deleteBook={deleteBook}
        toggleToRead={toggleToRead}
        setScreen={setScreen}
        styles={styles}
        saveBooks={saveBooks}
        filterToRead={false}
        setFilterToRead={() => {}}
      />
    );
  }

  // Pantalla Principal (Home)
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bookiest App</Text>
      <Button title="Log Book" onPress={() => setScreen('add')} />
      <View style={{ marginTop: 15 }}>
        <Button title="See My Books" onPress={() => setScreen('list')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  listMainContainer: { flex: 1, paddingTop: 40 },
  topToolsButton: { padding: 10, backgroundColor: '#3b82f6', alignSelf: 'flex-end', borderRadius: 8, marginBottom: 10 },
  backButtonFloatingWithBackground: { padding: 10, backgroundColor: '#64748b', borderRadius: 8, marginBottom: 10, alignSelf: 'flex-start' },
  searchBarWrapper: { paddingVertical: 10 },
  searchBarInner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 10 },
  searchBarInput: { flex: 1, padding: 10 },
  booksFoundWrapper: { marginVertical: 10 },
  booksFoundText: { fontWeight: '600', color: '#475569' },
  bookListItemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookListItemTitle: { fontWeight: 'bold', fontSize: 16 },
  bookListItemSub: { color: '#64748b' },
  badgeStateToRead: { backgroundColor: '#dbeafe', padding: 4, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start' },
  badgeStateRead: { backgroundColor: '#dcfce7', padding: 4, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start' },
  badgeStateText: { fontSize: 12, fontWeight: '600' },
  listActionsWrapper: { flexDirection: 'row', gap: 10 },
  actionBtnStatusToRead: { padding: 8, backgroundColor: '#e0e7ff', borderRadius: 6 },
  actionBtnStatusRead: { padding: 8, backgroundColor: '#22c55e', borderRadius: 6 },
  actionBtnDelete: { padding: 8, backgroundColor: '#fee2e2', borderRadius: 6 },
});