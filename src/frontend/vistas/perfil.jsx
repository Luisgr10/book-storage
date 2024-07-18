import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Perfil = ({ onSignOut }) => {
  const route = useRoute();
  const signOutHandler = route.params?.onSignOut || onSignOut;

  return (
    <View style={styles.container}>
      {/* Otros componentes de perfil */}
      {signOutHandler && <Button title="Cerrar sesión" onPress={signOutHandler} />} {/* Mostrar el botón si la función existe */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Perfil;

