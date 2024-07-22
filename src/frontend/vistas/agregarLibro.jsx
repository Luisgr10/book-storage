import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormImputs from '../Componentes/formImputs';
import ImagePickerComponent from '../Componentes/imagePicker';

const AgregarLibro = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    genero: '',
    fechaPublicacion: '',
    autor: '',
  });
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const generateUniqueId = () => {
    return (Math.random() + 1).toString(36).substring(7) + Date.now().toString();
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${generateUniqueId()}`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'No se pudo subir la imagen.');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.descripcion || !formData.genero || !formData.fechaPublicacion || !formData.autor) {
      Alert.alert('Error', 'Todos los campos deben ser rellenados.');
      return;
    }

    let portadaURL = '';
    if (image) {
      portadaURL = await uploadImage(image);
    }

    if (!portadaURL) {
      Alert.alert('Error', 'No se pudo subir la imagen.');
      return;
    }

    const bookData = {
      ...formData,
      genero: formData.genero.split(',').map(g => g.trim()), // Convertir cadena a array
      portadaURL,
      autor: formData.autor.split(',').map(a => a.trim()), // Convertir cadena a array
    };

    try {
      const response = await fetch('http://192.168.1.34:3000/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Éxito', `Libro agregado: ${data.titulo}`);

        // Limpiar campos
        setFormData({
          titulo: '',
          descripcion: '',
          genero: '',
          fechaPublicacion: '',
          autor: '',
        });
        setImage(null);

        // Redirigir a la vista de la biblioteca
        navigation.navigate('Biblioteca');
      } else {
        Alert.alert('Error', 'No se pudo agregar el libro.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Alert.alert('Error', 'Hubo un problema con la conexión.');
    }
  };

  return (
    <View style={styles.container}>
      <FormImputs formData={formData} setFormData={setFormData} />
      <ImagePickerComponent image={image} setImage={setImage} />
      <Button title="Agregar Libro" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default AgregarLibro;
