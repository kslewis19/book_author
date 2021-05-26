const express = require('express')
const app = express()
const port = 8000

const authorData = {
    "it": "stephan king"
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/book', (req, res) => {

    res.send(authorData.req.query.title)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})