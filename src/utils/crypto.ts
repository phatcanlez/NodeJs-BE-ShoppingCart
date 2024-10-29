import { createHash } from 'crypto'
import dotenv from 'dotenv'
dotenv.config()
//Nhận vào content nào đó và mã hóa thành sha256
function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

//Viết hàm mã hóa password
export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}
