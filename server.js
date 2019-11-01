const express = require('express')
const helmet = require('helmet')
const cors =  require('cors')
const projectsRouter = require('./routers/projectsRouter')
const actionsRouter = require('./routers/actionsRouter')

const server = express()

server.use(express.json())
server.use(helmet())
server.use(cors())

server.get('/', (req, res) => {
    res.send('<h2>Write some sweet code</h2>')
})

server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)


module.exports = server;