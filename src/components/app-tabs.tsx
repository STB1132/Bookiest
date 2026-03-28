// src/components/app-tabs.tsx
import { Slot } from 'expo-router';

export default function AppTabs() {
  // Slot fai que se cargue o teu index.tsx sen ningunha barra de navegación
  return <Slot />;
}
