import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Perfil = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Esta es la pantalla de perfil</Text>
      {/* Aquí podrías agregar más contenido o componentes */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Color de fondo blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333', // Color de texto gris oscuro
  },
});

export default Perfil;