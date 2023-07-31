const mongoose = require('mongoose')

const len = process.argv.length
if (len !== 3 && len !== 5) {
  console.log('Usage: <node mongo.js [password]> optional:[name number]')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://daanmann:${password}@sourcecluster.ji9ddiv.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (len === 5){
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name, 
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}



