import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Entypo, Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import appFirebase from '../../firebaseConfig';
import HomeScreen from './vistas/home';
import Perfil from './vistas/perfil';
import Biblioteca from './vistas/biblioteca';
import SignIn from './vistas/signIn';

const auth = getAuth(appFirebase);
const Tab = createBottomTabNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsSignedIn(false);
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
            component={SignIn}
            options={{
              tabBarLabel: 'Sign In',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={24} color={color} />
              ),
            }}
            initialParams={{ onSignOut: handleSignOut }}
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

