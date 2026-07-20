import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import WorldMap from './WorldMap';

export default function StatsPanel({ books, styles, countryCounts, chartConfig, filterToRead, setFilterToRead }) {
  const pieData = useMemo(() => ([
    { name: "F", population: books.filter(b => b.gender === 'F').length, color: "#8b88d3", legendFontColor: "#fff", legendFontFamily: "SofiaSansCondensed-Medium", legendFontSize: 11 },
    { name: "M", population: books.filter(b => b.gender === 'M').length, color: "#badd8c", legendFontColor: "#fff", legendFontFamily: "SofiaSansCondensed-Medium", legendFontSize: 11 },
    { name: "NB", population: books.filter(b => b.gender === 'NB').length, color: "#fcc871", legendFontColor: "#fff", legendFontFamily: "SofiaSansCondensed-Medium", legendFontSize: 11 },
  ]), [books]);

  const currentYear = new Date().getFullYear();

  const readThisYear = books.filter(book => 
    !book.toRead && book.readInYear === currentYear
  ).length;

  const leftInSprint = books.filter(book => book.toRead === true).length;

  const totalSprint = readThisYear + leftInSprint;
  const progress = totalSprint > 0 ? readThisYear / totalSprint : 0;

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
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 0 }}
        style={{ marginTop: 15 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          
          {/* GENDER DISTRIBUTION */}
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

          {/* TIMELINE HIGHLIGHTS */}
          <View style={[styles.chartBox, { width: 240, marginLeft: 15, padding: 15 }]}>
            <Text style={styles.smallLabel}>Timeline Highlights</Text>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'SofiaSansCondensed-Light' }}>Oldest Book</Text>
                <Text style={{ color: '#fff', fontFamily: 'SofiaSansCondensed-Bold', fontSize: 13 }}>{timelineStats?.oldest || '—'}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'SofiaSansCondensed-Light' }}>Newest Book</Text>
                <Text style={{ color: '#fff', fontFamily: 'SofiaSansCondensed-Bold', fontSize: 13 }}>{timelineStats?.newest || '—'}</Text>
              </View>
              
              <View style={{ height: 1, backgroundColor: '#374151', marginVertical: 5 }} />
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'SofiaSansCondensed-Light' }}>Peak Year</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#6d8cda', fontFamily: 'SofiaSansCondensed-Bold', fontSize: 13 }}>{timelineStats?.mostPopular || '—'}</Text>
                  {timelineStats && (
                    <Text style={{ color: '#6B7280', fontSize: 10, fontFamily: 'SofiaSansCondensed-Light' }}>({timelineStats.count} books)</Text>
                  )}
                </View>
              </View>

            </View>
          </View>

          {/* SPRINT PROGRESS */}
          <View style={[styles.chartBox, { width: 220, marginLeft: 15, padding: 15, justifyContent: 'center' }]}>
            <Text style={[styles.smallLabel, { marginBottom: 15 }]}>Sprint Progress</Text>
            
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'SofiaSansCondensed-Bold' }}>{readThisYear}</Text>
                <Text style={{ color: '#6B7280', fontSize: 21, fontFamily: 'SofiaSansCondensed-Medium' }}> / {totalSprint}</Text>
              </View>
              <Text style={{ color: '#aaa', fontSize: 9, marginBottom: 15, fontFamily: 'SofiaSansCondensed-Medium', letterSpacing: 0.5 }}>BOOKS FINISHED THIS YEAR</Text>
            </View>

            {/* Progress Bar */}
            <View style={{ height: 8, backgroundColor: '#374151', borderRadius: 4, overflow: 'hidden', width: '100%' }}>
              <View style={{ 
                height: '100%', 
                backgroundColor: '#8b88d3', 
                width: `${progress * 100}%`,
                borderRadius: 4 
              }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <TouchableOpacity 
                onPress={() => setFilterToRead(!filterToRead)}
                style={{ 
                  backgroundColor: filterToRead ? "#8b88d3" : "#444", 
                  paddingVertical: 4, 
                  paddingHorizontal: 8, 
                  borderRadius: 6 
                }}
              >
                <Text style={{ 
                  color: filterToRead ? "#ffffff" : "#f2f7f9", 
                  fontSize: 11, 
                  fontFamily: 'SofiaSansCondensed-Bold' 
                }}>
                  {leftInSprint} LEFT
                </Text>
              </TouchableOpacity>

              <Text style={{ color: '#9CA3AF', fontSize: 10, fontFamily: 'SofiaSansCondensed-Medium' }}>
                {Math.round(progress * 100)}%
              </Text>
            </View>

          </View>

          {/* LOCATION */}
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