const mongoose = require('mongoose');



const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then((result) => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB', error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5
    },
    number: {
        type: String,
        required: true
    }
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)