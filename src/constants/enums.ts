//chứa các định nghĩa của enum
export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum USER_ROLE {
  Admin, //0
  Staff, //1
  User //2
}

export enum TOKEN_TYPE {
  ACCESS_TOKEN, //0
  REFRESH_TOKEN, //1
  RESET_PASSWORD_TOKEN, //2
  VERIFY_EMAIL_TOKEN
}
