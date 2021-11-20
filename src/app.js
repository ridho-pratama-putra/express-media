const express = require('express')
const app = express()
const port = 4001
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const responseFactory = require('./models/response')
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_CONFLICT } = require('./constants/HttpStatus')
app.use(cors())
var morgan = require('morgan')

const originalSend = app.response.send
app.response.send = function sendOverWrite (body) {
    originalSend.call(this, body)
    this.__custombody__ = body
}
morgan.token('body', (req) => JSON.stringify(req.body))
morgan.token('response', (_, res) => JSON.stringify(res.__custombody__))
app.use(morgan(':date[iso] :remote-addr :method :url :status :body :response - :response-time ms'))

app.get('/', (req, res) => {
    return res.status(HTTP_STATUS_OK).json(responseFactory({
        code: '00',
        description: 'Content retrieved',
    }, [{}]))
})

app.get('/video', (req, res) => {
    res.sendFile('assets/Ello - Masih ada.mp4', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
