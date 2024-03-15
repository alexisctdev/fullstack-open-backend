const mongoose = require('mongoose')

if (process.argv < 3) {
  console.log('error, missing password')
}

//Config
const PASSWORD = process.argv[2]
const URL = `mongodb+srv://fullstack:${PASSWORD}@cluster0.kyezn9p.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

//connection
async function connection() {
  try {
    await mongoose.connect(URL)
    console.log('Database connected.')
  } catch (err) {
    console.error(err)
  }
}

// Schema:
const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('persons', personSchema)

if (process.argv.length === 3) {
  connection()

  Person.find({}).then((res) => {
    console.log('phonebook:')

    res.forEach(({ name, number }) => {
      console.log(name, number)
    })

    mongoose.connection.close()
  })
}

if (process.argv.length === 4) {
  console.log('error, missing number.')
}

if (process.argv.length === 5) {
  connection()

  const personToSave = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  personToSave.save().then((res) => {
    console.log(`added ${res.name} number: ${res.number} to phonebook`)
    mongoose.connection.close()
  })
}
