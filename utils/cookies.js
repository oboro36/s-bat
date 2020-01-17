
import { parseCookies } from 'nookies'

//get,set cookie on client side
class Nookies {
    getCookie(target = null) {
        const cookies = parseCookies()
        if (target) {
            return cookies[target] ? cookies[target] : undefined
        } else {
            return cookies
        }
    }

    setCookie(target, value, age = (60 * 60 * 24 * 31), path = '/') {  //default cookie for 1 month
        document.cookie = `${target}=${value}; path=${path}; max-age=${age}`;
    }
}

export default new Nookies