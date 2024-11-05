//file này dùng để định nghĩa lại các request mà người dùng gửi lên
//có hiệu lực mạnh nhất trong cây thư mục
import { Request } from 'express'
import { TokenPayload } from '~/models/requests/users.requests'

declare module 'express' {
  // t muốn sử Request của express nhưng t muốn thêm 1 cái gì đó vào đó
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
