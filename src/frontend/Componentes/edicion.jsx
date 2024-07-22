import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';

const Edicion = ({ route, navigation }) => {
  const { bookId } = route.params;

  const [bookData, setBookData] = useState({
    autor: '',
    descripcion: '',
    fechaPublicacion: '',
    genero: '',
    portadaURL: '',
    titulo: '',
  });

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://192.168.1.34:3000/book/${bookId}`);
        const data = await response.json();
        setBookData({
          autor: data.autor.join(', '),
          descripcion: data.descripcion,
          fechaPublicacion: data.fechaPublicacion,
          genero: data.genero.join(', '),
          portadaURL: data.portadaURL,
          titulo: data.titulo,
        });
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    fetchBookData();
  }, [bookId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://192.168.1.34:3000/book/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          autor: bookData.autor.split(',').map(s => s.trim()),
          descripcion: bookData.descripcion,
          fechaPublicacion: bookData.fechaPublicacion,
          genero: bookData.genero.split(',').map(s => s.trim()),
          portadaURL: bookData.portadaURL,
          titulo: bookData.titulo,
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Libro actualizado con éxito');
        navigation.navigate('Biblioteca', { refresh: true }); // Navega de vuelta a la pantalla anterior con un parámetro de actualización
      } else {
        Alert.alert('Error', 'Error al actualizar el libro');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      Alert.alert('Error', 'Error al actualizar el libro');
    }
  };

  const handleChange = (name, value) => {
    setBookData({
      ...bookData,
      [name]: value,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={bookData.titulo}
        onChangeText={text => handleChange('titulo', text)}
      />
      <Text style={styles.label}>Autor (separados por comas)</Text>
      <TextInput
        style={styles.input}
        value={bookData.autor}
        onChangeText={text => handleChange('autor', text)}
      />
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={bookData.descripcion}
        onChangeText={text => handleChange('descripcion', text)}
      />
      <Text style={styles.label}>Fecha de Publicación</Text>
      <TextInput
        style={styles.input}
        value={bookData.fechaPublicacion}
        onChangeText={text => handleChange('fechaPublicacion', text)}
      />
      <Text style={styles.label}>Género (separados por comas)</Text>
      <TextInput
        style={styles.input}
        value={bookData.genero}
        onChangeText={text => handleChange('genero', text)}
      />
      <Text style={styles.label}>URL de Portada</Text>
      <TextInput
        style={styles.input}
        value={bookData.portadaURL}
        onChangeText={text => handleChange('portadaURL', text)}
      />
      <Button title="Actualizar Libro" onPress={handleUpdate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default Edicion;
