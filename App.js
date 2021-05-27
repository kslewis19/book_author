const express = require('express')
const app = express()
const port = 8000
const cors = require('cors')
require('dotenv').config()
const API_KEY = process.env.REST_API_KEY
app.use(express.json())
app.use(cors())

const authorData = {
    "it": "stephan king"
}
var bookLibrary = []

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/library', (req, res) => {
    res.json({ library: bookLibrary })
})
app.get('/book', (req, res) => {
    var bookTitle = req.query.title


    const fetchAuthor = () => {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&key=${API_KEY}`;
        const axios = require('axios');
        axios.get(url)
            .then(response => {
                console.log(response.data.items);
                const author = response.data.items[0].volumeInfo.authors[0]
                const books = response.data.items
                if (author != null) {
                    res.json({ author: author, books: books })
                }
            }, error => {
                console.log(error);
            });

    }
    fetchAuthor()
    //res.json({ author: authorData[bookTitle] })
})
app.post('/book', (req, res) => {

    res.send('POST request to the homepage')
    bookLibrary.push(req.body)
    console.log(bookLibrary)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})