import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { Entypo, Ionicons, FontAwesome6  } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import appFirebase from '../../firebaseConfig';
import  HomeScreen  from './vistas/home';
import Perfil from './vistas/perfil';
import Biblioteca from './vistas/biblioteca';

const auth = getAuth(appFirebase);
const Tab = createBottomTabNavigator();

const getIsSignedIn = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    }, reject);
  });
};

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const signedIn = await getIsSignedIn();
        setIsSignedIn(signedIn);
      } catch (error) {
        console.error('Error al verificar estado de autenticación:', error);
        setIsSignedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsSignedIn(false); // Actualiza el estado después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" size={24} color={color} />
            ),
            headerShown: false,
          }}
        />
        {isSignedIn ? (
          <>
            <Tab.Screen
              name="Perfil"
              children={() => <Perfil onSignOut={handleSignOut} />}
              options={{
                tabBarLabel: 'Perfil',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Biblioteca"
              component={Biblioteca}
              options={{
                tabBarLabel: 'Biblioteca',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome6 name="book-open" size={24} color={color} />
                ),
              }}
            />
          </>
        ) : (
          <Tab.Screen
            name="Sign In"
            component={Perfil} 
            options={{
              tabBarLabel: 'Sign In',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={24} color={color} />
              ),
            }}
            initialParams={{ onSignOut: handleSignOut }} // Pasar la función de cierre de sesión como prop
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
