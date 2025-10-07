import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Platform } from 'react-native';
// --- CAMBIO 1: Importamos axios ---
import axios from 'axios';

// --- CAMBIO 2: Ajustamos la interface a tu base de datos ---
interface Anuncio {
  id_anuncio: number;
  nombre: string;
  tipo: string;
  descripción: string;
  precio: number;
  imagen: string;
}

export default function ExploreScreen() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // estilo inline específico para web: permite quiebre de palabras largas sin espacios
  const webBreakStyle = Platform.OS === 'web' ? { wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' } : {};

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

        {/* --- Encabezado de la Tabla (alineado con columnas del body) --- */}
        <View style={styles.filaEncabezado}>
          <Text style={[styles.celdaEncabezado, styles.headerId]}>ID</Text>
          <View style={styles.headerImageCell}>
            <Text style={styles.celdaEncabezado}>Imagen</Text>
          </View>
          <Text style={[styles.celdaEncabezado, styles.headerName]}>Nombre</Text>
          <Text style={[styles.celdaEncabezado, styles.headerTipo]}>Tipo</Text>
          <Text style={[styles.celdaEncabezado, styles.headerDescripcion]}>Descripción</Text>
          <Text style={[styles.celdaEncabezado, styles.headerPrecio]}>Precio</Text>
        </View>

        {/* --- CAMBIO 4: Ajustamos el FlatList a la nueva interface --- */}
        <FlatList
          data={anuncios}
          keyExtractor={(item) => item.id_anuncio.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <Text style={[styles.celda, styles.idCell]}>{item.id_anuncio}</Text>

              {/* Imagen en contenedor de ancho fijo para evitar que estire la fila */}
              <View style={styles.imagenContainer}>
                <Image source={{ uri: item.imagen }} style={styles.imagen} />
              </View>

              <Text style={[styles.celda, styles.nombre]} numberOfLines={1} ellipsizeMode="tail">{item.nombre}</Text>
              <Text style={[styles.celda, styles.tipo, webBreakStyle as any]} numberOfLines={1} ellipsizeMode="tail">{item.tipo}</Text>
              <Text style={[styles.celda, styles.descripcion, webBreakStyle as any]} numberOfLines={2} ellipsizeMode="tail">{item.descripción}</Text>

              <View style={styles.priceCell}>
                <Text style={styles.priceText}>${item.precio.toFixed(2)}</Text>
              </View>
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
  headerId: {
    width: 40,
  },
  headerImageCell: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerName: {
    flex: 1.2,
  },
  headerTipo: {
    flex: 1,
  },
  headerDescripcion: {
    flex: 3,
  },
  headerPrecio: {
    width: 120,
    textAlign: 'right',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 72,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  celda: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 8,
    flexShrink: 1,
    // Allow text to wrap or be truncated via numberOfLines
    includeFontPadding: false,
  },
  imagen: {
    width: 56,
    height: 56,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  imagenContainer: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  nombre: {
    flex: 1.2,
    fontWeight: '600',
  },
  tipo: {
    flex: 1,
    color: '#666',
  },
  idCell: {
    width: 40,
    textAlign: 'center',
  },
  priceCell: {
    width: 120,
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  descripcion: {
    flex: 3,
    color: '#555',
    flexWrap: 'wrap',
    flexShrink: 1,
    // cross-platform: long words will be truncated by numberOfLines in Text
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