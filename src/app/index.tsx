import React, { useEffect, useState } from 'react';
// 1. Añadido Button y SafeAreaView desde 'react-native'
import { Button, Dimensions, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import watercolorBg1 from '../../assets/images/watercolor.png';
import watercolorBg2 from '../../assets/images/watercolor2.png';
import watercolorBg3 from '../../assets/images/watercolor3.png';
import AddBookScreen from '../screens/AddBookScreen';
import Clippings from '../screens/Clippings';
import ScreenList from '../screens/ScreenList';
import { styles } from '../styles/styles';

// IMPORTAMOS FIREBASE
import { signInWithPopup, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db, googleProvider } from '../components/firebase';

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#171a23",
  backgroundGradientTo: "#171a23",
  color: (opacity = 1) => `rgba(0, 47, 167, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  propsForLabels: {
    fontFamily: "sans-serif",
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

  const addBook = async () => {
    // CORRECCIÓN: Se falta o país, avisamos cun alert no canto de saír en silencio
    if (!title.trim() || !author.trim()) {
      alert("O título e o autor son obrigatorios.");
      return;
    }
    
    if (!country.trim()) {
      alert("Por favor, selecciona un país da lista de suxestións.");
      return;
    }

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
      await loadBooks(); // Recarga a lista dende Firebase ao instante
      
      // Limpar o formulario
      setTitle('');
      setAuthor('');
      setYear('2024');
      setGender('F');
      setCountry('');
      setToRead(false);
      
      // Volvemos ao menú principal
      setScreen('home');
    } catch (error) {
      console.error("Erro ao gardar o libro en Firebase:", error);
      alert("Erro de conexión con Firebase ao gardar.");
    }
  };


 // Substitúe estas dúas funcións no teu index.js:

const deleteBook = async (bookObject) => {
  if (!bookObject || !bookObject.id) return;

  try {
    // Borramos en Firebase usando o ID único directamente
    await deleteDoc(doc(db, "books", bookObject.id));
    
    // Filtramos o estado local eliminando o libro que coincida con ese ID
    setBooks(books.filter((b) => b.id !== bookObject.id));
  } catch (error) {
    console.error("Erro ao borrar o libro:", error);
  }
};

const toggleToRead = async (bookObject) => {
  if (!bookObject || !bookObject.id) return;

  const nuevoEstado = !bookObject.toRead;

  try {
    const bookRef = doc(db, "books", bookObject.id);
    await updateDoc(bookRef, { toRead: nuevoEstado });

    // Actualizamos o estado en local de forma limpa buscando polo ID
    const updatedBooks = books.map((b) => {
      if (b.id === bookObject.id) {
        return { ...b, toRead: nuevoEstado };
      }
      return b;
    });
    
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0e14' }}>
      <ScrollView 
        contentContainerStyle={[styles.homeContainer, { flexGrow: 1, paddingVertical: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { marginBottom: 10 }]}>Bookiest</Text>
        <Text style={{ marginBottom: 30, color: 'lightgray', textAlign: 'center' }}>
          Ola, {user.displayName}!
        </Text>
        
        <TouchableOpacity 
          style={styles.watercolorButtonContainer} 
          activeOpacity={0.8}
          onPress={() => setScreen('add')}
        >
          <ImageBackground 
            source={watercolorBg2} 
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
            source={watercolorBg3} 
            style={styles.watercolorButtonImage}
            resizeMode="cover"
          >
            <Text style={styles.watercolorButtonText}>My highlights</Text>
          </ImageBackground>
        </TouchableOpacity> 

        <TouchableOpacity 
          style={[styles.secondaryButton, { width: '100%' }]} 
          onPress={logout}
        >
          <Text style={styles.secondaryButtonText}>LogOut, dw :I</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}