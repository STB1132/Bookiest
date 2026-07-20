import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- ESTILOS XERAIS E PANTALLA PRINCIPAL ---
  container: { 
    flex: 1, 
    backgroundColor: '#0b0e14', // Azul noite profundo
    padding: 20 
  },
  homeContainer: { 
    flex: 1, 
    backgroundColor: '#0b0e14', // Azul noite profundo
    justifyContent: 'center', 
    padding: 40 
  },
  title: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontFamily: 'SofiaSansCondensed-SemiBold',
    marginTop: 20 
  },
  label: { 
    color: '#fff', 
    marginTop: 10, 
    fontWeight: '600', 
    fontFamily: 'SofiaSansCondensed-SemiBold'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#262b3c', 
    color: '#fff', 
    padding: 19, 
    borderRadius: 12, 
    marginTop: 5,
    backgroundColor: '#171a23' // Inputs integrados co fondo das tarxetas
  },

  // --- BOTÓNS MODERNOS (PANTALLA HOME E ADD) ---
  primaryButton: {
    backgroundColor: '#002fa7', // Azul Klein para accións principais
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    cursor: 'pointer',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SofiaSansCondensed-SemiBold'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#262b3c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    cursor: 'pointer',

  },
  secondaryButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
     fontFamily: 'SofiaSansCondensed-SemiBold'
  },

  // --- SELECTORES (PICKERS) CORRIXIDOS SEN ÓVALO GRIS ---
  pickerWrapper: { 
    backgroundColor: '#171a23', 
    borderRadius: 12, 
    marginVertical: 10, 
    height: 55, 
    justifyContent: 'center', 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262b3c',
  },
  picker: {
    width: '100%', 
    height: '100%', 
    color: '#fff', 
    backgroundColor: 'transparent',
    borderStyle: 'none',
    outlineStyle: 'none',
    paddingHorizontal: 10,
    cursor: 'pointer',
    ...({ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' })
  },
  pickerItem: { 
    fontSize: 16, 
    color: '#fff', 
    backgroundColor: '#171a23',
  },

  // --- COMPONENTES DA PANTALLA SCREENLIST (SEN ESTILOS INLINE) ---
  listMainContainer: { 
    flex: 1, 
    backgroundColor: '#0b0e14' 
  },
  backButtonFloatingWithBackground: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 5,
    backgroundColor: '#171a23',
    borderColor: '#262b3c',
    borderWidth: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonFloating: { // Mantense por compatibilidade con AddBookScreen
    position: 'absolute',
    top: 58,                
    left: 20,
    zIndex: 5,            
    backgroundColor: '#171a23', 
    borderColor: '#262b3c',
    borderWidth: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topToolsButton: {
    position: 'absolute', 
    top: 50, 
    right: 20, 
    zIndex: 10,
    backgroundColor: "#171a23", 
    borderColor: '#262b3c', 
    borderWidth: 1,
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  searchBarWrapper: { 
    paddingHorizontal: 20, 
    marginTop: 15 
  },
  searchBarInner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#171a23', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#262b3c'
  },
  searchBarInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    outlineStyle: 'none'
  },
  booksFoundWrapper: { 
    paddingVertical: 11, 
    borderBottomWidth: 1, 
    borderBottomColor: '#171a23', 
    alignItems: 'center' 
  },
  booksFoundText: { 
    color: '#64748b', 
    fontSize: 12, 
    marginTop: 8 
  },
  bookListItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#171a23',
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262b3c',
    zIndex: 5
  },
  bookInfoColumn: { 
    flex: 1 
  },
  bookListItemTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  bookListItemSub: { 
    color: '#94a3b8', 
    fontSize: 14, 
    marginTop: 2 
  },
  badgeStateToRead: {
    alignSelf: 'flex-start',
    backgroundColor: '#002fa7', // Azul Klein puro para To Read
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8
  },
  badgeStateRead: {
    alignSelf: 'flex-start',
    backgroundColor: '#262b3c', // Gris azulado integrado para Read
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8
  },
  badgeStateText: {
    color: '#fff', // Texto sempre 100% branco
    fontSize: 7, 
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  listActionsWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    zIndex: 20 
  },
  actionBtnStatusToRead: {
    padding: 10, 
    backgroundColor: 'rgba(0, 47, 167, 0.2)', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#002fa7'
  },
  actionBtnStatusRead: {
    padding: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444'
  },
  actionBtnDelete: {
    padding: 10, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },

  // --- PANELS E GRÁFICOS (STATS) ---
  chartLabel: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 20 
  },
  chartsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 15 
  },
  chartBox: {
    backgroundColor: '#171a23',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
    minHeight: 200, 
    elevation: 4,   
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#262b3c'
  },
  smallLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10, 
    textAlign: 'center',
    width: '100%',
  },

  // --- BUSCADOR DE PAÍSES (SUGGESTIONS) ---
  suggestionsContainer: {
    backgroundColor: '#171a23',    
    borderRadius: 12,            
    marginTop: 5,                
    position: 'absolute',        
    top: 75,                     
    left: 0,
    right: 0,
    zIndex: 999,                 
    elevation: 10,               
    shadowColor: '#000',         
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#262b3c',        
    overflow: 'hidden',          
  },
  suggestionItem: {
    paddingVertical: 14,        
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#262b3c',
    flexDirection: 'row',        
    alignItems: 'center',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },

  // --- VESTIXIOS (Cousas antigas mantidas por se o código as busca) ---
  bookItem: { borderBottomWidth: 1, borderBottomColor: '#171a23', paddingVertical: 10 },
  bookTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bookSub: { color: '#94a3b8', fontSize: 13 },
  bookItemRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#171a23', paddingVertical: 10 },
  deleteButton: { width: 40, height: 40 },
  deleteButtonText: { color: '#ef4444', fontSize: 18, fontWeight: 'bold' },
  badge: { backgroundColor: '#2ac4197d', paddingHorizontal: 5, paddingVertical: 0, borderRadius: 4, marginLeft: 8, alignItems: 'center', justifyContent: 'center', display: 'flex' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', lineHeight: 14 }
});
