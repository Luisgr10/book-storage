import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo, Ionicons, FontAwesome6 } from '@expo/vector-icons';
import HomeScreen from '../vistas/home';
import Perfil from '../vistas/perfil';
import Biblioteca from '../vistas/biblioteca';
import AgregarLibro from '../vistas/agregarLibro';
import SignIn from '../vistas/signIn';
import RegisterScreen from '../vistas/registro';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigatorAuthenticated({ onSignOut }) {
    return (
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
            <Tab.Screen
                name="Perfil"
                children={() => <Perfil onSignOut={onSignOut} />}
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
        </Tab.Navigator>
    );
}

function TabNavigatorUnauthenticated() {
    return (
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
            <Tab.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    tabBarLabel: 'Sign In',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function AppNavigator({ isSignedIn, onSignOut }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TabNavigator"
                component={isSignedIn ? () => <TabNavigatorAuthenticated onSignOut={onSignOut} /> : TabNavigatorUnauthenticated}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AgregarLibro"
                component={AgregarLibro}
                options={{ title: 'Agregar Libro' }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ title: 'Registro' }}
            />
        </Stack.Navigator>
    );
}

const Navegacion = ({ isSignedIn, onSignOut }) => {
    return <AppNavigator isSignedIn={isSignedIn} onSignOut={onSignOut} />;
};

export default Navegacion;
