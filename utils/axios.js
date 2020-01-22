
import axios from 'axios'

const http = axios.create({
    mode: 'cors',
    baseURL: process.env.NODE_ENV == 'production' ? 'https://192.168.128.162:7000' : 'http://192.168.128.11:7000'
    // withCredentials: true
})

export function invokeApi(method, url, data, callbackOK, callbackNG) {
    http[method](url, data)
        .then((resp) => {
            return callbackOK(resp)
        })
        .catch((err) => {
            return callbackNG(err)
        })
}