import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../../firebaseConfig';

//Configuración de Autenticación
const auth = getAuth(appFirebase);

const HomeScreen = ({ navigation }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        //Actualiza isSignedIn basado en si hay un usuario autenticado (user) o no.
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsSignedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            <Image source={require('../../../assets/Bookstorage.png')} style={styles.landingImage} />
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Bienvenido a Book Storage, tu app de almacenamiento de libros. Aquí puedes organizar tu colección personal de libros, acceder a información detallada y mucho más.
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        
    },
    landingImage: {
        width: 600,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    content: {
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#525fe1',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default HomeScreen;




