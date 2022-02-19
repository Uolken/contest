import http from 'k6/http'
import {check} from 'k6'

export let options = {
    vus:1,
    duration: '30s'
}

export default function () {
    let res = http.post('http://localhost:8080/auth/sign-in')
    check(res, {
        'is 200 status': (r) => r.status === 200
    })
}
