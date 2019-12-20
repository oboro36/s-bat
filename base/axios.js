
import axios from 'axios'

const http = axios.create({
    mode: 'cors',
    baseURL: 'http://192.168.128.35:7000'
    // withCredentials: true
})

// const apiAddress = "http://192.168.128.35:7000"

export function invokeApi(method, url, data, callbackOK, callbackNG) {
    http[method](url, data)
        .then((resp) => {
            return callbackOK(resp)
        })
        .catch((err) => {
            return callbackNG(err)
        })
}