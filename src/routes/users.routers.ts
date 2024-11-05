import { log } from 'console'
import express from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
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
// userRouter.post('/login', loginValidator, loginController)

//đăng kí
/*
desc: register
path: /Register
method: post
body:{
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    date_of_birth: string có dạng ISO8601

}
*/
userRouter.post('/register', registerValidator, wrapAsync(registerController))

/*desc: login
path: users/login
method: post
body:{
    email: string,
    password: string
    }
*/
userRouter.post('/login', loginValidator, wrapAsync(loginController))

/*
desc: logout
path: users/logout
method: post
body:{
    accessToken: string,
    refreshToken: string

 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

export default userRouter
