require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/persons')

app.use(express.static('dist'))
app.use(cors())






morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
// ':method :url :status :res[content-length] - :response-time ms :data'


app.use(express.json())



app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
})


app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person)

            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})
app.post('/api/persons', (req, res, next) => {
    const body = req.body
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(err => next(err))

})
app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body
    const id = req.params.id
    const updatedPerson = {
        name,
        number
    }
    Person.findByIdAndUpdate(id, updatedPerson, {
        new: true,
        runValidators: true,
        context: 'query'
    })
        .then(updatedNote => res.json(updatedNote))
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {

    const id = req.params.id

    Person.findByIdAndDelete(id)
        .then(result => res.status(204).end())
        .catch(err => next(err))
})

app.get('/info', (req, res) => {
    res.send(
        `<div>
            <p>Phone has info for ${persons.length} people.</p>
            <p>${new Date().toLocaleTimeString()}</p>
        </div>`
    )
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({
            error: 'malformatted id'
        })
    }
    if (error.name === 'ValidationError') {
        return res.status(400).send({
            error: error.message
        })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log('listening on port', PORT))
