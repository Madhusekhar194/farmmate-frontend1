const express = require('express');
const cors = require('cors');
const { setupDb } = require('./db');
const { generateEmbedding, cosineSimilarity } = require('./ai');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let db;

// Initialize DB and start server
setupDb().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

// CRUD: Get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await db.all('SELECT id, title, author, genre, description, status FROM books');
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD: Add a book
app.post('/api/books', async (req, res) => {
    const { title, author, genre, description } = req.body;
    try {
        const embedding = await generateEmbedding(`${title} ${genre} ${description}`);
        const result = await db.run(
            'INSERT INTO books (title, author, genre, description, embedding) VALUES (?, ?, ?, ?, ?)',
            [title, author, genre, description, JSON.stringify(embedding)]
        );
        res.status(201).json({ id: result.lastID, title, author, genre, description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI Search: Ask about a book
app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    try {
        const queryEmbedding = await generateEmbedding(prompt);
        const books = await db.all('SELECT * FROM books');

        if (books.length === 0) {
            return res.json({ answer: "Our library is currently empty. I can't find any books for you yet!" });
        }

        // Find the most similar book
        let bestMatch = null;
        let highestScore = -Infinity;

        books.forEach(book => {
            const bookEmbedding = JSON.parse(book.embedding);
            const score = cosineSimilarity(queryEmbedding, bookEmbedding);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = book;
            }
        });

        // Threshold for finding a match
        if (highestScore < 0.5) {
            return res.json({ answer: "I'm not sure we have exactly what you're looking for. Could you try a different topic or book title?" });
        }

        const availability = bestMatch.status === 'available' ? 'is available right now' : 'is currently borrowed';
        const response = `I found "${bestMatch.title}" by ${bestMatch.author}. It matches your request and it ${availability}. Description: ${bestMatch.description}`;

        res.json({ answer: response, book: bestMatch });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update book status
app.patch('/api/books/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.run('UPDATE books SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
