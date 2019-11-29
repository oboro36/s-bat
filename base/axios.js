
import axios from 'axios'

const http = axios.create({
    mode: 'cors',
    withCredentials: true
})

const apiAddress = "http://localhost:1323"

export function invokeApi(method, url, callbackOK, callbackNG) {
    http[method](apiAddress + url)
        .then((resp) => {
            return callbackOK(resp)
        })
        .catch((err) => {
            return callbackNG(err)
        })
}