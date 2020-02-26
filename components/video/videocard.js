import { Card, Row, Col, Form, Select, Icon, Modal, Button, Checkbox, Tabs, Spin, Skeleton, Descriptions } from 'antd'
import VideoPlayer from './videoplayer'
import Link from 'next/link'
import { observer } from "mobx-react"
import axios from 'axios'
import Papa from "papaparse"

const { TabPane } = Tabs;
const { Option } = Select;

const notfoundImage = 'static/nodata-compressed.svg'
const notfoundImageComponent = (
    <div style={{ height: '300px', display: 'table-cell', verticalAlign: 'middle' }}>
        <img loading="auto" src={notfoundImage} width="100%" height="auto" />
    </div>
)


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
            isMobile: false,
            playerVisible: false,
            modalContent: 'Default Content',
            checkStatus: {},
            selectedOutput: this.props.selectedOutput,
            csvContent: {}
        }
    }

    componentWillMount() {

        let checkboxState = []

        const setContent = (id, type, content) => {
            this.setState({
                csvContent: {
                    ...this.state.csvContent,
                    [id]: {
                        ...this.state.csvContent[id],
                        [type]: content
                    }
                }
            })
        }

        const wrapperStyle = { height: '300px', overflowY: 'auto' }

        const headerStyle = { position: 'sticky', top: '0px', color: 'white', backgroundColor: '#1890FF', textAlign: 'center', border: '1px solid #ddd' }

        const columnStyle = { border: '1px solid #ddd' }

        for (let i = 0; i < this.props.item.length; i++) {
            let thisID = this.props.item[i].choice + this.props.item[i].chamber + this.props.item[i].position
            let thisTitle = this.props.item[i].title + ',' + this.props.item[i].chamber + ',' + this.props.item[i].position

            const videoList = this.props.store.getVideoList()

            let checkVideoList = videoList.find(member => member.title == thisTitle)

            checkboxState[thisID] = checkVideoList ? true : false
            if (this.props.item[i].areaCountURL) {
                this.getCsvData(this.props.item[i].areaCountURL).then((res) => {

                    if (res != false) {
                        let csvData = Papa.parse(res)

                        const tableData = csvData.data.filter((member, index) => (index > 0 && member[0])).map((member) => {
                            return [member[0], member[1]]
                        })

                        const table = (
                            <div style={wrapperStyle}>
                                {/* <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            {tableData.map((member, index) => {
                                                return (
                                                    <th style={headerStyle} key={index}>{member[0]}</th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {tableData.map((member, index) => {
                                                return (
                                                    <td style={columnStyle} key={index}>{member[1]}</td>
                                                );
                                            })}
                                        </tr>
                                    </tbody>
    
                                </table> */}
                                <Descriptions bordered column={1} size='small'>
                                    {tableData.map((member, index) => {
                                        return (
                                            <Descriptions.Item key={index} label={member[0]} >{member[1]}</Descriptions.Item>
                                        );
                                    })}
                                </Descriptions>
                            </div>
                        )
                        setContent(thisID, 'areaCount', table)
                    } else {
                        setContent(thisID, 'areaCount', notfoundImageComponent)
                    }
                })
            }
            if (this.props.item[i].areaInfoURL) {
                this.getCsvData(this.props.item[i].areaInfoURL).then((res) => {
                    if (res != false) {
                        let csvData = Papa.parse(res)

                        // console.log(csvData)

                        const header = csvData.data[0].filter(member => member)

                        // console.log('header', header)

                        const tableData = csvData.data.filter((member, index) => (index > 0 && member[0])).map((member) => {
                            const prep = member.filter((value, id) => id > 0)
                            return prep
                        })

                        // console.log('content', tableData)

                        const table = (
                            <div style={wrapperStyle}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            {header.map((member, index) => {
                                                return (
                                                    <th style={headerStyle} key={index} > {member}</th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {tableData.map((member, index) => {
                                            return (
                                                <tr key={index}>
                                                    {member.map((value, id) => {
                                                        return (
                                                            <td style={columnStyle} key={id}>{value}</td>
                                                        )
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </div >
                        )

                        setContent(thisID, 'areaInfo', table)
                    } else {
                        setContent(thisID, 'areaCount', notfoundImageComponent)
                    }
                })
            }

            if (this.props.item[i].bigAreaInfoURL) {
                this.getCsvData(this.props.item[i].bigAreaInfoURL).then((res) => {
                    if (res != false) {
                        let csvData = Papa.parse(res)

                        // console.log(csvData)

                        const header = csvData.data[0].filter(member => member)

                        // console.log('header', header)

                        const tableData = csvData.data.filter((member, index) => (index > 0 && member[0])).map((member) => {
                            const prep = member.filter((value, id) => id > 0)
                            return prep
                        })

                        // console.log('content', tableData)

                        const table = (
                            <div style={wrapperStyle}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            {header.map((member, index) => {
                                                return (
                                                    <th style={headerStyle} key={index} > {member}</th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {tableData.map((member, index) => {
                                            return (
                                                <tr key={index}>
                                                    {member.map((value, id) => {
                                                        return (
                                                            <td style={columnStyle} key={id}>{value}</td>
                                                        )
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </div >
                        )

                        setContent(thisID, 'bigAreaInfo', table)
                    } else {
                        setContent(thisID, 'areaCount', notfoundImageComponent)
                    }
                })
            }

        }

        this.setState({ checkStatus: checkboxState })
    }

    getCsvData = (url) => {
        return axios.get(url)
            .then((resp) => {
                return resp.data
            })
            .catch((err) => {
                return false
            })
    }

    componentDidMount() {

        if (this.isMobileDevice) {
            this.setState({ ...this.state, isMobile: true })
        }

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


        // }

    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    handleActions = async (action, URL, title, id) => {
        switch (action) {
            case "zoom":

                break
            case "play":

                this.showModal(URL.imageURL, URL.videoURL, title, id)

                break
            case "full-play":

                this.showNewWindow(URL)

                break
            default:
                break
        }
    }

    //***************************Modal Player***************************

    showModal = (imageURL, videoURL, title, id) => {
        // console.log('Create Video Modal with ', URL)
        this.setState({
            modalContent: (
                <VideoPlayer
                    id="only"
                    seq="only"
                    imageURL={imageURL}
                    videoURL={videoURL}
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

    onCheck = async (e, ID, URL, title, imageURL) => {

        if (e.target.checked) {
            if (this.props.store.checkCount < (this.props.store.checkMax)) {
                this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: true } })
                this.props.store.increaseCheck(URL, title, imageURL)
            } else {
                this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: !e.target.checked } })
            }
        } else {
            this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: false } })
            this.props.store.decreaseCheck(URL, title, imageURL)
        }

        this.props.checkedCount.innerHTML = this.props.store.checkCount

    }

    // componentWillUnmount() {
    //     this.props.store.resetCheck()
    // }

    setActiveOutput = value => {
        this.setState({ ...this.state, selectedOutput: value })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        // console.log('ITEM FOR CARD -------> ', this.props.item)

        const choice1Items = []
        const choice2Items = []

        const CsvSkeleton = props => (
            <div style={{ textAlign: 'center' }}><Skeleton paragraph={{ rows: 8 }} active /></div>
        )

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
                                    id={thisID}
                                    size="small"
                                    placeholder="Select your output type"
                                    defaultValue={this.props.selectedOutput}
                                    style={this.props.item[i].choice == '1' && this.props.item[i].position == 'Pos1' ? { visibility: 'visible' } : { visibility: 'hidden' }}
                                    onChange={this.setActiveOutput}
                                    dropdownMatchSelectWidth={false}
                                >
                                    <Option value="img">Image</Option>
                                    <Option value="areaCount">Area Count</Option>
                                    <Option value="areaInfo">Area Info</Option>
                                    <Option value="bigAreaInfo">Big Area Info</Option>
                                    <Option value="histogram">Histogram</Option>
                                </Select>
                            </div>
                        }
                        actions={[
                            <Button
                                size="small"
                                disabled={!this.props.item[i].valid}
                                type="default"
                                icon="caret-right"
                                onClick={() => { this.handleActions('play', { imageURL: this.props.item[i].imageURL, videoURL: this.props.item[i].videoURL }, thisTitle, thisID) }}>{(this.props.orientation == 'landscape' || this.props.orientation == 'pc') ? 'Play' : ''}
                            </Button>,
                            // <div><Icon type="play-square" key="play-square" /> Play</div>,
                            <Checkbox checked={this.state.checkStatus[thisID]} onChange={e => this.onCheck(e, thisID, this.props.item[i].videoURL, thisTitle, this.props.item[i].imageURL)} disabled={!this.props.item[i].valid}>{(this.props.orientation == 'landscape' || this.props.orientation == 'pc') ? 'Compare' : ''}</Checkbox>
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
                        <Tabs activeKey={this.state.selectedOutput} tabPosition='top' type="card">
                            <TabPane tab="Image" key='img'>
                                <Row>
                                    <Col span={24}>
                                        <div style={{ height: '300px', display: 'table-cell', verticalAlign: 'middle' }}>
                                            <img loading="auto" src={this.props.item[i].imageURL} width="100%" height="auto" />
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Area Count" key='areaCount'>
                                <Row>
                                    <Col span={24}>
                                        {this.props.item[i].areaCountURL ?

                                            this.state.csvContent[thisID] ? this.state.csvContent[thisID].areaCount : <CsvSkeleton />

                                            : notfoundImageComponent
                                        }
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Area Info" key='areaInfo'>
                                <Row>
                                    <Col span={24}>
                                        {this.props.item[i].areaInfoURL ?

                                            this.state.csvContent[thisID] ? this.state.csvContent[thisID].areaInfo : <CsvSkeleton />


                                            : notfoundImageComponent
                                        }
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Big Area Info" key='bigAreaInfo'>
                                <Row>
                                    <Col span={24}>
                                        {this.props.item[i].bigAreaInfoURL ?

                                            this.state.csvContent[thisID] ? this.state.csvContent[thisID].bigAreaInfo : <CsvSkeleton />


                                            : notfoundImageComponent
                                        }
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Histogram" key='histogram'>
                                <Row>
                                    <Col span={24}>
                                        {this.props.item[i].histogramURL ?
                                            <div style={{ height: '300px', display: 'table-cell', verticalAlign: 'middle' }}>
                                                <img loading="auto" src={this.props.item[i].histogramURL} width="100%" height="auto" />
                                            </div>
                                            : notfoundImageComponent
                                        }
                                    </Col>
                                </Row>
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
                <Row
                    className="customTabHidden"
                    type="flex"
                >
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
                    width="65vw"
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