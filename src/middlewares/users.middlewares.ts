//import các interface của express để sử dụng cho việc định nghĩa
import { Request, Response, NextFunction } from 'express' //3 interface để mô tả request, response và next
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
