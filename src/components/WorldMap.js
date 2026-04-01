import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


import React from 'react';

import { COUNTRY_COORDS } from '../constants/countries';

export default function WorldMap({ countryCounts }) {
  if (!countryCounts) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
        customMapStyle={mapDarkStyle}
      >
        {Object.keys(countryCounts).map((code) => {
          // Buscamos directamente polo código (AF, ES, US...)
          const country = COUNTRY_COORDS[code.toUpperCase()];

          if (!country) {
            console.warn(`Mapa: Non hai coordenadas para o código: ${code}`);
            return null;
          }

          return (
            <Marker
              key={code}
              coordinate={{ 
                latitude: country.latitude, 
                longitude: country.longitude 
              }}
              title={country.name}
              description={`${countryCounts[code]} libros`}
              pinColor="#8e41e5"
            />
          );
        })}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    height: 160,      
    width: 281,       
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#17263c', 
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const mapDarkStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
];
