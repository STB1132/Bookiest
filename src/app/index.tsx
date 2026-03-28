import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const [screen, setScreen] = useState('home');
  const [books, setBooks] = useState([]);

  // Form States
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('2024');
  const [gender, setGender] = useState('F');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await AsyncStorage.getItem('books');
    if (data) setBooks(JSON.parse(data));
  };

  const saveBooks = async (newBooks) => {
    await AsyncStorage.setItem('books', JSON.stringify(newBooks));
    setBooks(newBooks);
  };

  const addBook = () => {
    if (!title.trim() || !author.trim()) return;
    const newBook = { title, author, year, gender };
    const updatedBooks = [...books, newBook];
    saveBooks(updatedBooks);
    
    setTitle(''); setAuthor(''); setYear('2024'); setGender('F');
    setScreen('home');
  };

  const yearsList = [];
  for (let i = 0; i <= 2030; i++) { yearsList.push(i.toString()); }

  // --- ADD SCREEN ---
  if (screen === 'add') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Book Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor="#666" />

        <Text style={styles.label}>Author</Text>
        <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Author" placeholderTextColor="#666" />

        <Text style={styles.label}>Year</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={year} onValueChange={setYear}>
            {yearsList.map(y => <Picker.Item key={y} label={y} value={y} color="#000" />)}
          </Picker>
        </View>

        <Text style={styles.label}>Author Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={gender} onValueChange={setGender}>
            <Picker.Item label="Female (F)" value="F" color="#000" />
            <Picker.Item label="Male (M)" value="M" color="#000" />
            <Picker.Item label="Non-Binary (NB)" value="NB" color="#000" />
          </Picker>
        </View>

        <Button title="Save Book" onPress={addBook} />
        <View style={{ height: 10 }} />
        <Button title="Back" color="red" onPress={() => setScreen('home')} />
      </View>
    );
  }

  // --- LIST & PLOTS SCREEN ---
  if (screen === 'list') {
    // Data for Gender Chart
    const pieData = [
      { name: "F", population: books.filter(b => b.gender === 'F').length, color: "#d6639d", legendFontColor: "#fff" },
      { name: "M", population: books.filter(b => b.gender === 'M').length, color: "#7e1395", legendFontColor: "#fff" },
      { name: "NB", population: books.filter(b => b.gender === 'NB').length, color: "#8e41e5", legendFontColor: "#fff" },
    ];

    // Data for Year Chart
    const activeYears = [...new Set(books.map(b => b.year))].sort();
    const barData = {
      labels: activeYears.length > 0 ? activeYears : ["N/A"],
      datasets: [{ data: activeYears.length > 0 ? activeYears.map(y => books.filter(b => b.year === y).length) : [0] }]
    };

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
        <Text style={styles.title}>My Books</Text>

        <View style={styles.listWrapper}>
          <FlatList
            data={books}
            keyExtractor={(_, index) => index.toString()}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <View style={styles.bookItem}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookSub}>{item.author} ({item.gender}) - {item.year}</Text>
              </View>
            )}
          />
        </View>
        <Text style={styles.chartLabel}>Statistics</Text>

        {/* Contedor horizontal para os dous gráficos */}
        <View style={styles.chartsRow}>
          
          {/* Gráfico de Xénero (Esquerda) */}
          <View style={styles.chartBox}>
            <Text style={styles.smallLabel}>Gender</Text>
            <PieChart
              data={pieData}
              width={screenWidth / 2 - 20} // A metade da pantalla menos o marxe
              height={150}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              hasLegend={true}       // Quitamos a lenda de fóra
              center={[10, 0]}        // Centramos o círculo
              absolute                // Amosar números absolutos
            />
          </View>

          {/* Gráfico de Anos (Dereita) */}
          <View style={styles.chartBox}>
            <Text style={styles.smallLabel}>Years</Text>
            <BarChart
              data={barData}
              width={screenWidth / 2 - 20} // A metade da pantalla menos o marxe
              height={150}
              chartConfig={chartConfig}
              fromZero={true}
              withInnerLines={false} // Simplificamos para que se vexa ben pequeno
            />
          </View>
        </View>


        <View style={{ marginTop: 30 }}>
          <Button title="Back to Home" onPress={() => setScreen('home')} />
        </View>
      </ScrollView>
    );
  }

  // --- HOME SCREEN ---
  return (
    <View style={styles.homeContainer}>
      <Button title="Log Book" onPress={() => setScreen('add')} />
      <View style={{ height: 20 }} />
      <Button title="See My Books" onPress={() => setScreen('list')} />
    </View>
  );
}

// --- CONFIG & STYLES ---
const chartConfig = {
  backgroundGradientFrom: "#25292e",
  backgroundGradientTo: "#25292e",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#25292e', padding: 20 },
  homeContainer: { flex: 1, backgroundColor: '#25292e', justifyContent: 'center', padding: 40 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 20 },
  label: { color: '#fff', marginTop: 10, textAlign: 'center',fontWeight: '600' },
  chartLabel: { color: '#fff', marginTop: 10, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#555', color: '#fff', padding: 10, borderRadius: 8, marginTop: 5 },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 8, marginVertical: 10, height: 45, justifyContent: 'center', overflow: 'hidden' },
  listWrapper: { height: 300, backgroundColor: '#333', borderRadius: 12, padding: 15, marginBottom: 10 },
  bookItem: { borderBottomWidth: 1, borderBottomColor: '#444', paddingVertical: 10 },
  bookTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bookSub: { color: '#bbb', fontSize: 13 },
  chartsRow: {
    flexDirection: 'row',      // Esta é a clave para poñelos de lado
    justifyContent: 'space-between',
    marginTop: 20,
  },
  chartBox: {
    width: '48%',              // Cada gráfico ocupa case a metade
    alignItems: 'center',
  },
  smallLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },

});
