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

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
}
