import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

import React, { useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

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


  const addBook = () => {
    if (!title.trim() || !author.trim()) return;
    const newBook = { title, author, year, gender };
    const updatedBooks = [...books, newBook];
    saveBooks(updatedBooks);
    setTitle(''); setAuthor(''); setYear('2024'); setGender('F');
    setScreen('home');
  };
  const deleteBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    saveBooks(updatedBooks);
  };

  const yearsList = [];
  for (let i = 0; i <= 2030; i++) { yearsList.push(i.toString()); }

  // --- ADD SCREEN ---
  if (screen === 'add') {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.title}>Log a Book</Text>
        <Text style={styles.label}>Book Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor="#666" />
        <Text style={styles.label}>Author</Text>
        <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Author" placeholderTextColor="#666" />
        <Text style={styles.label}>Year</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={year} onValueChange={setYear} style={styles.picker} itemStyle={styles.pickerItem}>
            {yearsList.map(y => <Picker.Item key={y} label={y} value={y} />)}
          </Picker>
        </View>
        <Text style={styles.label}>Author Gender</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker} itemStyle={styles.pickerItem}>
            <Picker.Item label="Female (F)" value="F" />
            <Picker.Item label="Male (M)" value="M" />
            <Picker.Item label="Non-Binary (NB)" value="NB" />
          </Picker>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button title="Save Book" onPress={addBook} />
          <View style={{ height: 10 }} />
          <Button title="Back" color="red" onPress={() => setScreen('home')} />
        </View>
      </View>
    );
  }

  // --- LIST & PLOTS SCREEN (CORRIXIDA) ---
  if (screen === 'list') {
    const pieData = [
      { name: "F", population: books.filter(b => b.gender === 'F').length, color: "#d6639d", legendFontColor: "#fff" },
      { name: "M", population: books.filter(b => b.gender === 'M').length, color: "#7e1395", legendFontColor: "#fff" },
      { name: "NB", population: books.filter(b => b.gender === 'NB').length, color: "#8e41e5", legendFontColor: "#fff" },
    ];

    const activeYears = [...new Set(books.map(b => b.year))].sort();
    const counts = activeYears.map(y => books.filter(b => b.year === y).length);
    const maxCount = counts.length > 0 ? Math.max(...counts) : 0;

    const lineData = {
      labels: activeYears.length > 0 ? activeYears : ["N/A"],
      datasets: [{
        data: counts.length > 0 ? counts : [0],
        color: (opacity = 1) => `rgba(142, 65, 229, ${opacity})`,
        strokeWidth: 2
      }]

    };

    return (
      <FlatList
        style={styles.container}
        data={books}
        keyExtractor={(_, index) => index.toString()}
        // CABECEIRA: Título + Gráficos (Substitúe ao ScrollView)
        ListHeaderComponent={
          <View>
            <View style={{ height: 20 }} />
            <Text style={styles.title}>My Books</Text>
            <View style={{ height: 10 }} />
            <Text style={styles.chartLabel}>Statistics</Text>
            <View style={styles.chartsRow}>
              <View style={styles.chartBox}>
                <Text style={styles.smallLabel}>Gender</Text>
                <PieChart
                  data={pieData}
                  width={screenWidth / 2 - 20}
                  height={150}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  hasLegend={true}
                  center={[5, 0]}
                  absolute
                />
              </View>
              <View style={styles.chartBox}>
                <Text style={styles.smallLabel}>Publishing year</Text>
                <LineChart
                  data={lineData}
                  width={screenWidth / 2-4}
                  withHorizontalLabels={false} 
                  height={170}
                  chartConfig={{ 
                    ...chartConfig, 
                    decimalPlaces: 0,
                    formatYLabel: (y) => (parseFloat(y) % 1 === 0 ? parseInt(y).toString() : "") 
                  }}
                  hidePointsAtIndex={
                    activeYears.map((_, i) => i).filter(i => 
                      i !== 0 && 
                      i !== Math.floor(activeYears.length / 2) && 
                      i !== activeYears.length - 1
                    )
                  }
                  segments={maxCount < 3 ? maxCount : 3}
                  fromZero={true}
                  bezier
                  withDots={true}
                  withInnerLines={false}
                  style={{ borderRadius: 10 }}
                  verticalLabelRotation={0} // keep y labels horizontal

                />
              </View>
            </View>
            <Text style={[styles.chartLabel, { marginTop: 40, marginBottom: 10 }]}>Book List</Text>
          </View>
        }
        // CORPO DA LISTA
        renderItem={({ item, index }) => (
        <View style={styles.bookItemRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookSub}>{item.author} ({item.gender}) - {item.year}</Text>
          </View>
          
          {/* BOTÓN DE BORRAR */}
          <View style={styles.deleteButton}>
            <Button 
              title="X" 
              color="#ff4444" 
              onPress={() => deleteBook(index)} 
      />
    </View>
  </View>
)}

        // PÉ DA LISTA
        ListFooterComponent={
          <View style={{ marginTop: 30, marginBottom: 50 }}>
            <Button title="Back to Home" onPress={() => setScreen('home')} />
          </View>
        }
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#25292e', padding: 20 },
  homeContainer: { flex: 1, backgroundColor: '#25292e', justifyContent: 'center', padding: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  label: { color: '#fff', marginTop: 10, fontWeight: '600' },
  chartLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  input: { borderWidth: 1, borderColor: '#555', color: '#fff', padding: 12, borderRadius: 8, marginTop: 5 },
  pickerWrapper: { backgroundColor: '#555', borderRadius: 20, marginVertical: 10, height: 55, justifyContent: 'center', overflow: 'hidden' },
  picker: { width: '100%' },
  pickerItem: { fontSize: 16, height: 40, color: '#000' },
  bookItem: { borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 10 },
  bookTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bookSub: { color: '#bbb', fontSize: 13 },
  chartsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  chartBox: { width: '48%', alignItems: 'center' },
  smallLabel: { color: '#fff', fontSize: 14, marginBottom: 5, fontWeight: 'bold' },
  bookItemRow: {
    flexDirection: 'row',     // Pon o texto e o botón un ao lado do outro
    alignItems: 'center',      // Centra verticalmente o botón co texto
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
  },
  deleteButton: {
    width: 40,                // Tamaño pequeno para o botón "X"
    marginLeft: 10,           // Espazo entre o texto e o botón
  },
});
