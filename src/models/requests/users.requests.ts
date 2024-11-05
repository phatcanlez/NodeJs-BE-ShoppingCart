// file này lưu các định nghĩa request mà người dùng gửi lên
import { JwtPayload } from 'jsonwebtoken'
import { TOKEN_TYPE } from '~/constants/enums'

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TOKEN_TYPE
}
