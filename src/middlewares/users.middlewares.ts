//import các interface của express để sử dụng cho việc định nghĩa
import { Request, Response, NextFunction } from 'express' //3 interface để mô tả request, response và next
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
//middleware là gì ?
//là 1 handler có nhiệm vụ kiểm tra các giá trị mà người dùng gửi lên server
//nếu mà kiểm tra thành công thì mình next() để chuyển tiếp
//còn ko thì mình res.json

//mô phỏng người dùng muốn đăng nhập
//họ gửi request lên server: email và password
//req này phải đi qua middleware để kiểm tra xem email và password có hợp lệ ko
//vậy middleware sẽ chạy trước khi vào handler
//middleware ko truy xuất Database mà chỉ kiểm tra dữ liệu đầu vào

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  //   console.log(req.body)
  //kiểm tra ...
  //lấy email và password từ req.body ra kiểm tra
  const { email, password } = req.body //destructuring
  // nếu 1 trong 2 ko đc gửi lên thì trả về lỗi
  if (!email || !password) {
    res.status(400).json({
      message: 'Missing email or password'
    })
  } else {
    next()
  }
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: 'Name is required'
      },
      isString: {
        errorMessage: 'Name must be a string'
      },
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: 'Name must be between 1 and 100 characters'
      }
    },
    email: {
      notEmpty: {
        errorMessage: 'Email is required'
      },
      isEmail: {
        errorMessage: 'Email is invalid'
      },
      trim: true
    },
    password: {
      notEmpty: {
        errorMessage: 'Password is required'
      },
      isString: {
        errorMessage: 'Password must be a string'
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: 'Password must be between 8 and 50 characters'
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
        errorMessage: 'Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol'
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: 'Password is required'
      },
      isString: {
        errorMessage: 'Password must be a string'
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: 'Password must be between 8 and 50 characters'
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
        errorMessage:
          'Confirm Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol'
      },
      custom: {
        options: (value, { req }) => {
          //value chính là confirm password, req ở đây là destructering
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
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
        errorMessage: 'Date of birth is invalid'
      }
    }
  })
)
