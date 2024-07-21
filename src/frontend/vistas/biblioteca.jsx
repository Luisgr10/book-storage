import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../../firebaseConfig"


const Biblioteca = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Books'));
        const booksData = querySnapshot.docs.map(doc => doc.data());
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchBooks();
  }, []);

  const renderBook = ({ item }) => (
    <View style={styles.bookContainer}>
      <Image source={{ uri: item.portadaURL }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
      <Text style={styles.bookTitle}>{item.titulo}</Text>
      <Text style={styles.bookAuthor}>{item.autor.join(', ')}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Esta es tu biblioteca</Text>
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  bookContainer: {
    flexDirection: 'row', // Organiza los elementos en fila
    alignItems: 'center', // Alinea verticalmente el contenido
    marginBottom: 15, // Espacio entre los elementos de la lista
    padding: 10, // Espaciado interno del contenedor
    borderRadius: 10, // Bordes redondeados
    backgroundColor: '#f8f8f8', // Color de fondo para cada celda
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '70%',
    marginHorizontal: 35,
  },
  bookInfo: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 10, // Bordes redondeados para la imagen
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginHorizontal: 25, 
    
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 5, // Espaciado horizontal alrededor del autor
  },
});

export default Biblioteca;
