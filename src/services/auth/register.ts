// import { post } from '../../config/axios'

// // Định nghĩa kiểu dữ liệu trong file
// export interface RegisterData {
//   email: string;
//   password: string;
//   name: string;
// }

// export interface ApiSuccessResponse<T = any> {
//   status: number;
//   data: {
//     message: string;
//     data: T;
//   };
// }

// export interface ApiErrorResponse {
//   status: number;
//   errors: {
//     message?: string;
//     errors?: {
//       email?: string[];
//       password?: string[];
//       name?: string[];
//       [key: string]: string[] | undefined;
//     };
//   };
// }

// export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// export interface AuthResponseData {
//   token: string;
// }

// const Register = async (data: RegisterData): Promise<ApiResponse<AuthResponseData>> => {
//   try {
//     const response = await post('auth/register', data)
//     return response as ApiResponse<AuthResponseData>
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

// export default Register
