import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; 
import { useNavigation } from "@react-navigation/native";
import appFirebase from "../../../firebaseConfig";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

const auth = getAuth(appFirebase); 

const SignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const LogIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al iniciar sesión. Verifica tus credenciales y vuelve a intentarlo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/registroBg.jpg")}
        style={[styles.backgroundImage, StyleSheet.absoluteFill]}
      />
      <View>
        <Image
          source={require("../../../assets/BookProfile.jpg")}
          style={styles.profile}
        />
      </View>
      <View style={styles.form}>
        <View style={styles.formText}>
          <TextInput
            placeholder="Correo@email.com"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View style={styles.formText}>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true} // Ocultar la contraseña
            value={password}
          />
        </View>
        <View style={styles.formButton}>
          <TouchableOpacity
            style={[styles.btn, isLoading && { backgroundColor: "#cccccc" }]}
            onPress={LogIn}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.registerLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  form: {
    margin: 30,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  formText: {
    paddingVertical: 10,
    backgroundColor: "#cccccc40",
    borderRadius: 10,
    marginVertical: 10,
  },
  formButton: {
    alignItems: "center",
    margin: 10,
  },
  btn: {
    backgroundColor: "#525fe1",
    borderRadius: 10,
    paddingVertical: 15,
    width: 150,
    marginTop: 20,
  },
  btnText: {
    textAlign: "center",
    color: "white",
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#555",
  },
  registerLink: {
    fontSize: 16,
    color: "#525fe1",
    textDecorationLine: "underline",
  },
});

export default SignIn;
