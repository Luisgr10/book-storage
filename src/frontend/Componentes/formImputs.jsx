import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const  FormImputs = ({ formData, setFormData }) => {
  const handleChange = (field) => (text) => {
    setFormData(prev => ({ ...prev, [field]: text }));
  };

  return (
    <View>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={formData.titulo}
        onChangeText={handleChange('titulo')}
        placeholder="Título del libro"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={formData.descripcion}
        onChangeText={handleChange('descripcion')}
        placeholder="Descripción del libro"
        multiline
      />

      <Text style={styles.label}>Género (separado por comas):</Text>
      <TextInput
        style={styles.input}
        value={formData.genero}
        onChangeText={handleChange('genero')}
        placeholder="Género del libro"
      />

      <Text style={styles.label}>Fecha de Publicación:</Text>
      <TextInput
        style={styles.input}
        value={formData.fechaPublicacion}
        onChangeText={handleChange('fechaPublicacion')}
        placeholder="Fecha de publicación (YYYY-MM-DD)"
      />

      <Text style={styles.label}>Autor (separado por comas):</Text>
      <TextInput
        style={styles.input}
        value={formData.autor}
        onChangeText={handleChange('autor')}
        placeholder="Autor del libro"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default FormImputs;
