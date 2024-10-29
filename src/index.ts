import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express'

const app = express()
import usersRouter from './routes/users.routers'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'

const port = 3000

//kết nối database
databaseServices.connect()

app.get('/', (req, res) => {
  res.send('hello world')
})

//cho server chạy middleware chuyển json
app.use(express.json()) //middleware này sẽ chuyển các request từ client lên server từ chuỗi thành json, use là middleware cục bộ

app.use('/users', usersRouter) //app sẽ sử dùng bộ route của usersRouter

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})
