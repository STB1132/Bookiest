import { Picker } from '@react-native-picker/picker';
import { Button, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COUNTRY_DATA } from '../constants/countries'; // Revisa que a ruta sexa exacta


import { useState } from 'react';



export default function AddBookScreen({
  title, setTitle,
  author, setAuthor,
  country, setCountry,
  year, setYear,
  gender, setGender,
  toRead, setToRead,
  yearsList,
  addBook,
  setScreen,
  styles,
}) {


const [searchText, setSearchText] = useState('');
const [showSuggestions, setShowSuggestions] = useState(false);
const filteredCountries = COUNTRY_DATA.filter(item => 
  item.label.toLowerCase().includes(searchText.toLowerCase()) ||
  item.value.toLowerCase().includes(searchText.toLowerCase())
);
  return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      
      <Text style={styles.title}>Log a Book</Text>

      <Text style={styles.label}>Book Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Author</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Author"
        placeholderTextColor="#666"
      />
                {/* Contedor con ZIndex alto para que o menú non quede debaixo doutros inputs */}
        <View style={{ zIndex: 3000, position: 'relative', marginBottom: 15 }}>
        <Text style={styles.label}>Country</Text>
        
        <TextInput
            style={styles.input}
            placeholder="Search country (e.g. Spain...)"
            placeholderTextColor="#777"
            value={searchText}
            onChangeText={(text) => {
            setSearchText(text);
            setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
        />

        {/* MENÚ DESPREGABLE */}
        {showSuggestions && searchText.length > 0 && (
            <View style={styles.suggestionsContainer}>
            <ScrollView 
                style={{ maxHeight: 200 }} 
                keyboardShouldPersistTaps="handled" // Importante para que o toque funcione co teclado aberto
            >
                {filteredCountries.map((item) => (
                <TouchableOpacity 
                    key={item.value} 
                    style={styles.suggestionItem}
                    onPress={() => {
                    setCountry(item.value);
                    setSearchText(item.label);
                    setShowSuggestions(false);
                    }}
                >
                    <Text style={styles.suggestionText}>{item.label}</Text>
                </TouchableOpacity>
                ))}
                {filteredCountries.length === 0 && (
                <View style={styles.suggestionItem}>
                    <Text style={{ color: '#888', fontStyle: 'italic' }}>No countries found</Text>
                </View>
                )}
            </ScrollView>
            </View>
        )}
        </View>



      <Text style={styles.label}>Year</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={year}
          onValueChange={setYear}
          style={styles.picker}
        >
          {yearsList.map(y => (
            <Picker.Item key={y} label={y} value={y} />
          ))}
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
      </View>

      <Text style={styles.label}>To Read?</Text>
      <View style={{ marginTop: 10 }}></View>
      <Switch value={toRead} onValueChange={setToRead} />
      <View style={{ marginTop: 20 }}>

      </View>

      <Button title="Save Book" onPress={addBook} />
      <Button title="Back" onPress={() => setScreen('home')} />
    </View>
  );
}