const { Router } = require('express');
const { db } = require('../backend/firebase.js');
const { isGoogleComputeEngineMACAddress } = require('gcp-metadata');

const router = Router();

// GET /books
router.get('/books', async (req, res) => {
    try {
        const querySnapshot = await db.collection('Books').get();
        const books = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.send(books);
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        res.status(500).send('Error al obtener los libros');
    }
});

// GET /books/:id
router.get('/book/:id', async (req, res) => {
    const bookId = req.params.id;
    
    try {
        const doc = await db.collection('Books').doc(bookId).get();

        if (!doc.exists) {
            return res.status(404).send('Libro no encontrado');
        }

        const bookData = {
            id: doc.id,
            ...doc.data()
        };

        res.send(bookData);
    } catch (error) {
        console.error('Error al obtener el libro:', error);
        res.status(500).send('Error al obtener el libro');
    }
});

// POST /books
router.post('/book', async (req, res) => {
    try {
        const bookData = req.body;

        // Añadir el nuevo libro a Firestore
        const docRef = await db.collection('Books').add(bookData);
        const newBook = await docRef.get();

        res.status(201).send({ id: docRef.id, ...newBook.data() });
    } catch (error) {
        console.error('Error al crear el libro:', error);
        res.status(500).send('Error al crear el libro');
    }
});

// PUT /books/:id
router.put('/book/:id', async (req, res) => {
    const bookId = req.params.id;
    const updatedData = req.body;

    try {
        const docRef = db.collection('Books').doc(bookId);
        await docRef.update(updatedData);

        res.send({ id: bookId, ...updatedData });
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        res.status(500).send('Error al actualizar el libro');
    }
});

// DELETE /books/:id
router.delete('/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        await db.collection('Books').doc(bookId).delete();

        res.send(`Libro con ID ${bookId} eliminado correctamente`);
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        res.status(500).send('Error al eliminar el libro');
    }
});

module.exports = router;  
