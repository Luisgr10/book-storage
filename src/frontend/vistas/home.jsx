import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
// import { text } from 'express';
// const auth = getAuth(appFirebase)


const HomeScreen = () => {
    
    // const [email, setEmail] = useState()
    // const [Password, setPassword] = useState()

    // const LogIn = async () => {
    //     try {
    //         await signInWithEmailAndPassword(auth, email, Password)
    //         Alert.alert('Iniciando sesion','Accediendo...')
    //         props.navigation.navigate('Profile')
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return (
    <View style={styles.container}>
        <View>
            <Image source={require('../../../assets/BookProfile.jpg')} style={styles.profile}/>
        </View>

        <View style={styles.form}>
            <View style={styles.formText}>
                <TextInput placeholder='correo@email.com' style={{paddingHorizontal:15}}
                // onChangeText={(text)=> setEmail(text)}
                />
            </View>
            <View style={styles.formText}>
                <TextInput placeholder='Password' style={{paddingHorizontal:15}} 
                // onChange={(text)=> setPassword(text)} 
                secureTextEntry={true}
                />
            </View>
            <View style={styles.formButton}>
                <TouchableOpacity style={styles.btn}
                    // onPress={LogIn}
                >
                    <Text style={styles.btnText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius:20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
        width:0,
        height:2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  formText: {
    paddingVertical: 10,
    backgroundColor: '#cccccc40',
    borderRadius: 30,
    marginVertical: 10,
    
  },
  formButton: {
    alignItems: 'center',
    margin: 10
  },
  btn:  {
    backgroundColor: '#525fe1',
    borderRadius: 30,
    paddingVertical: 15,
    width: 150,
    marginTop: 20,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
  }
});

export default HomeScreen;




