const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

////////////////////////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////////////////////////

app.use('/lists', require('./routes/lists'))
// app.use('/cohorts', require('./routes/cohorts'))
// app.use('/students', require('./routes/students'))

////////////////////////////////////////////////////////////////////////////////
// Default Route
////////////////////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
  next({ status: 404, message: 'Route not found' })
})

////////////////////////////////////////////////////////////////////////////////
// Error Handling
////////////////////////////////////////////////////////////////////////////////

app.use((err, req, res, next) => {
  const errorMessage = {}

  errorMessage.status = err.status || 500
  errorMessage.message = err.message || 'Internal Server Error'
  if (process.env.NODE_ENV !== 'production' && err.stack) errorMessage.stack = err.stack

  res.status(errorMessage.status).send(errorMessage)
})

////////////////////////////////////////////////////////////////////////////////
// Starting Server
////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 3000
const listener = () => { console.log(`Listening on port ${port}`) }

app.listen(port, listener)
