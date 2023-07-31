const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name must have at least 3 letters, yo!'],
        required: true
    },
    number: {
        type: String,
        minLength: [8, 'Number must have at least 8 letters and be formed of two parts seperated by -, got {VALUE}'],
        validate: {
            validator: function(v) {
                return /^\d{2}\d?-\d{6,}$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number, form: 2/3 letters - at least 6 letters!`
        },
        required: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

