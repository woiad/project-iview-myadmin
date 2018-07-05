import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000
axios.defaults.baseUrl = 'http://113.105.246.233:9100'

// http reruest 拦截器
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
