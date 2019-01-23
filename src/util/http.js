import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 10000 // 设置超时时间
axios.defaults.baseURL = 'http://113.105.246.233:9100'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    config.header = {
      'Content-type': 'multipart/form-data'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export function fetch (url, params = {}) {
  // eslint-disable-next-line
  return new Promise((reslove, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        reslove(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function post (url, data = {}) {
  // eslint-disable-next-line
  return new Promise((reslove, reject) => {
    axios.post(url, data)
      .then(response => {
        reslove(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
