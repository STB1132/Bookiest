
// This type of chart is not used in the current version.

import { Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

const ViolinChart = ({ data, width, height, minYear, maxYear }) => {
  // Configuración visual
  const padding = 20;
  const chartHeight = height - 40;
  const centerX = width / 2;
  
  // O "corpo" do violín (unha forma simétrica de exemplo)
  // Podes axustar os números do Path para que sexa máis ancho ou estreito
  const violinPath = `
    M ${centerX} ${padding}
    C ${centerX + 40} ${padding + 30}, ${centerX + 40} ${chartHeight - 30}, ${centerX} ${chartHeight}
    C ${centerX - 40} ${chartHeight - 30}, ${centerX - 40} ${padding + 30}, ${centerX} ${padding}
    Z
  `;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={width} height={height}>
        {/* Liña central (Eixo) */}
        <Line 
          x1={centerX} y1={padding} 
          x2={centerX} y2={chartHeight} 
          stroke="#E5E7EB" strokeWidth="2" 
        />
        
        {/* Corpo do Violín */}
        <Path
          d={violinPath}
          fill="rgba(134, 65, 244, 0.4)"
          stroke="#8641F4"
          strokeWidth="2"
        />

        {/* Indicadores de Min e Max */}
        <Circle cx={centerX} cy={padding} r="4" fill="#8641F4" />
        <Circle cx={centerX} cy={chartHeight} r="4" fill="#8641F4" />
      </Svg>

      {/* Etiquetas de Anos */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: -10 }}>
        <Text style={{ fontSize: 10, color: '#6B7280' }}>{minYear}</Text>
        <Text style={{ fontSize: 10, color: '#6B7280' }}>{maxYear}</Text>
      </View>
    </View>
  );
};
