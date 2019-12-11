
import { observable, action } from 'mobx'

class VideoStore {
    @observable hideMenu = false
    @observable videoContent = 'Default content'
    @observable url1 = 'static/testvideo.mp4'
    @observable url2 = 'static/bunny.mp4'

    @action
    setHideMenu = (input) => {
        this.hideMenu = input
    }

    @action
    setContent = (input) => {
        this.videoContent = input
    }
}

export default new VideoStore()