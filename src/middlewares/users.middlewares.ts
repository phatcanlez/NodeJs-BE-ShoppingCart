//import các interface của express để sử dụng cho việc định nghĩa
import { Request, Response, NextFunction } from 'express' //3 interface để mô tả request, response và next
import { body, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import { jwtVerify } from '~/utils/jwt'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import process from 'node:process'
import { TokenPayload } from '~/models/requests/users.requests'
//middleware là gì ?
//là 1 handler có nhiệm vụ kiểm tra các giá trị mà người dùng gửi lên server
//nếu mà kiểm tra thành công thì mình next() để chuyển tiếp
//còn ko thì mình res.json

//mô phỏng người dùng muốn đăng nhập
//họ gửi request lên server: email và password
//req này phải đi qua middleware để kiểm tra xem email và password có hợp lệ ko
//vậy middleware sẽ chạy trước khi vào handler
//middleware ko truy xuất Database mà chỉ kiểm tra dữ liệu đầu vào
//
// export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
//   //   console.log(req.body)
//   //kiểm tra ...
//   //lấy email và password từ req.body ra kiểm tra
//   const { email, password } = req.body //destructuring
//   // nếu 1 trong 2 ko đc gửi lên thì trả về lỗi
//   if (!email || !password) {
//     res.status(400).json({
//       message: 'Missing email or password'
//     })
//   } else {
//     next()
//   }
// }

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1 //1 kí tự lạ
            // returnScore: true //password của mình đc bao nhiêu điểm
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1 //1 kí tự lạ
            // returnScore: true //password của mình đc bao nhiêu điểm
          },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: (value, { req }) => {
            //value chính là confirm password, req ở đây là destructering
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          // trường này thì cứ làm y chang ko cần cấu hình gì hết
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1 //1 kí tự lạ
            // returnScore: true //password của mình đc bao nhiêu điểm
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            //value này là BEARER token
            const refreshToken = value.split(' ')[1]
            if (!refreshToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              //người dùng có gửi lên refresh_token
              //verify refresh token(so sánh chữ ký thì mình sẽ tin vào payload có trong token)
              const decoded = await jwtVerify({
                token: refreshToken,
                privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              //decoded là object có 2 key: user_id và token_type
              //decode_authorization là payload của refresh token
              ;(req as Request).decoded_refresh_token = decoded
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message, //ép kiểu về JsonWebTokenError (bắt buộc)
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            //value này là BEARER token
            const accessToken = value.split(' ')[1]
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              //người dùng có gửi lên access_token
              //verify access token(so sánh chữ ký thì mình sẽ tin vào payload có trong token)
              const decoded_authorization = (await jwtVerify({
                token: accessToken,
                privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })) as TokenPayload
              const decoded_refresh_token = (await jwtVerify({
                token: value,
                privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
              })) as TokenPayload
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
              //decoded là object có 2 key: user_id và token_type
              //decode_authorization là payload của access token
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
          }
        }
      }
    },
    ['headers']
  )
)
