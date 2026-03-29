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

  const activeYears = useMemo(() => (
    [...new Set(books.map(b => b.year))].sort()
  ), [books]);

  const counts = useMemo(() => (
    activeYears.map(y => books.filter(b => b.year === y).length)
  ), [books, activeYears]);

  const lineData = {
    labels: activeYears.length > 0 ? activeYears : ["N/A"],
    datasets: [{
      data: counts.length > 0 ? counts : [0],
      color: (opacity = 1) => `rgba(142, 65, 229, ${opacity})`,
      strokeWidth: 2
    }]
  };

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
