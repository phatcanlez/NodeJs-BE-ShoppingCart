import { NextFunction, Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/users.requests'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import HttpStatus from '~/constants/httpStatus'

//controller là handler có nhiệm vụ sử lí logic các thông tin khi đã vào
//các thông tin khi đã vào controller thì phải clean

export const loginController = (req: Request, res: Response) => {
  //vào đây là ko kiểm tra dữ liệu nữa, chỉ cần dùng thôi
  const { email, password } = req.body
  //vào database kiểm tra xem email và password có đúng ko
  //xà lơ
  if (email === 'lehodiep@gmail.com' && password === '123') {
    res.status(200).json({
      message: 'Login success',
      data: {
        fname: 'Điệp',
        yob: 1999
      }
    })
  } else {
    res.status(400).json({
      message: 'Login failed'
    })
  }
}

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
      message: 'Email already exists'
    })
  }

  const result = await usersServices.register(req.body)
  res.status(201).json({
    message: 'Register success',
    data: result
  })
}
