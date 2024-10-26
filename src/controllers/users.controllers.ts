import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
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
export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  //vào database nhét vào collection users
  try {
    const result = await usersServices.register({ email, password })
    res.status(201).json({
      message: 'Register success',
      data: result
    })
  } catch (error) {
    res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}
