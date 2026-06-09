import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import AddBookScreen from '../screens/AddBookScreen';
import ScreenList from '../screens/ScreenList';
import { styles } from '../styles/styles';

// IMPORTAMOS FIREBASE
import { signInWithPopup, signOut } from 'firebase/auth'; // 👈 IMPORTANTE: Engadido para Google
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db, googleProvider } from '../components/firebase';

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#25292e",
  backgroundGradientTo: "#25292e",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
  
  // O estado para gardar o usuario de Google
  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]); // Recarga os libros só cando o usuario inicia sesión

  // 1. CARGAR LIBROS DENDE FIREBASE (FILTRADOS POLO USUARIO)
  const loadBooks = async () => {
    if (!user) return;
    try {
      // 👈 Filtramos para traer só os libros que teñen o userId do usuario actual
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

  // 2. INICIAR E PECHAR SESIÓN CON GOOGLE
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

  // 3. ENGADIR UN LIBRO DIRECTAMENTE EN FIREBASE
  const addBook = async () => {
    console.log("Premeches o botón de gardar!");
    if (!title.trim() || !author.trim() || !country.trim()) {
      console.warn("Garda cancelada: Faltan campos.");
      return;
    }

    const newBook = { 
      title, 
      author, 
      year, 
      gender, 
      country, 
      toRead,
      userId: user.uid // 👈 CORRIXIDO: Agora usa 'user.uid' de forma segura
    };

    try {
      console.log("Intentando conectar con Firebase...");
      await addDoc(collection(db, "books"), newBook);
      console.log("Libro gardado con éxito!");
      
      await loadBooks();

      setTitle('');
      setAuthor('');
      setYear('2024');
      setGender('F');
      setCountry('');
      setToRead(false);
      setScreen('home');
    } catch (error) {
      console.error("Erro real ao gardar o libro:", error);
    }
  };

  // 4. BORRAR UN LIBRO DENDE FIREBASE
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

  // --- CONTROL DE PANTALLAS ---

  // 👈 SE NON HAI USUARIO, SE MOSTRA A PANTALLA DE LOGIN CON GOOGLE
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

  return (
    <View style={styles.homeContainer}>
      <Text style={[styles.title, { marginBottom: 10 }]}>Bookiest</Text>
      <Text style={{ marginBottom: 30, color: 'lightgray' }}>Ola, {user.displayName}!</Text>
      
      <Button title="Log Single Book" onPress={() => setScreen('add')} />
      <View style={{ height: 20 }} />
      <Button title="See My Books" onPress={() => setScreen('list')} />
      
      <View style={{ height: 60 }} />
      <Button title="Pechar sesión" color="red" onPress={logout} />
    </View>
  );
}
