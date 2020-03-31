
import { observable, action, toJS } from 'mobx'
import { notification, Button, Icon } from 'antd'
import Link from 'next/link';

class VideoStore {

    @observable hideMenu = false

    @observable disabledCheck = false
    @observable checkMax = 2
    @observable checkCount = 0
    @observable videoList = []

    @action
    openConfirmNotification = (list) => {
        const key = `open${Date.now()}`;
        const btn = (

            <Link href={{
                pathname: '/extportalplayer', query: {
                    videoURL1: list[0].URL,
                    imageURL1: list[0].imageURL,
                    title1: list[0].title,
                    videoURL2: list[1].URL,
                    imageURL2: list[1].imageURL,
                    title2: list[1].title
                }
            }} >
                <a target="_blank">
                    <Button type="primary" >
                        Confirm
                    </Button>
                </a>
            </Link>

        );
        notification.info({
            top: '70px',
            message: 'Comfirm Notification',
            description: <span>Do you want to open new tab and play below titles? <br /> <b>Title 1:</b> {list[0].title} <br /> <b>Title 2:</b> {list[1].title}</span>,
            btn,
            key,
            duration: 0,
            onClose: () => {

            },
            style: {
                width: 500,
                marginLeft: 390 - 500,
            }
        });
    };

    @action
    setHideMenu = (input) => {
        this.hideMenu = input
    }

    @action
    getVideoList = () => {
        let list = toJS(this.videoList)
        return  list
    }

    @action
    increaseCheck = (URL, title, imageURL) => {
        // if (this.checkCount < (this.checkMax)) {
        ++this.checkCount
        this.videoList.push({ URL: URL, title: title, imageURL: imageURL })

        if (this.checkCount == 2) {
            let list = toJS(this.videoList)
            notification.destroy()
            this.openConfirmNotification(list)
        }

        // } else {
        // this.toggleDisabledCheck()
        // }

        // console.log('count----> ', this.checkCount)
        // console.log('max----> ', this.checkMax)

        // console.log(this.videoList)
    }

    @action
    decreaseCheck = (URL, title, imageURL) => {
        notification.destroy()
        // if (this.checkCount > 0) {
        --this.checkCount

        let sameCheck = this.videoList.filter((member) => {
            return member.title == title
        })

        if (sameCheck.length > 1) {
            //same video just do array POP
            this.videoList.pop()
        } else {
            this.videoList = this.videoList.filter((member) => {
                return member.title != title
            })
        }

        // console.log('count----> ', this.checkCount)
        // console.log('max----> ', this.checkMax)

        // } else {
        // this.toggleDisabledCheck()
        // }
        // console.log(this.videoList)
    }

    @action
    toggleDisabledCheck = () => {
        this.disabledCheck = !this.disabledCheck
    }

    @action
    resetCheck = () => {
        this.checkCount = 0
        this.disabledCheck = false
        this.videoList = []
    }

}

export default new VideoStore()