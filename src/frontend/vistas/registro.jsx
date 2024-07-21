import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text, Image, ScrollView } from "react-native";
import { auth, db } from "../../../firebaseConfig"; // Asegúrate de importar auth y db
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { BlurView } from 'expo-blur'

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const handleSignUp = async () => {
    try {
      // Crear usuario con correo y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      
      // Solo mostramos un mensaje de éxito sin iniciar sesión automáticamente
      Alert.alert("Registro exitoso!", "Usuario registrado correctamente");

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        email: email,
        // No almacenes la contraseña aquí por razones de seguridad
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
      <View style={styles.container}>
        <Image source={require('../../../assets/registroBg.jpg')}
         style={[styles.backgroundImage, 
         StyleSheet.absoluteFill]}/>
        
            
      <View style={styles.form}>
        <View style={styles.formText}>
          <TextInput
            placeholder="Nombre"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            style={{ paddingHorizontal: 15 }}
            onChangeText={setNombre}
            value={nombre}
          />
        </View>
        <View style={styles.formText}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            style={{ paddingHorizontal: 15 }}
            onChangeText={setEmail}
            value={email}
          />
        </View>
        <View style={styles.formText}>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            style={{ paddingHorizontal: 15 }}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>
        <View style={styles.formButton}>
                  <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
                      <Text style={styles.btnText}>Registrar</Text>
                  </TouchableOpacity>
              </View>
      </View>
     
      
    </View>
   
  );
};

const styles = StyleSheet.create({
    backgroundImage: {
        resizeMode: 'cover', 
        width: '100%',
        height: '100%'
      },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  form: {
    margin: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    shadowColor: '#000',
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
    backgroundColor: "#cccccc95",
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
});

export default RegisterScreen;
