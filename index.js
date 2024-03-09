const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const app = express()
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})

app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

morgan.token('body', (req) => req.method === 'POST' && JSON.stringify(req.body))

app.get(('*', (req, res, next) => {
  res.status(404).json({error: '404'})
}))

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const personID = Number(req.params.id)
  const person = persons.find((person) => person.id === personID)

  if (!person) {
    return res.status(404).end()
  }

  res.json(person)
})

app.get('/info', (req, res) => {
  const numberOfpersons = persons.length
  const date = new Date().toString()

  res.send(
    `<section> 
      <p>Phone book has info for ${numberOfpersons} people.</p>
      <p>${date}</p> 
    </section>`
  )
})

app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  persons = persons.filter((person) => person.id !== personId)
  res.status(204).end()
})

function generateRandomId() {
  return Math.round(Math.random() * 1000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    })
  }

  const repitedPerson = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  )

  if (repitedPerson) {
    return res.status(400).json({
      error: 'name must be unique',
    })
  }

  const newPerson = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})
