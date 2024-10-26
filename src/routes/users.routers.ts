import { log } from 'console'
import express from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'
//Các đường dẫn của Users
//dựng userRouter
const userRouter = express.Router()
//setup middlware - có thể có nhiều túi lọc
// userRouter.use( //này toàn cục - áp dụng cho tất cả các route cứ vào là gọi
//   (req, res, next) => {
//     console.log('Time1: ', Date.now())
//     //next là lưới lọc - thỏa điều kiện
//     next()
//     // res.status(400).send('not allowed')
//     console.log('Ahihi')
//   }
// )

//handler

// userRouter.get('/get-me', (req, res) => {
//   res.json({
//     data: {
//       name: 'Điệp',
//       yob: 1999
//     }
//   })
//   console.log('ahihi o')
// })

//handler
// userRouter.post('/login', loginValidator, (req, res) => {
//   console.log(req.query) //lây ra query từ client gửi lên

//   res.json({
//     data: {
//       name: 'Điệp',
//       yob: 1999
//     }
//   })
// })

//đăng nhập
userRouter.post('/login', loginValidator, loginController)

//đăng kí
userRouter.post('/register', registerController)

export default userRouter
