import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'

class UsersServices {
  constructor() {}

  async register(payLoad: { email: string; password: string }) {
    const { email, password } = payLoad
    const result = await databaseServices.users.insertOne(new User({ email, password }))
    return result
  }
}

const usersServices = new UsersServices()
export default usersServices
