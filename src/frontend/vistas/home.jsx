import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import appFirebase from '../../../firebaseConfig';

const auth = getAuth(appFirebase);

const HomeScreen = ({ navigation }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsSignedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Book Storage</Text>
                <Image source={require('../../../assets/BookProfile.jpg')} style={styles.profile} />
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Bienvenido a Book Storage, tu app de almacenamiento de libros. Aquí puedes organizar tu colección personal de libros, acceder a información detallada y mucho más.
                </Text>
                {!isSignedIn && (
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registro')}>
                        <Text style={styles.buttonText}>Regístrate</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    profile: {
        height: 100,
        width: 100,
        borderRadius: 50,
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




