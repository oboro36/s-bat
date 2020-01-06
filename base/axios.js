
import axios from 'axios'

const http = axios.create({
    mode: 'cors',
    baseURL: 'https://192.168.128.162:7000'
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