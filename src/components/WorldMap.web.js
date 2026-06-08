import { StyleSheet, View } from 'react-native';
// Importamos el mapa interactivo web de código abierto real
import { Map, Marker } from 'pigeon-maps';
import { COUNTRY_COORDS } from '../constants/countries';

export default function WorldMap({ countryCounts }) {
  if (!countryCounts) return null;

  return (
    <View style={styles.container}>
      {/* 
        Pigeon Maps maneja los cuadrantes de OpenStreetMap usando CSS nativo puro en línea,
        así que Safari no puede deformar ni descolocar los mapas de ninguna manera.
      */}
      <Map
        height={160}
        width={281}
        defaultCenter={[20, 0]}
        defaultZoom={1}
        maxZoom={10}
        minZoom={1}
      >
        {Object.keys(countryCounts).map((code) => {
          const country = COUNTRY_COORDS[code.toUpperCase()];
          if (!country) return null;

          return (
            <Marker
              key={code}
              anchor={[country.latitude, country.longitude]}
              payload={country.name}
              color="#8e41e5" // El color morado de tus libros
              onClick={({ event, anchor, payload }) => {
                alert(`${payload}: ${countryCounts[code]} libros`);
              }}
            />
          );
        })}
      </Map>
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
});