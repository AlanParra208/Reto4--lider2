
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from 'expo-router';
import axios from 'axios';

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS === 'web') {
    return <View style={{ flex: 1 }}>{children}</View>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    if (!usuario.trim() || !contrasena.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }
    setCargando(true);
    
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: usuario,
        password: contrasena,
      });

      // CAMBIO: Ahora enviamos un parámetro a la siguiente ruta
      router.push({
        pathname: '/(tabs)/explore',
        params: { successMessage: '¡Inicio de sesión exitoso!' },
      });

    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Ocurrió un error");
      } else if (err.request) {
        setError("No se puede conectar al servidor. Verifica la IP.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.loginBox}>
          <Text style={styles.titulo}>Iniciar Sesión</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {/* ...El resto de tu JSX se mantiene igual... */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput style={styles.input} placeholder="Ingresa tu usuario" value={usuario} onChangeText={setUsuario} autoCapitalize="none" editable={!cargando} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput style={styles.input} placeholder="Ingresa tu contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry editable={!cargando} />
          </View>
          <TouchableOpacity style={[styles.boton, cargando && styles.botonDeshabilitado]} onPress={handleLogin} disabled={cargando}>
            {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBoton}>Iniciar Sesión</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

// ...Tus estilos se mantienen exactamente igual...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center", padding: 20 },
  loginBox: { width: "100%", maxWidth: 400, backgroundColor: "#fff", borderRadius: 12, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a", marginBottom: 24, textAlign: "center" },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#fff" },
  boton: { backgroundColor: "#00060cff", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 8 },
  botonDeshabilitado: { backgroundColor: "#999" },
  textoBoton: { color: "#fff", fontSize: 16, fontWeight: "600" },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 12, fontSize: 14, }
});