import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import watercolorBg1 from '../../assets/images/watercolor.png';
import { COUNTRY_DATA } from '../constants/countries';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0e14' }}>
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: 40, flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* FLECHA FLOTANTE SUPERIOR */}
        <TouchableOpacity 
          style={styles.backButtonFloating} 
          onPress={() => setScreen('home')}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        
        {/* TÍTULO: Espacio extra arriba para despejarlo de la flecha */}
        <Text style={[styles.title, { marginTop: 45, marginBottom: 15 }]}>
          Log a Book
        </Text>

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

        {/* BUSCADOR DE PAÍS */}
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

          {/* Menú desplegable */}
          {showSuggestions && searchText.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView 
                style={{ maxHeight: 200 }} 
                keyboardShouldPersistTaps="handled"
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
                    <Text style={{ color: '#888', fontStyle: 'italic' }}>
                      No countries found
                    </Text>
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
          <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
            <Picker.Item label="Female (F)" value="F" />
            <Picker.Item label="Male (M)" value="M" />
            <Picker.Item label="Non-Binary (NB)" value="NB" />
          </Picker>
        </View>

        <Text style={styles.label}>To Read?</Text>
        <View style={{ marginTop: 10 }}>
          <Switch value={toRead} onValueChange={setToRead} />
        </View>
        
        {/* BOTÓN GUARDAR */}
        <TouchableOpacity 
          style={[styles.watercolorButtonContainer, { marginTop: 30 }]} 
          activeOpacity={0.8}
          onPress={addBook}
        >
          <ImageBackground 
            source={watercolorBg1} 
            style={styles.watercolorButtonImage}
            resizeMode="cover"
          >
            <Text style={styles.watercolorButtonText}>Save Book</Text>
          </ImageBackground>
        </TouchableOpacity> 

        {/* BOTÓN VOLVER */}
        <TouchableOpacity 
          style={[styles.secondaryButton, { marginTop: 15 }]} 
          onPress={() => setScreen('home')}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}