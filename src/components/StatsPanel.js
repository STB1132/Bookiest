import React, { useMemo } from 'react'; // <--- IMPORTANTE: Engade useMemo
import { ScrollView, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import WorldMap from '../components/WorldMap'; // Asegúrate de que a ruta sexa correcta

export default function StatsPanel({ books, styles, countryCounts, chartConfig }) {

  // Datos derivados
  const pieData = useMemo(() => ([
    { name: "F", population: books.filter(b => b.gender === 'F').length, color: "#d6639d", legendFontColor: "#fff" },
    { name: "M", population: books.filter(b => b.gender === 'M').length, color: "#7e1395", legendFontColor: "#fff" },
    { name: "NB", population: books.filter(b => b.gender === 'NB').length, color: "#8e41e5", legendFontColor: "#fff" },
  ]), [books]);

// --- DENTRO de StatsPanel ---

const lineData = useMemo(() => {
  // 1. Extraer anos únicos e ordenalos
  const allYears = [...new Set(books.map(b => b.year))].sort((a, b) => parseInt(a) - parseInt(b));

  if (allYears.length === 0) {
    return { labels: ["N/A"], datasets: [{ data: [0] }] };
  }

  // 2. Contar libros por cada ano
  const dataCounts = allYears.map(y => books.filter(b => b.year === y).length);

  // 3. Crear etiquetas: SÓ primeiro, medio e último
  const labels = allYears.map((year, index) => {
    if (index === 0) return year; // Primeiro
    if (index === allYears.length - 1) return year; // Último
    if (index === Math.floor(allYears.length / 2) && allYears.length > 2) return year; // Medio
    return ""; // O resto baleiro para que non se amontonen
  });

  return {
    labels: labels,
    datasets: [{
      data: dataCounts,
      color: (opacity = 1) => `rgba(142, 65, 229, ${opacity})`,
      strokeWidth: 2
    }]
  };
}, [books]);


  return (
    <View>
      <View style={{ height: 20 }} />
      <Text style={styles.title}>My Books</Text>
      <View style={{ height: 10 }} />

      <Text style={styles.chartLabel}>Statistics</Text>

            {/* Gráficos circulares e liñas en horizontal */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 15 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          
          {/* Tarxeta 1: Gender */}
          <View style={[styles.chartBox, { width: 220 }]}>
            <Text style={styles.smallLabel}>Gender</Text>
            <PieChart
              data={pieData}
              width={220}
              height={160}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>

          {/* Timeline */}
          <View style={[styles.chartBox, { width: 260, marginLeft: 20 }]}>
            <Text style={styles.smallLabel}>Timeline</Text>
            <LineChart
              data={lineData}
              width={260}
              height={160}
              chartConfig={{ 
                ...chartConfig, 
                decimalPlaces: 0, // Sen decimais
                propsForLabels: { fontSize: 10 } // Etiquetas máis pequenas
              }}
              fromZero={true}       // Comeza sempre en 0
              segments={Math.min(Math.max(...lineData.datasets[0].data), 4)} // Axusta as liñas horizontais
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>


          {/* Tarxeta 3: O MAPA (Agora como un elemento máis) */}
          <View style={{ width: 300, marginLeft: 20 }}> 
            <Text style={styles.smallLabel}>Books by Location</Text>
            <WorldMap countryCounts={countryCounts} />
          </View>

        </View>
      </ScrollView>


  

      <Text style={[styles.chartLabel, { marginTop: 40, marginBottom: 10 }]}>
        Book List
      </Text>
    </View>
  );
}
