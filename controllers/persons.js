const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})


personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {next(error)})
})


personsRouter.delete('/:id', (request, response, next) => {

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log('delete result: ',result)
            if (result) {
                response.status(204).json({
                    message: 'person has been deleted.'
                })
            } else {
                response.status(204).json({
                    error: 'person does not exist and thus cannot be deleted.'
                })
            }
        })
        .catch(error => next(error))
})

personsRouter.get('/info', (request, response) => {
    let date = new Date()

    Person.find({})
        .then(persons => {
            response.send(
                `<div>Phonebook has info for ${persons.length} people</div>
                <br>
                <div>${date}</div>`
            )
        })
})

personsRouter.post('/', (request, response, next) => {
    if (!request.body.name || !request.body.number){
        return response.status(400).json({
            error: 'either the name or number is missing'
        })
    }

    const person = new Person({
        name: request.body.name, 
        number: request.body.number
    })


    person.save()
        .then(savedPerson => response.json(savedPerson) )
        .catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body

    if (!number) {
        return response.status(400).json({
            error: 'cannot update with an empty number'
        })
    }

    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

module.exports = personsRouter