const express = require('express')
const app = express()
const port = 8000
const cors = require('cors')
require('dotenv').config()
const API_KEY = process.env.REST_API_KEY
app.use(express.json())
const jwt = require('jsonwebtoken');
app.use(cors())
const accessTokenSecret = 'youraccesstokensecret';

const authorData = {
    "it": "stephan king"
}
const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
];
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
var bookLibrary = []

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/library', authenticateJWT, (req, res) => {
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

app.post('/login', (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret);

        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});
app.post('/book', (req, res) => {

    res.send('POST request to the homepage')
    bookLibrary.push(req.body)
    console.log(bookLibrary)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})