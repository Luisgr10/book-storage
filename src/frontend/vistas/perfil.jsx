import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, Text, StyleSheet, SectionList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Fetch user data
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

  // Fetch book details
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

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Handle book read status
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
          likedBooks: arrayRemove(bookId),
        });
        setReadBooks(prev => [...prev, bookId]);
        setLikedBooks(prev => prev.filter(id => id !== bookId));
      }
    } catch (error) {
      console.error('Error updating read status: ', error);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchBooksDetails(likedBooks, setLikedBookDetails);
    await fetchBooksDetails(readBooks, setReadBookDetails);
    setRefreshing(false);
  }, [likedBooks, readBooks]);

  useEffect(() => {
    fetchUserData();
    navigation.setOptions({
      headerRight: () => (
        <Button title="Cerrar sesión" onPress={handleSignOut} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchBooksDetails(likedBooks, setLikedBookDetails);
    fetchBooksDetails(readBooks, setReadBookDetails);
  }, [likedBooks, readBooks]);

  // Render book item
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

  // Prepare data for SectionList
  const sections = [
    {
      title: 'Libros que te gustan:',
      data: likedBookDetails
    },
    {
      title: 'Mis libros leídos:',
      data: readBookDetails
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido {userName}</Text>
      <SectionList
        sections={sections}
        renderItem={renderBook}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
  sectionHeader: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
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
