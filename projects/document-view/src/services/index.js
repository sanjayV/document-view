// import Request from 'superagent';
import { CONSTANT } from '../constants/index'
// import clickSound from '../assets/click-sound.base64.json';

class DataService {
    /* static verifyToken(token, client, next) {
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
    } */

    /* static playClickAudio() {
        let audio = new Audio('data:audio/mp3;base64,' + clickSound.base64);
        audio.play();
    } */

    static getUrlType(url) {
        if (!url || !CONSTANT.TYPE_REX.exec(url)) {
            return false;
        }

        return CONSTANT.TYPE_REX.exec(url)[1].toLowerCase();
    }

    static verifyGoogleDoc(type) {
        const matches = CONSTANT.DOC_REX.exec(type);
        if (matches && matches.length) {
            return true;
        }
        return false;
    }

    static getViewType(url) {
        const type = this.getUrlType(url);
        if (CONSTANT.SUPPORTED_IMAGE_TYPE.indexOf(type) > -1) {
            /* _this.isFileExist(_this.currentData['url'], function(res) {
                if (res) {
                    _this.currentType = 'image';
                    _this.setImage();
                } else {
                    _this.setError("File not exist on given url.");
                }
            }); */
            return CONSTANT.IMAGE_TYPE;
        } else if (CONSTANT.SUPPORTED_DOC.indexOf(type) > -1 || this.verifyGoogleDoc(type)) {
            return CONSTANT.DOC_TYPE;
        } else if (CONSTANT.SUPPORTED_VIDEO.indexOf(type) > -1) {
            return CONSTANT.VIDEO_TYPE;
        } else {
            return CONSTANT.ERROR_TYPE;
        }
    }
}

export default DataService;