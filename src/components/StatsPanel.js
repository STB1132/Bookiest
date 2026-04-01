import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import WorldMap from '../components/WorldMap';

export default function StatsPanel({ books, styles, countryCounts, chartConfig }) {
  const pieData = useMemo(() => ([
    { name: "F", population: books.filter(b => b.gender === 'F').length, color: "#d6639d", legendFontColor: "#fff" },
    { name: "M", population: books.filter(b => b.gender === 'M').length, color: "#7e1395", legendFontColor: "#fff" },
    { name: "NB", population: books.filter(b => b.gender === 'NB').length, color: "#8e41e5", legendFontColor: "#fff" },
  ]), [books]);

  const timelineStats = useMemo(() => {
    const years = books.map(b => parseInt(b.year)).filter(y => !isNaN(y));
    if (years.length === 0) return null;
    const counts = {};
    years.forEach(y => counts[y] = (counts[y] || 0) + 1);
    const mostReadYear = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return {
      oldest: Math.min(...years),
      newest: Math.max(...years),
      mostPopular: mostReadYear,
      count: counts[mostReadYear]
    };
  }, [books]);

  return (
    <View>
      <View style={{ height: 20 }} />
      <Text style={styles.title}>My Books</Text>
      <View style={{ height: 10 }} />
      <Text style={styles.chartLabel}>Statistics</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
        style={{ marginTop: 15 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          <View style={[styles.chartBox, { width: 220, justifyContent: 'space-between' }]}>
            <Text style={styles.smallLabel}>Gender Distribution</Text>
            <PieChart
              data={pieData}
              width={220}
              height={140}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>

          <View style={[styles.chartBox, { width: 240, marginLeft: 15, padding: 15 }]}>
            <Text style={styles.smallLabel}>Timeline Highlights</Text>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Oldest Book</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{timelineStats?.oldest || '—'}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Newest Book</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{timelineStats?.newest || '—'}</Text>
              </View>
              <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 5 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Peak Year</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#8e41e5', fontWeight: 'bold' }}>{timelineStats?.mostPopular || '—'}</Text>
                  {timelineStats && (
                    <Text style={{ color: '#6B7280', fontSize: 10 }}>({timelineStats.count} books)</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.chartBox, { width: 300, marginLeft: 15 }]}>
            <Text style={styles.smallLabel}>Books by Location</Text>
            <WorldMap countryCounts={countryCounts} />
          </View>
        </View>
      </ScrollView>

      <Text style={[styles.chartLabel, { marginTop: 40, marginBottom: 10 }]}>Book List</Text>
    </View>
  );
}
