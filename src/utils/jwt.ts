//file này chứa hàm chuyển đổi token bằng công nghệ jwt
//hàm chỉ tạo ra jwt chứ ko tạo ra ac hay rf
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const jwtSign = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: any
  privateKey: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    //báo trả về 1 promise<string>
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      else resolve(token as string) // ép kiểu về string
    })
  })
}
