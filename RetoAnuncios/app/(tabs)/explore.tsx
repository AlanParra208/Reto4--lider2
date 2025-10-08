import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';


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
  const [error, setError] = useState<string | null>(null);

  const webBreakStyle = Platform.OS === 'web' ? { wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' } : {};

  useEffect(() => {
    const obtenerAnuncios = async () => {
      try {
        setError(null);
        const response = await axios.get("https://traceried-enunciatively-stephany.ngrok-free.dev/anuncios");
        //http://localhost:3000/anuncios     
        //https://traceried-enunciatively-stephany.ngrok-free.dev/anuncios
        setAnuncios(response.data);

      } catch (err: any) {
        if (err.response) {
          setError("Error del servidor al cargar los anuncios.");
        } else if (err.request) {
          setError("No se puede conectar al servidor. Verifica la URL y que esté encendido.");
        } else {
          setError("Ocurrió un error inesperado.");
        }
        console.error("Error al cargar los anuncios:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerAnuncios();
  }, []);

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
        
        {error && <Text style={styles.errorText}>{error}</Text>}

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

        <FlatList
          data={Array.isArray(anuncios) ? anuncios : []}
          keyExtractor={(item, index) => {
            // Evita crash si item o item.id_anuncio es undefined
            const anyItem: any = item as any;
            const key = anyItem && (anyItem.id_anuncio ?? anyItem.id ?? index);
            return String(key);
          }}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            // Protegemos por si item es undefined
            <View style={styles.fila}>
              <Text style={[styles.celda, styles.idCell]}>{item?.id_anuncio ?? ''}</Text>

              <View style={styles.imagenContainer}>
                <Image source={{ uri: item?.imagen ?? undefined }} style={styles.imagen} />
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
const styles = StyleSheet.create({
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