import Request from 'superagent';
import { CONSTANT } from '../constants/index'
import clickSound from '../assets/click-sound.base64.json';

class DataService {
    static verifyToken(token, client, next) {
        Request
            .get(`${CONSTANT.BASE_URL}${client}${CONSTANT.VERIFY_TOKEN_URL}`)
            .set({ 'Sdk-Token': `${token}` })
            .end(function (err, res) {
                if (err || !res.ok) {
                    next({ status: res.status, data: res.body });
                } else {
                    if (res.status && res.status === CONSTANT.STATUS_SUCCESS) {
                        next({ status: res.status, data: res.body });
                    } else {
                        next({ status: res.status, data: res.body });
                    }
                }
            });
    }

    static playClickAudio() {
        let audio = new Audio('data:audio/mp3;base64,' + clickSound.base64);
        audio.play();
    }
}

export default DataService;