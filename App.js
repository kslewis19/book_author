const express = require('express')
const app = express()
const port = 8000
const cors = require('cors')
const db = require('./firebase')
const admin = require('firebase-admin');
require('dotenv').config()
const API_KEY = process.env.REST_API_KEY
app.use(express.json())
const jwt = require('jsonwebtoken');
app.use(cors())
const accessTokenSecret = 'youraccesstokensecret';
const userID = "bob"


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
app.get('/library', (req, res) => {

    const ref = db.collection('users').doc(userID);
    async function call() {
        var doc = await ref.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            //console.log('Document data:', doc.data());
            res.json({ library: doc.data().library })
        }

    }
    call()




})
app.get('/book', (req, res) => {
    var bookTitle = req.query.title


    const fetchAuthor = () => {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&key=${API_KEY}`;
        const axios = require('axios');
        axios.get(url)
            .then(response => {
                //console.log(response.data.items);
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

    const ref = db.collection('users').doc(userID);
    const unionRes = ref.update({
        library: admin.firestore.FieldValue.arrayUnion(req.body)
    });

    //console.log(bookLibrary, ref.id)
})
app.post('/delete', (req, res) => {

    const ref = db.collection('users').doc(userID);
    const unionRes = ref.update({
        library: admin.firestore.FieldValue.arrayRemove(req.body)
    });
    res.send('POST request to the homepage')
})
app.post('/edit', (req, res) => {

    const ref = db.collection('users').doc(userID);
    const unionRes = ref.update({
        library: admin.firestore.FieldValue.arrayRemove(req.body.old)
    });
    const unionRes2 = ref.update({
        library: admin.firestore.FieldValue.arrayUnion(req.body.new)
    });
    res.send('POST request to the homepage')
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})