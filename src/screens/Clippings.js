import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import React, { useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Clippings({ setScreen, styles, highlights = [], saveHighlights }) {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Engadimos a función de procesado que faltaba
  const parseKindleClippings = (rawText) => {
    const entries = rawText.split('==========');
    return entries.map(entry => {
      const lines = entry.trim().split('\n').filter(line => line.trim() !== "");
      if (lines.length < 3) return null;
      return {
        id: Math.random().toString(36).substr(2, 9),
        bookTitle: lines[0].trim(),
        date: lines[1].trim(),
        highlight: lines.slice(2).join('\n').trim()
      };
    }).filter(e => e !== null);
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/plain' });
      if (!result.canceled) {
        const fileUri = result.assets[0].uri; 
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const parsed = parseKindleClippings(fileContent);
        saveHighlights(parsed); 
        Alert.alert("Success", `${parsed.length} highlights imported!`);
      }
    } catch (err) {
      Alert.alert("Error", "Could not read the file");
    }
  };

  // 2. Definimos o menú que faltaba
  const showMenu = () => {
    Alert.alert("Kindle Actions", "Choose an option:", [
      { text: "Upload My Clippings.txt", onPress: handleUpload },
      { text: "Clear All", style: "destructive", onPress: () => saveHighlights([]) },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  // 3. Definimos a lista filtrada
  const filteredHighlights = highlights.filter(h => 
    h.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.highlight.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#25292e' }}>
      <TouchableOpacity 
        style={[styles.backButtonFloating, { top: 50, left: 20 }]} 
        onPress={() => setScreen('home')}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }} 
        onPress={showMenu}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={{ marginTop: 100, paddingHorizontal: 20, flex: 1 }}>
        <Text style={[styles.title, { marginBottom: 15 }]}>Kindle Highlights</Text>

        {highlights.length > 0 && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#1a1d21', 
            borderRadius: 12, 
            paddingHorizontal: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#333'
          }}>
            <Ionicons name="search" size={18} color="#666" />
            <TextInput
              style={{ flex: 1, color: '#fff', paddingVertical: 12, paddingHorizontal: 10 }}
              placeholder="Search in highlights..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}
        
        {highlights.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="cloud-upload-outline" size={50} color="#444" />
            <Text style={{ color: '#666', marginTop: 10, textAlign: 'center' }}>
              Upload your "My Clippings.txt" to start.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredHighlights}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ 
                backgroundColor: '#1a1d21', 
                padding: 15, 
                borderRadius: 12, 
                marginBottom: 15,
                borderLeftWidth: 4,
                borderLeftColor: '#8e41e5'
              }}>
                <Text style={{ color: '#8e41e5', fontWeight: 'bold', fontSize: 14 }}>{item.bookTitle}</Text>
                <Text style={{ color: '#888', fontSize: 10, marginVertical: 5 }}>{item.date}</Text>
                <Text style={{ color: '#eee', fontSize: 13, fontStyle: 'italic' }}>"{item.highlight}"</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
