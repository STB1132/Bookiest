import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#25292e', padding: 20 },
  homeContainer: { flex: 1, backgroundColor: '#25292e', justifyContent: 'center', padding: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  label: { color: '#fff', marginTop: 10, fontWeight: '600' },
  chartLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  input: { borderWidth: 1, borderColor: '#555', color: '#fff', padding: 12, borderRadius: 8, marginTop: 5 },
  pickerWrapper: { backgroundColor: '#555', borderRadius: 20, marginVertical: 10, height: 55, justifyContent: 'center', overflow: 'hidden' },
  picker: { width: '100%' },
  pickerItem: { fontSize: 16, height: 40, color: '#000' },
  bookItem: { borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 10 },
  bookTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bookSub: { color: '#bbb', fontSize: 13 },
  chartsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  chartBox: { width: '48%', alignItems: 'center' },
  smallLabel: { color: '#fff', fontSize: 14, marginBottom: 5, fontWeight: 'bold' },
  bookItemRow: {
    flexDirection: 'row',     // Pon o texto e o botón un ao lado do outro
    alignItems: 'center',      // Centra verticalmente o botón co texto
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
  },
  deleteButton: {
    width: 40,                // Tamaño suficiente para ver a X
    height: 40,               // Mesma altura para que sexa cadrado
    // justifyContent: 'center', // Centra a X verticalmente
    // alignItems: 'center',     // Centra a X horizontalmente
    // marginLeft: 10,           // Sepárao do texto
    // // backgroundColor: '#444',  // Un gris escuro para que contraste co fondo
    // // borderRadius: 4,          // Un toque suave nas esquinas (opcional, pon 0 se o queres 100% recto)
  },
  deleteButtonText: {
    color: '#ff4444',         // A X en vermello para que se vexa ben
    fontSize: 18,             // Tamaño da letra
    fontWeight: 'bold',       // Que se vexa grosa
  },

  badge: {
    backgroundColor: '#8e41e5',
    paddingHorizontal: 6,    // Máis espazo aos lados para que non se corte
    paddingVertical: 2,
    borderRadius: 4,         // Un pouco máis redondo queda mellor
    marginLeft: 8,           // Separación do título
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',         // Asegura que se comporte como bloque
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 14,          // Axuda a que o texto non se corte por arriba/abaixo
  },
  backButtonFloating: {
    position: 'absolute',
    top: 58,                // Axusta segundo o "notch" do teu iPhone
    left: 20,
    zIndex: 5,             // Para que estea por riba de todo
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#444',
  },
    suggestionsContainer: {
    backgroundColor: '#333',     // Gris escuro para contrastar co fondo negro
    borderRadius: 12,            // Bordes redondeados
    marginTop: 5,                // Separación do input
    position: 'absolute',        // Flota por riba do seguinte contido
    top: 75,                     // Xusto debaixo do TextInput
    left: 0,
    right: 0,
    zIndex: 999,                 // Asegura que estea por riba de todo
    elevation: 10,               // Sombra en Android
    shadowColor: '#000',         // Sombra en iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#444',         // Borde fino para dar definición
    overflow: 'hidden',          // Para que o efecto "press" non saia dos bordes
  },
  suggestionItem: {
    paddingVertical: 14,         // Máis espazo para que sexa fácil de tocar
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    flexDirection: 'row',        // Por se queres poñer iconas no futuro
    alignItems: 'center',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },



});