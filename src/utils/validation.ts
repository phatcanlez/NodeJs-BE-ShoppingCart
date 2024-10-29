import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //chạy để tạo danh sách lỗi để cất vào trong req
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObj = errors.mapped() //danh sách các lỗi dạng object
    const entityError = new EntityError({ errors: {} }) //đây là object lỗi mà mình muốn thay thế
    //duyệt key
    //tìm trong danh sách lỗi có lỗi nào có status khác 422 thì next(err) ra trc để lọc lỗi khác 422 để mảng lỗi còn lại là 422 thôi
    for (const key in errorsObj) {
      //lấy msg trong từng trường dữ liệu của errorsObj ra
      const { msg } = errorsObj[key]
      //nếu msg có dạng ErrorWithStatus và có status khác 422 thì mình next(err) nó ra trc
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(errorsObj[key]) //return ở đây là next xong ngắt chương trình
      }
      //nếu không phải dạng đặc biệt thì thêm vào entityError
      entityError.errors[key] = msg //nhét key là tên lỗi, msg là nội dung lỗi
    }
    next(entityError)
  }
}
