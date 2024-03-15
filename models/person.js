const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const URL = process.env.MONGODB_URI

console.log('conntecing to MongoDB' )

mongoose
  .connect(URL)
  .then(() => {
    console.log('connected to MongoDB.')
  })
  .catch((error) => {
    console.log('An error has ocurred', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'User phone number required'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('persons', personSchema)
