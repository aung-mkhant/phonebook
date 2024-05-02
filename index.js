const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(cors())


morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
// ':method :url :status :res[content-length] - :response-time ms :data'


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))



let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    if (!persons.length) {
        return 1
    }
    const id = Math.max(...persons.map(person => person.id))
    return id + 1
}

app.get('/api/persons', (req, res) => {
    res.send(persons)
})


app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const foundPerson = persons.filter(person => person.id === id)
    if (foundPerson.length) {
        res.send(foundPerson)
    } else {
        res.status(400).json({
            error: 'Content missing'
        })
    }
})
app.post('/api/persons', (req, res) => {

    const body = req.body
    if (!body.name || !body.number) {
        res.status(400).json({
            error: 'content missing'
        })
    }
    if (persons.find((person) => person.name === body.name)) {
        res.status(400).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons.push(newPerson)
    res.send(newPerson)

})
app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    const updatedPerson = {
        name: body.name,
        number: body.number,
        id
    }
    persons.push(updatedPerson)
    res.send(updatedPerson)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const foundPerson = persons.find(person => person.id === id)
    if (!foundPerson) {
        res.status(400).json({
            error: 'person not found'
        })
    }
    persons = persons.filter(person => person.id !== id)
    res.status(200).json({
        message: 'person succesfully deleted'
    })

})

app.get('/info', (req, res) => {
    res.send(
        `<div>
            <p>Phone has info for ${persons.length} people.</p>
            <p>${new Date().toLocaleTimeString()}</p>
        </div>`
    )
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('listening on port', PORT))
