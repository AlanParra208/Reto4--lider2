import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
// --- CAMBIO 1: Importamos axios ---
import axios from 'axios';

// --- CAMBIO 2: Ajustamos la interface a tu base de datos ---
interface Anuncio {
  id_anuncio: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export default function ExploreScreen() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // --- CAMBIO 3: Lógica de carga de datos con Axios ---
  useEffect(() => {
    const obtenerAnuncios = async () => {
      try {
        setError(null); // Reseteamos errores previos
        // Usamos axios.get para OBTENER datos. Tu login usaba .post para ENVIAR.
        // ¡IMPORTANTE! Asegúrate que la URL sea la correcta para tu API.
        const response = await axios.get("http://localhost:3000/anuncios");

        // Guardamos los datos recibidos del servidor en nuestro estado.
        setAnuncios(response.data);

      } catch (err: any) {
        // Manejo de errores similar a tu pantalla de login
        if (err.response) {
          setError("Error del servidor al cargar los anuncios.");
        } else if (err.request) {
          setError("No se puede conectar al servidor. Verifica la URL y que esté encendido.");
        } else {
          setError("Ocurrió un error inesperado.");
        }
        console.error("Error al cargar los anuncios:", err);
      } finally {
        // Este bloque se ejecuta siempre, asegurando que el 'cargando' se desactive.
        setCargando(false);
      }
    };

    obtenerAnuncios();
  }, []); // El array vacío asegura que esta función se ejecute solo una vez.

  if (cargando) {
    return (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando anuncios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloPrincipal}>Tabla de Anuncios</Text>
      <Text style={styles.subtituloPrincipal}>Gestiona y visualiza todos los anuncios registrados en el sistema</Text>

      <View style={styles.contenedorTabla}>
        <Text style={styles.tituloTabla}>Registros de Anuncios</Text>
        
        {/* Mostramos el error si existe */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* --- Encabezado de la Tabla --- */}
        <View style={styles.filaEncabezado}>
          <Text style={[styles.celdaEncabezado, { flex: 0.5 }]}>ID</Text>
          <Text style={[styles.celdaEncabezado, { flex: 1 }]}>Imagen</Text>
          <Text style={[styles.celdaEncabezado, { flex: 1.5 }]}>Nombre</Text>
          <Text style={[styles.celdaEncabezado, { flex: 1 }]}>Tipo</Text>
          <Text style={[styles.celdaEncabezado, { flex: 2 }]}>Descripción</Text>
          <Text style={[styles.celdaEncabezado, { flex: 1, textAlign: 'right' }]}>Precio</Text>
        </View>

        {/* --- CAMBIO 4: Ajustamos el FlatList a la nueva interface --- */}
        <FlatList
          data={anuncios}
          keyExtractor={(item) => item.id_anuncio.toString()}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <Text style={[styles.celda, { flex: 0.5 }]}>{item.id_anuncio}</Text>
              <Image source={{ uri: item.imagen }} style={styles.imagen} />
              <Text style={[styles.celda, { flex: 1.5 }]}>{item.nombre}</Text>
              <Text style={[styles.celda, { flex: 1 }]}>{item.tipo}</Text>
              <Text style={[styles.celda, { flex: 2 }]}>{item.descripcion}</Text>
              <Text style={[styles.celda, { flex: 1, textAlign: 'right' }]}>${item.precio.toFixed(2)}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.contenedorVacio}>
              <Text style={styles.textoVacio}>{error ? 'No se pudieron cargar los datos' : 'No hay anuncios para mostrar'}</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

// --- Se agrega un estilo para el texto de error ---
const styles = StyleSheet.create({
  // ... (todos tus otros estilos permanecen igual)
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  tituloPrincipal: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtituloPrincipal: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  contenedorTabla: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tituloTabla: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  filaEncabezado: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  celdaEncabezado: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  celda: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 4,
  },
  imagen: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
    flex: 1,
  },
  contenedorCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorVacio: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  textoVacio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  subtextoVacio: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  }
});