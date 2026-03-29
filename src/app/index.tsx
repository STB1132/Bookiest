import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import AddBookScreen from '../screens/AddBookScreen';
import ScreenList from '../screens/ScreenList';
import { styles } from '../styles/styles';


const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const [screen, setScreen] = useState('home');
  const [books, setBooks] = useState([]);


  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await AsyncStorage.getItem('books');
    if (data) setBooks(JSON.parse(data));
  };
 // ... dentro de export default function Index() ...
 const [filterToRead, setFilterToRead] = useState(false); // Estado para o filtro

  // Conta de libros por país
  const countryCounts = books.reduce((acc, book) => {
    const c = book.country || 'Unknown';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const updateBooksList = (newList) => {
  saveBooks(newList);
  };

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('2024');
  const [gender, setGender] = useState('F');
  const [country, setCountry] = useState('');
  const [toRead, setToRead] = useState(false);

  const addBook = () => {
    if (!title.trim() || !author.trim() || !country.trim()) return;

    const newBook = { title, author, year, gender, country, toRead };
    const updatedBooks = [...books, newBook];

    saveBooks(updatedBooks);

    setTitle('');
    setAuthor('');
    setYear('2024');
    setGender('F');
    setCountry('');
    setToRead(false);

    setScreen('home');
  };

  const maxBooksByCountry = Math.max(...Object.values(countryCounts), 1);



  // Función para xerar o gradiente (Lila)
  const getCountryColor = (count) => {
    if (!count) return '#333'; // Gris se non hai libros
    const opacity = count / maxBooksByCountry;
    return `rgba(142, 65, 229, ${0.2 + opacity * 0.8})`; // Gradiente lila
  };
  const mapData = Object.keys(countryCounts).map(countryCode => ({
    code: countryCode.toUpperCase(), // Ex: "ES", "US", "FR"
    value: countryCounts[countryCode],
  }));

  const saveBooks = async (newBooks) => {
    await AsyncStorage.setItem('books', JSON.stringify(newBooks));
    setBooks(newBooks);
  };


  const bulkUploadBooks = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      // Accedemos á URI do primeiro elemento seleccionado
      const fileUri = result.assets[0].uri; 
      
      // Lemos o contido usando a API Legacy (sen o aviso de deprecated)
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      
      const jsonBooks = JSON.parse(fileContent);
      
      if (Array.isArray(jsonBooks)) {
        const updatedBooks = [...books, ...jsonBooks];
        saveBooks(updatedBooks);
        alert('Success: ' + jsonBooks.length + ' books added!');
      } else {
        alert('Error: JSON must be a list []');
      }
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
  

  const deleteBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    saveBooks(updatedBooks);
  };

  const yearsList = [];
  for (let i = 0; i <= 2030; i++) { yearsList.push(i.toString()); }

  // --- Pantalla de engadir os libros ---
  if (screen === 'add') {
  return (
    <AddBookScreen
      title={title}
      setTitle={setTitle}
      author={author}
      setAuthor={setAuthor}
      country={country}
      setCountry={setCountry}
      year={year}
      setYear={setYear}
      gender={gender}
      setGender={setGender}
      toRead={toRead}
      setToRead={setToRead}
      yearsList={yearsList}
      addBook={addBook}
      setScreen={setScreen}
      styles={styles}
    />
  );
}

  // --- Pantalla da lista de libros ---
  if (screen === 'list') {
    return (
      <ScreenList
        books={books}
        deleteBook={deleteBook}
        setScreen={setScreen}
        styles={styles}
        countryCounts={countryCounts} // <--- PASA ESTA PROP
        chartConfig={chartConfig}
        filterToRead={filterToRead}      // <--- Novo
        setFilterToRead={setFilterToRead} // <--- Novo
        updateBooksList={updateBooksList} 
        saveBooks={saveBooks} 
      />
    );
  }

  return (
    <View style={styles.homeContainer}>
      <Text style={[styles.title, { marginBottom: 40 }]}>Bookiest</Text>
      <Button title="Log Single Book" onPress={() => setScreen('add')} />
      <View style={{ height: 20 }} />
      <Button title="See My Books" onPress={() => setScreen('list')} />
      <View style={{ height: 20 }} />
      <Button title="Bulk Upload (JSON)"  onPress={bulkUploadBooks} />
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#25292e",
  backgroundGradientTo: "#25292e",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};


