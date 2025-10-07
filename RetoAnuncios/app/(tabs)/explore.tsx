import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ExploreScreen() {
  // 1. Usamos este hook para leer los parámetros que nos enviaron
  const params = useLocalSearchParams();

  // 2. Usamos useEffect para que el código se ejecute solo una vez cuando la pantalla carga
  useEffect(() => {
    // 3. Verificamos si el parámetro successMessage existe
    if (params.successMessage) {
      // 4. Si existe, mostramos la alerta
      Alert.alert('Éxito', params.successMessage as string);
    }
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Has iniciado sesión correctamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffffff',
  },
});