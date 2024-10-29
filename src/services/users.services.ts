import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody } from '~/models/requests/users.requests'
import { hashPassword } from '~/utils/crypto'
import { jwtSign } from '~/utils/jwt'
import { TOKEN_TYPE } from '~/constants/enums'
import * as process from 'node:process'

class UsersServices {
  constructor() {}

  async checkEmailExist(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return Boolean(user)
  }

  async register(payLoad: RegisterReqBody) {
    const result = await databaseServices.users.insertOne(
      new User({
        ...payLoad,
        password: hashPassword(payLoad.password),
        date_of_birth: new Date(payLoad.date_of_birth)
      })
    )
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(result.insertedId.toString()),
      this.signRefreshToken(result.insertedId.toString())
    ])
    return { accessToken, refreshToken }
  }

  private async signAccessToken(user_id: string) {
    return jwtSign({
      payload: { user_id, token_type: TOKEN_TYPE.ACCESS_TOKEN },
      privateKey: process.env.JWT_SECRET as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  private async signRefreshToken(user_id: string) {
    return jwtSign({
      payload: { user_id, token_type: TOKEN_TYPE.REFRESH_TOKEN },
      privateKey: process.env.JWT_SECRET as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }
}

const usersServices = new UsersServices()
export default usersServices
