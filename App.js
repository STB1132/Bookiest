import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [books, setBooks] = useState([]);
  const [input, setInput] = useState('');

  // Load books on start
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await AsyncStorage.getItem('books');
    if (data) {
      setBooks(JSON.parse(data));
    }
  };

  const saveBooks = async (newBooks) => {
    await AsyncStorage.setItem('books', JSON.stringify(newBooks));
    setBooks(newBooks);
  };

  const addBook = () => {
    if (!input.trim()) return;
    const newBooks = [...books, input];
    saveBooks(newBooks);
    setInput('');
    setScreen('home');
  };

  // --- UI SCREENS ---

  if (screen === 'add') {
    return (
      <View style={styles.container}>
        <Text>Add a Book</Text>
        <TextInput
          style={styles.input}
          placeholder="Book title"
          value={input}
          onChangeText={setInput}
        />
        <Button title="Save" onPress={addBook} />
        <Button title="Back" onPress={() => setScreen('home')} />
      </View>
    );
  }

  if (screen === 'list') {
    return (
      <View style={styles.container}>
        <Text>My Books</Text>
        <FlatList
          data={books}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>{item}</Text>}
        />
        <Button title="Back" onPress={() => setScreen('home')} />
      </View>
    );
  }

  // Home screen
  return (
    <View style={styles.container}>
      <Button title="Log Book" onPress={() => setScreen('add')} />
      <Button title="See My Books" onPress={() => setScreen('list')} />
    </View>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
});