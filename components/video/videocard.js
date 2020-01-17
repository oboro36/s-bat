import { Card, Row, Col, Form, Select, Icon, Modal, Button, Checkbox, Tabs } from 'antd'
import VideoPlayer from './videoplayer'
import Link from 'next/link'
const { TabPane } = Tabs;
const { Option } = Select;

import { observer } from "mobx-react"

// const openNotificationWithIcon = (type, desc) => {
//     notification[type]({
//         message: 'Notification',
//         description: desc,
//         duration: 3
//     });
// };

@observer
class VideoCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playerVisible: false,
            modalContent: 'Default Content',
            initOutput: this.props.item.outputType,
            checkStatus: {},
            selectedOutput: 'img'
        }
    }

    componentWillMount() {
        let newState = []

        for (let i = 0; i < this.props.item.length; i++) {
            let thisID = this.props.item[i].choice + this.props.item[i].chamber + this.props.item[i].position
            newState[thisID] = false
        }

        this.setState({ checkStatus: newState })
    }

    componentDidMount() {
        // console.log(this.props.selectedOutput)

        // console.log(this.props)

        // let doOnOrientationChange = () => {
        //     switch (window.orientation) {
        //         case 90:
        //             this.setState({ ...this.state, orientation: 'lanscape' })
        //             break;
        //         case -90:
        //             this.setState({ ...this.state, orientation: 'lanscape' })
        //             break;
        //         case 0:
        //             this.setState({ ...this.state, orientation: 'portrait' })
        //             break;
        //         case 180:
        //             this.setState({ ...this.state, orientation: 'portrait' })
        //             break;
        //         default:
        //             break;
        //     }
        // }

        // window.addEventListener('orientationchange', doOnOrientationChange)
        // doOnOrientationChange()



    }

    // isMobileDevice = () => {
    //     return navigator.userAgent.toLowerCase().match(/mobile/i)
    // }

    handleActions = async (action, URL, title, id) => {
        switch (action) {
            case "zoom":

                break
            case "play":

                this.showModal(URL, title, id)

                break
            case "full-play":

                this.showNewWindow(URL)

                break
            default:
                break
        }
    }

    //***************************Modal Player***************************

    showModal = (URL, title, id) => {
        // console.log('Create Video Modal with ', URL)
        this.setState({
            modalContent: (
                <VideoPlayer
                    id="only"
                    seq="only"
                    videoURL={URL}
                    title={title}
                    isAutoPlay={true}
                    doClose={this.handlePlayerCancel}
                />
            )
        }, () => {
            // console.log('Show Video Modal with ', URL)
            this.setState({ ...this.state, playerVisible: true })
        });
    };

    // startPlay = () => {
    //     this.setState({ playing: true }, () => {
    //         console.log(this.state.playing)
    //     })
    // }

    // alreadyPaused = () => {
    //     this.setState({ playing: false }, () => {
    //         console.log(this.state.playing)
    //     })
    // }

    handlePlayerCancel = () => {
        this.setState({
            playerVisible: false,
            // modalContent: 'Default Content',
        });
    };

    //***************************New Window Player***************************

    showNewWindow = (URL) => {
        window.open("http://localhost:3000/extportalplayer?url1=static%2Ftestvideo.mp4&url2=static%2Ftestvideo.mp4", 'New Window', "height=800,width=800");
    }


    //***************************Checkbox***************************

    onCheck = async (e, ID, URL, title) => {

        if (e.target.checked) {
            if (this.props.store.checkCount < (this.props.store.checkMax)) {
                this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: true } })
                this.props.store.increaseCheck(URL, title)
            } else {
                this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: !e.target.checked } })
            }
        } else {
            this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: false } })
            this.props.store.decreaseCheck(URL, title)
        }

    }

    componentWillUnmount() {
        this.props.store.resetCheck()
    }

    setActiveOutput = value => {
        this.setState({ ...this.state, selectedOutput: value })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        // console.log('ITEM FOR CARD -------> ', this.props.item)

        const choice1Items = []
        const choice2Items = []

        for (let i = 0; i < this.props.item.length; i++) {

            let thisID = this.props.item[i].choice + this.props.item[i].chamber + this.props.item[i].position
            let thisTitle = this.props.item[i].title + ',' + this.props.item[i].chamber + ',' + this.props.item[i].position

            let item = (
                <Col key={thisID} span={12}>
                    <Card
                        title={this.props.item[i].chamber + ' ' + this.props.item[i].position}
                        extra={
                            <div>
                                <Select
                                    size="small"
                                    placeholder="Select your output type"
                                    defaultValue={this.props.selectedOutput}
                                    style={this.props.item[i].choice == '1' && this.props.item[i].position == 'Pos1' ? { visibility: 'visible' } : { visibility: 'hidden' }}
                                    onChange={this.setActiveOutput}
                                >
                                    <Option value="img">Image</Option>
                                    <Option value="area">Area</Option>
                                </Select>
                            </div>
                        }
                        actions={[
                            <Button size="small" disabled={!this.props.item[i].valid} type="default" icon="caret-right" onClick={() => { this.handleActions('play', this.props.item[i].videoURL, thisTitle, thisID) }}>{(this.props.orientation == 'landscape' || this.props.orientation == 'pc') ? 'Play' : ''}</Button>,
                            // <div><Icon type="play-square" key="play-square" /> Play</div>,
                            <Checkbox checked={this.state.checkStatus[thisID]} onChange={e => this.onCheck(e, thisID, this.props.item[i].videoURL, thisTitle)} disabled={!this.props.item[i].valid}>{(this.props.orientation == 'landscape' || this.props.orientation == 'pc') ? 'Compare' : ''}</Checkbox>
                            // <Icon type="fullscreen" key="fullscreen" onClick={() => { this.handleActions('full-play', this.props.item[i].videoURL) }} />,
                            // <Link href={{ pathname: '/extportalplayer', query: { url1: 'static/testvideo.mp4', title1: 'title1', url2: 'static/testvideo.mp4', title2: 'title2' } }} >
                            //     <a target="_blank" onClick="window.open('/extportalplayer','name','width=600,height=400')">
                            //         <Icon type="fullscreen" />
                            //     </a>
                            // </Link>
                            // ,
                            // <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', this.props.item.imageURL[0]) }} />,
                        ]}
                    >
                        <Tabs defaultActiveKey={this.props.selectedOutput} activeKey={this.state.selectedOutput} tabPosition='top' size='small'>
                            <TabPane tab="Image" key='img'>
                                {this.props.item[i].content(this.props.item[i].imageURL)}
                            </TabPane>
                            <TabPane tab="Area" key='area'>
                                {this.props.item[i].content(this.props.item[i].imageURL)}
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            )

            if (this.props.item[i].choice == '1') {
                choice1Items.push(item)
            } else if (this.props.item[i].choice == '2') {
                choice2Items.push(item)
            }

        }

        let colStyle = {
            flexBasis: "49%",
            width: "100%"
        }

        return (
            <div key={this.props.key}>
                <Row className="customTabHidden" type="flex">
                    <Col span={1} style={colStyle}>
                        {choice1Items}
                    </Col>
                    <Col style={{ width: '2%' }}></Col>
                    <Col span={1} style={colStyle}>
                        {choice2Items}
                    </Col>
                </Row>
                <Modal
                    // title="Video Player"
                    maskClosable={false}
                    keyboard={false}
                    visible={this.state.playerVisible}
                    style={{ top: '10px' }}
                    width="60%"
                    destroyOnClose={true}
                    onCancel={this.handlePlayerCancel}
                    footer={null}
                    closable={false}
                >
                    <div>{this.state.modalContent}</div>
                </Modal>
            </div>
        )
    }
}

const WrappedVideoCard = Form.create({ name: 'video_search' })(VideoCard)

export default WrappedVideoCard