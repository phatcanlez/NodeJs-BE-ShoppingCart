import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { LoginReqBody, RegisterReqBody } from '~/models/requests/users.requests'
import { hashPassword } from '~/utils/crypto'
import { jwtSign } from '~/utils/jwt'
import { TOKEN_TYPE } from '~/constants/enums'
import * as process from 'node:process'
import { ErrorWithStatus } from '~/models/Error'
import { USERS_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'

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

    //lưu refresh token vào database
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(result.insertedId),
        token: refreshToken
      })
    )

    return { accessToken, refreshToken }
  }

  async login({ email, password }: LoginReqBody) {
    const user = await databaseServices.users.findOne({
      email,
      password: hashPassword(password)
    })
    //email và password không đúng => ko tìm thấy user
    if (!user) {
      //nếu không tìm thấy user
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    //nếu qua if thì nghĩa là có user => đúng
    //tạo accessToken và refreshToken
    const user_id = user._id.toString()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    //lưu refresh token vào database
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user._id),
        token: refreshToken
      })
    )

    //ném ra object có 2 token
    return { accessToken, refreshToken }
  }

  async checkRefreshToken({ user_id, refreshToken }: { user_id: string; refreshToken: string }) {
    const refreshTokenInDB = await databaseServices.refreshTokens.findOne({
      user_id: new ObjectId(user_id),
      token: refreshToken
    })
    if (!refreshTokenInDB) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.INVALID_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    return refreshTokenInDB
  }

  public async logout(refreshToken: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refreshToken })
  }

  private async signAccessToken(user_id: string) {
    return jwtSign({
      payload: { user_id, token_type: TOKEN_TYPE.ACCESS_TOKEN },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  private async signRefreshToken(user_id: string) {
    return jwtSign({
      payload: { user_id, token_type: TOKEN_TYPE.REFRESH_TOKEN },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }
}

const usersServices = new UsersServices()
export default usersServices
