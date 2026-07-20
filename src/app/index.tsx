import React, { useEffect, useState } from 'react';
// 1. Añadido ImageBackground al import
import { Button, Dimensions, ImageBackground, Text, TouchableOpacity, View } from 'react-native';

import watercolorBg1 from '../../assets/images/watercolor.png';
import AddBookScreen from '../screens/AddBookScreen';
import Clippings from '../screens/Clippings';
import ScreenList from '../screens/ScreenList';
import { styles } from '../styles/styles';

// IMPORTAMOS FIREBASE
import { signInWithPopup, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db, googleProvider } from '../components/firebase';

const screenWidth = Dimensions.get("window").width;

// 👈 CAMBIADO UNICAMENTE ISTO PARA O GRÁFICO CIRCULAR
const chartConfig = {
  backgroundGradientFrom: "#171a23", // Fondo azul escuro a xogo coas tarxetas
  backgroundGradientTo: "#171a23",
  color: (opacity = 1) => `rgba(0, 47, 167, ${opacity})`, // 👈 Círculo de progreso en Azul Klein puro (#002fa7)
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // 👈 Textos e porcentaxes en branco puro
  propsForLabels: {
    fontFamily: "sans-serif", // Cambia o Times New Roman por unha fonte limpa e moderna
  }
};

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
  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  // 1. CARGAR LIBROS DENDE FIREBASE
  const loadBooks = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "books"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const booksList = [];
      querySnapshot.forEach((doc) => {
        booksList.push({ ...doc.data(), id: doc.id });
      });
      setBooks(booksList);
    } catch (error) {
      console.error("Erro ao cargar libros dende Firebase:", error);
    }
  };

  // 2. AUTENTICACIÓN GOOGLE
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      console.log("Conectado como:", result.user.displayName);
    } catch (error) {
      console.error("Erro no login de Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setBooks([]);
    } catch (error) {
      console.error("Erro ao pechar sesión:", error);
    }
  };

  // 3. ENGADIR LIBRO
  const addBook = async () => {
    if (!title.trim() || !author.trim() || !country.trim()) return;

    const newBook = { 
      title, 
      author, 
      year, 
      gender, 
      country, 
      toRead,
      userId: user.uid 
    };

    try {
      await addDoc(collection(db, "books"), newBook);
      await loadBooks();
      setTitle('');
      setAuthor('');
      setYear('2024');
      setGender('F');
      setCountry('');
      setToRead(false);
      setScreen('home');
    } catch (error) {
      console.error("Erro ao gardar o libro:", error);
    }
  };

  // 4. BORRAR LIBRO
  const deleteBook = async (index) => {
    const bookToDelete = books[index];
    if (!bookToDelete.id) return;

    try {
      await deleteDoc(doc(db, "books", bookToDelete.id));
      setBooks(books.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Erro ao borrar o libro:", error);
    }
  };

  // 5. ACTUALIZAR ESTADO DE LER / PENDENTE
  const toggleToRead = async (index) => {
    const bookToUpdate = books[index];
    if (!bookToUpdate.id) return;

    const nuevoEstado = !bookToUpdate.toRead;

    try {
      const bookRef = doc(db, "books", bookToUpdate.id);
      await updateDoc(bookRef, { toRead: nuevoEstado });

      const updatedBooks = [...books];
      updatedBooks[index].toRead = nuevoEstado;
      setBooks(updatedBooks);
      
      console.log("Estado cambiado en Firebase!");
    } catch (error) {
      console.error("Erro ao cambiar o estado do libro:", error);
    }
  };

  const saveBooks = () => {
    loadBooks();
  };

  const yearsList = [];
  for (let i = 0; i <= 2030; i++) { yearsList.push(i.toString()); }

  const countryCounts = books.reduce((acc, book) => {
    const c = book.country || 'Unknown';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  // PANTALLA DE LOGIN
  if (!user) {
    return (
      <View style={[styles.homeContainer, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={[styles.title, { marginBottom: 10 }]}>Bookiest</Text>
        <Text style={{ marginBottom: 40, color: 'gray', textAlign: 'center' }}>
          Inicia sesión para poder xestionar a túa biblioteca persoal.
        </Text>
        <Button title="Iniciar sesión con Google" onPress={loginWithGoogle} />
      </View>
    );
  }

  // PANTALLA ENGADIR
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

  // PANTALLA LISTA
  if (screen === 'list') {
    return (
      <ScreenList
        books={books}
        deleteBook={deleteBook}
        toggleToRead={toggleToRead}
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

  // PANTALLA CLIPPINGS (KINDLE HIGHLIGHTS)
  if (screen === 'clippings') {
    return (
      <Clippings
        setScreen={setScreen}
        styles={styles}
        highlights={highlights}
        saveHighlights={setHighlights}
      />
    );
  }

  // MENU PRINCIPAL
  return (
    <View style={styles.homeContainer}>
      <Text style={[styles.title, { marginBottom: 10 }]}>Bookiest</Text>
      <Text style={{ marginBottom: 30, color: 'lightgray' }}>Ola, {user.displayName}!</Text>
      
      <TouchableOpacity 
        style={styles.watercolorButtonContainer} 
        activeOpacity={0.8}
        onPress={() => setScreen('add')}
      >
        <ImageBackground 
          source={watercolorBg1} 
          style={styles.watercolorButtonImage}
          resizeMode="cover"
        >
          <Text style={styles.watercolorButtonText}>Log Single Book</Text>
        </ImageBackground>
      </TouchableOpacity> 

      <TouchableOpacity 
        style={styles.watercolorButtonContainer} 
        activeOpacity={0.8}
        onPress={() => setScreen('list')}
      >
        <ImageBackground 
          source={watercolorBg1} 
          style={styles.watercolorButtonImage}
          resizeMode="cover"
        >
          <Text style={styles.watercolorButtonText}>See my books</Text>
        </ImageBackground>
      </TouchableOpacity> 

      <TouchableOpacity 
        style={styles.watercolorButtonContainer} 
        activeOpacity={0.8}
        onPress={() => setScreen('clippings')}
      >
        <ImageBackground 
          source={watercolorBg1} 
          style={styles.watercolorButtonImage}
          resizeMode="cover"
        >
          <Text style={styles.watercolorButtonText}>My highlights</Text>
        </ImageBackground>
      </TouchableOpacity> 

      <TouchableOpacity style={styles.secondaryButton} onPress={logout}>
        <Text style={styles.secondaryButtonText}>LogOut, dw :I</Text>
      </TouchableOpacity>

    </View>
  );
}