
import axios from 'axios'

const http = axios.create({
    mode: 'cors',
    withCredentials: true
})

const apiAddress = "http://localhost:8000"

export function invokeApi(method, url, data, callbackOK, callbackNG) {
    console.log(data)
    http[method](apiAddress + url, data)
        .then((resp) => {
            return callbackOK(resp)
        })
        .catch((err) => {
            return callbackNG(err)
        })
}