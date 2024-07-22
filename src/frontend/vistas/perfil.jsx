import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import appFirebase, { db } from '../../../firebaseConfig';

const auth = getAuth(appFirebase);

const Perfil = () => {
  const [userName, setUserName] = useState('');
  const [likedBooks, setLikedBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [likedBookDetails, setLikedBookDetails] = useState([]);
  const [readBookDetails, setReadBookDetails] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'usuarios', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.nombre);
          setLikedBooks(userData.likedBooks || []);
          setReadBooks(userData.readBooks || []);
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();

    navigation.setOptions({
      headerRight: () => (
        <Button title="Cerrar sesión" onPress={handleSignOut} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchBooksDetails = async (bookIds, setBookDetails) => {
      if (bookIds.length === 0) return;
      try {
        const booksCollection = collection(db, 'Books');
        const q = query(booksCollection, where('__name__', 'in', bookIds));
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookDetails(booksData);
      } catch (error) {
        console.error('Error fetching book details: ', error);
      }
    };

    fetchBooksDetails(likedBooks, setLikedBookDetails);
    fetchBooksDetails(readBooks, setReadBookDetails);
  }, [likedBooks, readBooks]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleRead = async (bookId) => {
    try {
      const userDocRef = doc(db, 'usuarios', auth.currentUser.uid);

      if (readBooks.includes(bookId)) {
        // If already read, remove from read list
        await updateDoc(userDocRef, {
          readBooks: arrayRemove(bookId),
        });
        setReadBooks(prev => prev.filter(id => id !== bookId));
      } else {
        // If not read, add to read list
        await updateDoc(userDocRef, {
          readBooks: arrayUnion(bookId),
        });
        setReadBooks(prev => [...prev, bookId]);
      }
    } catch (error) {
      console.error('Error updating read status: ', error);
    }
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookContainer}>
      <Image source={{ uri: item.portadaURL }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.titulo}</Text>
        <Text style={styles.bookAuthor}>{item.autor ? item.autor.join(', ') : 'Autor desconocido'}</Text>
        <Text style={styles.bookDate}>{item.fechaPublicacion}</Text>
        <Text style={styles.bookDescription}>{item.descripcion}</Text>
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => handleRead(item.id)}
        >
          <Text style={styles.readButtonText}>
            {readBooks.includes(item.id) ? 'Leído' : 'Marcar como leído'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido {userName}</Text>
      <Text style={styles.likedBooksTitle}>Libros que te gustan:</Text>
      <FlatList
        data={likedBookDetails}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
      <Text style={styles.readBooksTitle}>Mis libros leídos:</Text>
      <FlatList
        data={readBookDetails}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  likedBooksTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  readBooksTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  bookContainer: {
    flex: 1,
    flexDirection: 'column', 
    alignItems: 'center', 
    marginBottom: 15, 
    padding: 10, 
    borderRadius: 10, 
    backgroundColor: '#f8f8f8', 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginHorizontal: 5,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 10, 
  },
  bookInfo: {
    flexDirection: 'column',
    flexShrink: 1,
    marginTop: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  bookDate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  bookDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  readButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  readButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
});

export default Perfil;
