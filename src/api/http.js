import axios from 'axios'
import { API_BASE_URL, setupInterceptors } from './interceptors'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

setupInterceptors(http)

export default http
