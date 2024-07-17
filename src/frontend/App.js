import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  HomeScreen  from './vistas/home';
import Perfil from './vistas/perfil';
import Biblioteca from './vistas/biblioteca';


const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
     <Tab.Navigator>
     <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size}) => (
            <Entypo name="home" size={24} color="black" />
            
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{ 
          tabBarLabel: 'Perfil',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person" size={24} color="black" />
          ) 
      }}
      />
      <Tab.Screen
        name="Biblioteca"
        component={Biblioteca}
        options={{ 
          tabBarLabel: 'Biblioteca',
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="book-open" size={24} color="black" />
          ) 
      }}
      />
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
