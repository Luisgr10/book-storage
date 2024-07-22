import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Button, Alert } from 'react-native';

const Detalles = ({ route, navigation }) => {
    const { bookId } = route.params;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://192.168.1.34:3000/book/${bookId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el libro');
                }
                const data = await response.json();
                setBook(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    const handleEdit = () => {
        navigation.navigate('EditBook', { bookId }); // Navegar a la pantalla de edición
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://192.168.1.34:3000/book/${bookId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el libro');
            }
            Alert.alert('Éxito', 'Libro eliminado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }, // Volver a la pantalla anterior
            ]);
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setModalVisible(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    if (!book) {
        return <Text>Libro no encontrado</Text>;
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: book.portadaURL }} style={styles.coverImage} />
            <Text style={styles.title}>{book.titulo}</Text>
            <Text style={styles.author}>Autor: {book.autor.join(', ')}</Text>
            <Text style={styles.description}>Descripción: {book.descripcion}</Text>
            <Text style={styles.publicationDate}>Fecha de Publicación: {book.fechaPublicacion}</Text>
            <Text style={styles.genre}>Género: {book.genero.join(', ')}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este libro?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Eliminar" color="red" onPress={handleDelete} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    coverImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    author: {
        fontSize: 18,
        marginVertical: 5,
    },
    description: {
        fontSize: 16,
        marginVertical: 5,
    },
    publicationDate: {
        fontSize: 16,
        marginVertical: 5,
    },
    genre: {
        fontSize: 16,
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default Detalles;


