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
class VideoCard extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            isMobile: false,
            playerVisible: false,
            modalContent: 'Default Content',
            checkStatus: {},
            selectedOutput: this.props.selectedOutput,
        }
    }

    componentWillMount()
    {

        let checkboxState = []

        // Manage checkbox state before mounting
        for (let i = 0; i < this.props.item.length; i++)
        {
            let thisID = this.props.item[i].choice + this.props.item[i].chamber + this.props.item[i].position
            let thisTitle = this.props.item[i].title + ',' + this.props.item[i].chamber + ',' + this.props.item[i].position

            const videoList = this.props.store.getVideoList()

            let checkVideoList = videoList.find(member => member.title == thisTitle)

            checkboxState[thisID] = checkVideoList ? true : false

        }

        this.setState({ checkStatus: checkboxState })
    }

    componentDidMount()
    {

        if (this.isMobileDevice)
        {
            this.setState({ ...this.state, isMobile: true })
        }

    }

    isMobileDevice = () =>
    {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    handleActions = async (action, URL, title, id) =>
    {
        switch (action)
        {
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

    showModal = (imageURL, videoURL, title, id) =>
    {
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
        }, () =>
        {
            // console.log('Show Video Modal with ', URL)
            this.setState({ ...this.state, playerVisible: true })
        });
    };

    handlePlayerCancel = () =>
    {
        this.setState({
            playerVisible: false,
            // modalContent: 'Default Content',
        });
    };

    //***************************New Window Player***************************

    showNewWindow = (URL) =>
    {
        window.open("http://localhost:3000/extportalplayer?url1=static%2Ftestvideo.mp4&url2=static%2Ftestvideo.mp4", 'New Window', "height=800,width=800");
    }


    //***************************Checkbox***************************

    // チェックボックスをチェックする時
    onCheck = async (e, ID, URL, title, imageURL) =>
    {

        if (e.target.checked)
        {
            if (this.props.store.checkCount < (this.props.store.checkMax))
            {
                this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: true } })
                this.props.store.increaseCheck(URL, title, imageURL)
            } else
            {
                this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: !e.target.checked } })
            }
        } else
        {
            this.setState({ checkStatus: { ...this.state.checkStatus, [ID]: false } })
            this.props.store.decreaseCheck(URL, title, imageURL)
        }

        this.props.checkedCount.innerHTML = this.props.store.checkCount

    }

    setActiveOutput = value =>
    {
        this.setState({ ...this.state, selectedOutput: value })
    }

    render()
    {
        const { getFieldDecorator } = this.props.form;

        // console.log('ITEM FOR CARD -------> ', this.props.item)

        const choice1Items = []
        const choice2Items = []

        const wrapperStyle = { height: '300px', overflowY: 'auto' }

        const headerStyle = { position: 'sticky', top: '0px', color: 'white', backgroundColor: '#1890FF', textAlign: 'center', border: '1px solid #ddd' }

        const columnStyle = { border: '1px solid #ddd' }
        const centerColumnStyle = { border: '1px solid #ddd', textAlign: 'center' }

        const CsvSkeleton = props => (
            <div style={{ textAlign: 'center' }}><Skeleton paragraph={{ rows: 8 }} active /></div>
        )

        // console.log(this.props.item)

        for (let i = 0; i < this.props.item.length; i++)
        {


            let thisID = this.props.item[i].choice + this.props.item[i].chamber + this.props.item[i].position
            let thisTitle = this.props.item[i].title + ',' + this.props.item[i].chamber + ',' + this.props.item[i].position

            {/* Area Count Component */ }
            let AreaCount = () =>
            {
                if (this.props.item[i].areaCount)
                {
                    let data = this.props.item[i].areaCount[0]
                    {/* Area Countテーブルの準備 */ }
                    return (
                        <div style={wrapperStyle}>
                            <Descriptions bordered column={1} size='small' style={{ backgroundColor: 'white' }} >
                                <Descriptions.Item key={1} label="NUM_OF_LARGE" >{data['NUM_OF_LARGE']}</Descriptions.Item>
                                <Descriptions.Item key={2} label="NUM_OF_MINI" >{data['NUM_OF_MINI']}</Descriptions.Item>
                                <Descriptions.Item key={3} label="MEDIAN_OF_AREA" >{data['MEDIAN_OF_AREA']}</Descriptions.Item>
                                <Descriptions.Item key={4} label="MAX_OF_AREA" >{data['MAX_OF_AREA']}</Descriptions.Item>
                                <Descriptions.Item key={5} label="MIN_OF_AREA" >{data['MIN_OF_AREA']}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    )
                } else
                {
                    return notfoundImageComponent
                }
            }

            {/* Area Info Component */ }
            let AreaInfo = () =>
            {

                if (this.props.item[i].areaInfo)
                {

                    let data = this.props.item[i].areaInfo

                    const header = [
                        'X',
                        'Y',
                        'LENGTH',
                        'WIDTH',
                        'AREA',
                    ]

                    {/* Area Infoテーブルの準備 */ }
                    const table = (
                        <div style={wrapperStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                                <thead>
                                    <tr>
                                        {header.map((member, index) =>
                                        {
                                            return (
                                                <th style={headerStyle} key={index} > {member}</th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody >
                                    {data.map((member, index) =>
                                    {
                                        return (
                                            <tr key={'tr_' + index}>
                                                <td style={columnStyle} key={'td_1_' + index}>{member['COORDINATE_X']}</td>
                                                <td style={columnStyle} key={'td_2_' + index}>{member['COORDINATE_Y']}</td>
                                                <td style={columnStyle} key={'td_3_' + index}>{member['LENGTH']}</td>
                                                <td style={columnStyle} key={'td_4_' + index}>{member['WIDTH']}</td>
                                                <td style={columnStyle} key={'td_5_' + index}>{member['AREA']}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div >
                    )

                    return table

                } else
                {
                    return notfoundImageComponent
                }
            }

            {/* Big Area Info Component */ }
            let BigAreaInfo = () =>
            {

                if (this.props.item[i].bigAreaInfo)
                {

                    let data = this.props.item[i].bigAreaInfo

                    const header = [
                        'X',
                        'Y',
                        'LENGTH',
                        'WIDTH',
                        'AREA',
                    ]

                    {/* Big Areaテーブルの準備 */ }
                    const table = (
                        <div style={wrapperStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                                <thead>
                                    <tr>
                                        {header.map((member, index) =>
                                        {
                                            return (
                                                <th style={headerStyle} key={index} > {member}</th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody >
                                    {data.map((member, index) =>
                                    {
                                        return (
                                            <tr key={'tr_' + index}>
                                                <td style={columnStyle} key={'td_1_' + index}>{member['COORDINATE_X']}</td>
                                                <td style={columnStyle} key={'td_2_' + index}>{member['COORDINATE_Y']}</td>
                                                <td style={columnStyle} key={'td_3_' + index}>{member['LENGTH']}</td>
                                                <td style={columnStyle} key={'td_4_' + index}>{member['WIDTH']}</td>
                                                <td style={columnStyle} key={'td_5_' + index}>{member['AREA']}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div >
                    )

                    return table

                } else
                {
                    return notfoundImageComponent
                }
            }

            let cardStyle
            let videoSymbolStyle
            let videoSymbol = ''
            let fontStyle = { fontFamily: "'Trebuchet MS', sans-serif", fontSize: '16px' }
            if (this.props.item[i].areaCount)
            {
                let numLarge = Number(this.props.item[i].areaCount[0].NUM_OF_LARGE)
                const priorityValue = this.props.priorityValue
                if (numLarge >= priorityValue.high[0] && numLarge <= priorityValue.high[1])
                {
                    cardStyle = {
                        backgroundColor: '#fff1f0',
                        borderColor: '#f85e65'
                    }
                    videoSymbolStyle = {
                        backgroundColor: '#FF2A2A',
                    }
                    videoSymbol = '☓';
                }
                else if (numLarge >= priorityValue.mid[0] && numLarge <= priorityValue.mid[1])
                {
                    cardStyle = {
                        backgroundColor: '#fffbe6',
                        borderColor: '#fab323'
                    }
                    videoSymbolStyle = {
                        backgroundColor: 'orange',
                    }
                    videoSymbol = '△';
                }
                else if (numLarge >= priorityValue.low[0] && numLarge <= priorityValue.low[1])
                {
                    cardStyle = {
                        backgroundColor: '#f6ffed',
                        borderColor: '#8ed967'
                    }
                    videoSymbolStyle = {
                        backgroundColor: '#52c41a',
                    }
                    videoSymbol = '〇';
                }
                videoSymbolStyle = { ...videoSymbolStyle, ...fontStyle }
            }

            let InfoTable = () =>
            {
                // テーブル行ないのマークを選択する
                let getSymbol = (data) =>
                {
                    if (!data)
                    {
                        return ''
                    }
                    return Number(data) > 1 ? '☓' : '〇'
                }

                // マークのCSS
                let getSymbolSyle = (data) =>
                {
                    if (!data)
                    {
                        return {}
                    }
                    return Number(data) > 1 ? { backgroundColor: '#FF2A2A' } : { backgroundColor: '#52c41a' }
                }

                // マークの行を準備
                let getRow = (data, row, index) =>
                {
                    let symbolSyle = getSymbolSyle(data)
                    symbolSyle = { ...symbolSyle, ...fontStyle }
                    return (<td key={'td_' + row + '_' + index} style={{ ...centerColumnStyle, ...symbolSyle }}>{getSymbol(data)}</td>)
                }

                if (this.props.item[i].staticImageData)
                {
                    let data = this.props.item[i].staticImageData
                    const table = (
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                            {/* 静止画の情報テーブルヘッダー */}
                            <thead>
                                <tr>
                                    <td style={centerColumnStyle} rowSpan="2">Video</td>
                                    <td style={centerColumnStyle} colSpan="7">Static Image</td>
                                </tr>
                                <tr>
                                    <td style={centerColumnStyle}>Disk</td>
                                    <td style={centerColumnStyle}>Pocket<br />Object</td>
                                    <td style={centerColumnStyle}>Small<br />Ab</td>
                                    <td style={centerColumnStyle}>Target<br />Crack</td>
                                    <td style={centerColumnStyle}>Target<br />Peeling</td>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((member, index) =>
                                {
                                    return (
                                        <tr key={'tr_' + index}>
                                            <td key={'td_1_' + index} style={{ ...centerColumnStyle, ...videoSymbolStyle }}>{videoSymbol}</td>
                                            {getRow(member.RESULT_CLASS1, '2', index)}
                                            {getRow(member.RESULT_CLASS2, '3', index)}
                                            {getRow(member.RESULT_CLASS3, '4', index)}
                                            {getRow(member.RESULT_CLASS4, '5', index)}
                                            {getRow(member.RESULT_CLASS5, '6', index)}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                    return table
                } else
                {
                    {/* 静止画の情報がない場合 */ }
                    return (<p></p>)
                }
            }

            let item = (
                <Col key={thisID} span={12}>
                    <Card
                        style={cardStyle}
                        title={this.props.item[i].chamber + ' ' + this.props.item[i].position}
                        extra={
                            <div>
                                {/* ビデオカード内選択肢 */}
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
                                    <Option value="staticimg">Static Image</Option>
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
                            <Checkbox checked={this.state.checkStatus[thisID]} onChange={e => this.onCheck(e, thisID, this.props.item[i].videoURL, thisTitle, this.props.item[i].imageURL)} disabled={!this.props.item[i].valid}>{(this.props.orientation == 'landscape' || this.props.orientation == 'pc') ? 'Compare' : ''}</Checkbox>
                        ]}
                    >
                        {/* タブの内容、画面からタブの形が非表示されている */}
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
                                        <AreaCount />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Area Info" key='areaInfo'>
                                <Row>
                                    <Col span={24}>
                                        <AreaInfo />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Big Area Info" key='bigAreaInfo'>
                                <Row>
                                    <Col span={24}>
                                        <BigAreaInfo />
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
                            <TabPane tab="Static Image" key='staticimg'>
                                <Row>
                                    <Col span={24}>
                                        {this.props.item[i].staticImageURL ?
                                            <div style={{ height: '300px', display: 'table-cell', verticalAlign: 'middle' }}>
                                                <img loading="auto" src={this.props.item[i].staticImageURL} width="100%" height="auto" />
                                            </div>
                                            : notfoundImageComponent
                                        }
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                        <InfoTable />
                    </Card>
                </Col>
            )

            if (this.props.item[i].choice == '1')
            {
                choice1Items.push(item)
            } else if (this.props.item[i].choice == '2')
            {
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
                    gutter={4}
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
                    style={{ top: '60px' }}
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