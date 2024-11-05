import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@canlez.givjd.mongodb.net/?retryWrites=true&w=majority&appName=Canlez`

class DatabaseServices {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  get users(): Collection<User> {
    //accessor, khi dùng thì chỉ cần gọi databaseServices.users (bộ get set)
    return this.db.collection(process.env.DB_USERS_COLLECTION as string) //nói với ts rằng nó sẽ đưa string
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('There was an error connecting to MongoDB: ', error)
      throw error
    }
  }
}

//tạo bản thể
const databaseServices = new DatabaseServices()

export default databaseServices //giống tên file nên để default
