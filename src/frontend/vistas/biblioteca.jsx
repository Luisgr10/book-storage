import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const Biblioteca = () => {
  const [books, setBooks] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [likedBooks, setLikedBooks] = useState(new Set());
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Books'));
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksData);
        setFilteredData(booksData);
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };

    const fetchLikedBooks = async () => {
      try {
        const userDocRef = doc(db, 'usuarios', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setLikedBooks(new Set(userDoc.data().likedBooks || []));
        }
      } catch (error) {
        console.error('Error fetching liked books: ', error);
      }
    };

    fetchBooks();
    fetchLikedBooks();
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = books.filter(item => {
        const itemData = item.titulo ? item.titulo.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(books);
      setSearch(text);
    }
  };

  const handleLike = async (bookId) => {
    try {
      const userDocRef = doc(db, 'usuarios', auth.currentUser.uid);

      if (likedBooks.has(bookId)) {
        await updateDoc(userDocRef, {
          likedBooks: arrayRemove(bookId),
        });
        setLikedBooks(prev => {
          const updatedLikes = new Set(prev);
          updatedLikes.delete(bookId);
          return updatedLikes;
        });
      } else {
        await updateDoc(userDocRef, {
          likedBooks: arrayUnion(bookId),
        });
        setLikedBooks(prev => new Set(prev).add(bookId));
      }
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookContainer}>
      <Image source={{ uri: item.portadaURL }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.titulo}</Text>
        <Text style={styles.bookAuthor}>{item.autor.join(', ')}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => navigation.navigate('Detalles', { bookId: item.id })}
          >
            <Text style={styles.infoButtonText}>Más Información</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(item.id)}
          >
            <Text style={styles.likeButtonText}>
              {likedBooks.has(item.id) ? <AntDesign name="heart" size={20} color="red" /> : <AntDesign name="hearto" size={20} color="black" />}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar libros"
          value={search}
          onChangeText={(text) => searchFilterFunction(text)}
        />
      </View>
      {filteredData.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron libros</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AgregarLibro')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>¿Deseas agregarlo?</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    paddingTop: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  bookContainer: {
    flexDirection: 'row',
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
    width: '90%',
  },
  bookInfo: {
    flexDirection: 'column',
    flexShrink: 1,
    marginLeft: 10,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
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
  likeButton: {
    paddingTop: 10,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  likeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#525fe1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  infoButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Biblioteca;
