//tầng lọc lỗi, file định nghĩa làm handler tổng
//nơi mà chứa lỗi từ toàn bộ hệ thống sẽ đổ về đây
//lỗi từ validate đỗ về đây sẽ có mã 422 mình có thể tận dụng
//đôi khi trong validate có lỗi khác mã 422 mình sẽ next(err) ra trc để lọc (ErrorWithStatus)
//lỗi từ controller có thể là lỗi do mình ErrorWithStatus hoặc lỗi do mình throw ra
//lỗi rớt mạng ko có status
//lỗi từ các nơi đỗ về có thể có hoặc ko có status
import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { omit } from 'lodash'
import { ErrorWithStatus } from '~/models/Error'

export const defaultErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  //lỗi từ mọi nguồn đổ về đây đc chia làm 2 dạng error with status và phần còn lại
  //nếu lỗi có status thì trả về status đó
  if (error instanceof ErrorWithStatus) {
    res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(error, ['status']))
  } else {
    //khi error là những lỗi còn lại, có rất nhiều thông tin lạ, ko có status
    Object.getOwnPropertyNames(error).forEach((key) => {
      Object.defineProperty(error, key, { enumerable: true })
    })
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      errInfor: omit(error, ['stack']) //lấy tất cả thông tin của err trừ stack
    })
  }
}
