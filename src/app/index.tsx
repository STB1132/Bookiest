import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import AddBookScreen from '../screens/AddBookScreen';
import Clippings from '../screens/Clippings';
import ScreenList from '../screens/ScreenList';
import { styles } from '../styles/styles';

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const [screen, setScreen] = useState('home');
  const [books, setBooks] = useState([]);
  const [filterToRead, setFilterToRead] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('2024');
  const [gender, setGender] = useState('F');
  const [country, setCountry] = useState('');
  const [toRead, setToRead] = useState(false);
  const [highlights, setHighlights] = useState([]);

  // Cargar libros e recortes ao iniciar dende o localStorage da web
  useEffect(() => {
    loadBooks();
    loadHighlights();
  }, []);

  // CORRECCIÓN WEB: Lectura instantánea sen "async" nin "await"
  const loadBooks = () => {
    const data = localStorage.getItem('books');
    if (data) setBooks(JSON.parse(data));
  };

  const loadHighlights = () => {
    const data = localStorage.getItem('my_highlights');
    if (data) setHighlights(JSON.parse(data));
  };

  const updateBooksList = (newList) => {
    saveBooks(newList);
  };

  // CORRECCIÓN WEB: Gardado directo no navegador sen "async"
  const saveBooks = (newBooks) => {
    localStorage.setItem('books', JSON.stringify(newBooks));
    setBooks(newBooks);
  };

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

  const deleteBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    saveBooks(updatedBooks);
  };

  const yearsList = [];
  for (let i = 0; i <= 2030; i++) { yearsList.push(i.toString()); }

  const countryCounts = books.reduce((acc, book) => {
    const c = book.country || 'Unknown';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  // CORRECCIÓN WEB: Gardar os recortes no localStorage limpo
  const saveHighlights = (newHighlights) => {
    setHighlights(newHighlights);
    try {
      localStorage.setItem('my_highlights', JSON.stringify(newHighlights));
    } catch (e) {
      console.error("Error: Non se puideron gardar os recortes");
    }
  };

  // --- Screens ---
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

  if (screen === 'clippings') {
    return (
      <Clippings 
        setScreen={setScreen} 
        styles={styles} 
        highlights={highlights}       
        saveHighlights={saveHighlights} 
      />
    );
  }

  if (screen === 'list') {
    return (
      <ScreenList
        books={books}
        deleteBook={deleteBook}
        setScreen={setScreen}
        styles={styles}
        countryCounts={countryCounts}
        chartConfig={chartConfig}
        filterToRead={filterToRead}
        setFilterToRead={setFilterToRead}
        saveBooks={saveBooks} 
      />
    );
  }

  // --- Home screen ---
  return (
    <View style={styles.homeContainer}>
      <Text style={[styles.title, { marginBottom: 40 }]}>Bookiest</Text>
      
      <Button title="Log Single Book" onPress={() => setScreen('add')} />
      <View style={{ height: 20 }} />
      
      <Button title="See My Books" onPress={() => setScreen('list')} />
      <View style={{ height: 20 }} />
      
      <Button title="ReadWise" onPress={() => setScreen('clippings')} />
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#25292e",
  backgroundGradientTo: "#25292e",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};