import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importa la función signInWithEmailAndPassword desde firebase/auth
import { useNavigation } from '@react-navigation/native';
import appFirebase from '../../../firebaseConfig'; // Importa la configuración de Firebase

const auth = getAuth(appFirebase); // Obtiene la instancia de autenticación usando la configuración de Firebase

const SignIn = ({ onSignOut }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const LogIn = async () => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Inicio de sesión exitoso');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        Alert.alert('Error', 'Hubo un problema al iniciar sesión. Verifica tus credenciales y vuelve a intentarlo.');
    }
};
  return (
      <View style={styles.container}>
        <Image source={require('../../../assets/registroBg.jpg')}
         style={[styles.backgroundImage, 
         StyleSheet.absoluteFill]}/>
          <View>
              <Image source={require('../../../assets/BookProfile.jpg')} style={styles.profile} />
          </View>

          <View style={styles.form}>
              <View style={styles.formText}>
                  <TextInput
                      placeholder='Correo@email.com'
                      placeholderTextColor="rgba(0, 0, 0, 0.5)"
                      style={{ paddingHorizontal: 15 }}
                      onChangeText={(text) => setEmail(text)}
                      value={email} 
                  />
              </View>
              <View style={styles.formText}>
                  <TextInput
                      placeholder='Contraseña'
                      placeholderTextColor="rgba(0, 0, 0, 0.5)"
                      style={{ paddingHorizontal: 15 }}
                      onChangeText={(text) => setPassword(text)}
                      secureTextEntry={true} // Para ocultar la contraseña
                      value={password} 
                  />
              </View>
              <View style={styles.formButton}>
                  <TouchableOpacity style={styles.btn} onPress={LogIn}>
                      <Text style={styles.btnText}>Iniciar Sesión</Text>
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff', // Asegúrate de establecer un color de fondo si es necesario
  },
  profile: {
      height: 100,
      width: 100,
      borderRadius: 50,
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
      backgroundColor: '#cccccc40',
      borderRadius: 10,
      marginVertical: 10,
  },
  formButton: {
      alignItems: 'center',
      margin: 10
  },
  btn: {
      backgroundColor: '#525fe1',
      borderRadius: 10,
      paddingVertical: 15,
      width: 150,
      marginTop: 20,
  },
  btnText: {
      textAlign: 'center',
      color: 'white',
  }
});

export default SignIn;

