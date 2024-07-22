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
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
        await updateDoc(userDocRef, {
          readBooks: arrayRemove(bookId),
        });
        setReadBooks(prev => prev.filter(id => id !== bookId));
      } else {
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchBooksDetails(likedBooks, setLikedBookDetails);
    await fetchBooksDetails(readBooks, setReadBookDetails);
    setRefreshing(false);
  }, [likedBooks, readBooks]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchBooksDetails(likedBooks, setLikedBookDetails);
      await fetchBooksDetails(readBooks, setReadBookDetails);
      setLoading(false);
    };
    
    fetchData();
    
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleSignOut}>
        <Text style={styles.headerButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
      ),
    });
  }, [navigation, likedBooks, readBooks]);

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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fondo blanco para coherencia
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333', // Color de texto estándar
    textAlign: 'center',
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555555', // Color de texto para encabezados
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  bookContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  bookInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginVertical: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  bookDate: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  bookDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 8,
  },
  readButton: {
    marginTop: 12,
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  readButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Perfil;
