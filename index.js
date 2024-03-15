const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

morgan.token('body', (req) => req.method === 'POST' && JSON.stringify(req.body))

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/info', (req, res, next) => {
  Person.countDocuments()
    .then((result) => {
      const numberOfPersons = result
      const date = new Date().toString()

      res.send(
        `<section> 
          <p>Phone book has info for ${numberOfPersons} people.</p>
          <p>${date}</p> 
        </section>`
      )
    })
    .catch((error) => {
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const personObject = {
    name: body.name,
    number: body.number,
  }

  const config = {
    new: true,
    runValidators: true,
    context: 'query',
  }

  Person.findByIdAndUpdate(req.params.id, personObject, config)
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
