// viết hàm wrapAsync để bắt lỗi cho các hàm async
//wrapAsync là hàm nhận vào req handler(middleware, controller)
// req handler ko có cấu trúc try catch next
//wrapAsync sẽ nhận và trả về 1 req handler khác

import { NextFunction, Response, Request, RequestHandler } from 'express'

export const wrapAsync = (fn: RequestHandler) => {
  return async (req: Request, res : Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
