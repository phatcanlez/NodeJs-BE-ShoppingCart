import { NextFunction, Request, Response } from 'express'
import { LoginReqBody, LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/users.requests'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import HttpStatus from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'

//controller là handler có nhiệm vụ sử lí logic các thông tin khi đã vào
//các thông tin khi đã vào controller thì phải clean

// export const loginController = (req: Request, res: Response) => {
//   //vào đây là ko kiểm tra dữ liệu nữa, chỉ cần dùng thôi
//   const { email, password } = req.body
//   //vào database kiểm tra xem email và password có đúng ko
//   //xà lơ
//   if (email === 'lehodiep@gmail.com' && password === '123') {
//     res.status(200).json({
//       message: 'Login success',
//       data: {
//         fname: 'Điệp',
//         yob: 1999
//       }
//     })
//   } else {
//     res.status(400).json({
//       message: 'Login failed'
//     })
//   }
// }

//registerController nhận vào thông tin đăng ký của người dùng và vào database để tạo user mới lưu vào
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body
  //vào database nhét vào collection users

  //kiểm tra email có tồn tại chưa, trùng hay ko
  const isDup = await usersServices.checkEmailExist(email)
  if (isDup) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY, //422
      message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }

  const result = await usersServices.register(req.body)
  res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

//loginController nhận vào thông tin đăng nhập của người dùng và vào database để kiểm tra thông tin đó có đúng ko
export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  //dùng email và password để tìm user đang sở hữu chúng
  //nếu có user đó tồn tại nghĩa là đăng nhập thành công
  const { email, password } = req.body
  //vào database kiểm tra xem email và password có đúng ko
  const result = await usersServices.login({ email, password })
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body

  //so user_id trong payload với user_id trong token có phải là 1 ko
  const { user_id: user_id_at } = req.decoded_authorization as TokenPayload
  const { user_id: user_id_rf } = req.decoded_refresh_token as TokenPayload
  if (user_id_at !== user_id_rf) {
    console.log('refresh_token', req.decoded_authorization)
    console.log('req.decoded_authorization', req.decoded_authorization)
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.INVALID_TOKEN
    })
  }
  //nếu đã khớp mã, thì kiểm tra xem có rf trong token ko
  await usersServices.checkRefreshToken({ user_id: user_id_rf, refreshToken: refresh_token })
  //nếu có thì xóa rf trong database
  await usersServices.logout(user_id_rf)
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}
