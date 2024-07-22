import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const Biblioteca = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [likedBooks, setLikedBooks] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchBooks = async () => {
    setRefreshing(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Books"));
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books: ", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchLikedBooks = async () => {
    try {
      const userDocRef = doc(db, "usuarios", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setLikedBooks(new Set(userDoc.data().likedBooks || []));
      }
    } catch (error) {
      console.error("Error fetching liked books: ", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchLikedBooks();
  }, []);

  const searchFilterFunction = (text) => {
    setSearch(text);
  };

  const filteredData = books.filter((item) => {
    const itemData = item.titulo ? item.titulo.toUpperCase() : "".toUpperCase();
    const textData = search.toUpperCase();
    return itemData.indexOf(textData) > -1;
  });

  const handleLike = async (bookId) => {
    try {
      const userDocRef = doc(db, "usuarios", auth.currentUser.uid);

      if (likedBooks.has(bookId)) {
        await updateDoc(userDocRef, {
          likedBooks: arrayRemove(bookId),
        });
        setLikedBooks((prev) => {
          const updatedLikes = new Set(prev);
          updatedLikes.delete(bookId);
          return updatedLikes;
        });
      } else {
        await updateDoc(userDocRef, {
          likedBooks: arrayUnion(bookId),
        });
        setLikedBooks((prev) => new Set(prev).add(bookId));
      }
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const renderBook = useCallback(({ item }) => (
    <View style={styles.bookContainer}>
      <Image source={{ uri: item.portadaURL }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.titulo}</Text>
        <Text style={styles.bookAuthor}>{item.autor.join(", ")}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => navigation.navigate("Detalles", { bookId: item.id })}
          >
            <Text style={styles.infoButtonText}>Más Información</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(item.id)}
          >
            {likedBooks.has(item.id) ? (
              <AntDesign name="heart" size={20} color="red" />
            ) : (
              <AntDesign name="hearto" size={20} color="#333" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [likedBooks, navigation]);

  const onRefresh = () => {
    fetchBooks();
  };

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
            onPress={() => navigation.navigate("AgregarLibro")}
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
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            refreshing ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  bookContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "90%",
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  infoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  likeButton: {
    marginLeft: 15,
  },
  noResultsContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 18,
    color: "#777",
  },
  addButton: {
    marginTop: 15,
    backgroundColor: "#525fe1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 20,
  },
});

export default Biblioteca;
