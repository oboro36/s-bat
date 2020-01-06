import { List, Button, Row, Col, Collapse, Form, Select, Divider, message, BackTop, Spin } from 'antd'
import moment from 'moment'
import VideoCard from '../../components/video/videocard'

import VideoSearchForm from '../../components/video/videosearch_form'

// import '../../base/spinner.css'

const { Panel } = Collapse;
const { Option } = Select;

//custom lib
import { invokeApi } from '../../base/axios'

let uniqueId = 0
const notfoundImage = 'static/nodata.svg'
const openMessage = (type, desc) => {
    message[type](desc, 4);
};

class VideoSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            orientation: 'pc',
            isLoading: false,
            listDataSource: [],
            listColumnSize: 1,
            searchCond: {
                selectedOutput: 'img',
                choice1: [],
                choice2: [],
            },
            selectedLabel: {
                choice1: {},
                choice2: {}
            },
            validated: {
                choice1: false,
                choice2: false
            },
            pageLoading: true
            // disabled: {
            //     submit: true
            // }
        }
    }

    componentDidMount() {
        if (this.isMobileDevice()) {

            //first time 

            let mode = this.checkOrientation()
            this.setState({ ...this.state, orientation: mode })

            window.addEventListener('orientationchange', () => {
                let mode = this.checkOrientation()
                this.setState({ ...this.state, orientation: mode })
            })

        } else {
            // alert('pc')
        }
        this.setState({ ...this.state, pageLoading: false })
    }

    checkOrientation() {
        let thisMode

        switch (window.orientation) {
            case 90:
                thisMode = 'landscape'
                break;
            case -90:
                thisMode = 'landscape'
                break;
            case 0:
                thisMode = 'portrait'
                break;
            case 180:
                thisMode = 'portrait'
                break;
            default:
                break;
        }

        return thisMode
    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }


    handleOutputChange = value => {
        this.setState({ searchCond: { selectedOutput: value } }, () => {
            // console.log(this.state.searchCond.selectedOutput)
        })
    }

    handleLeftFormChange = (formValue, label) => {

        // console.log(formValue)

        //change date format
        formValue.analysisdate = moment(formValue.analysisdate).format('YYYYMMDD')
        // console.log(formValue.datepicker)

        this.setState({
            searchCond: { ...this.state.searchCond, choice1: formValue },
            selectedLabel: { ...this.state.selectedLabel, choice1: label }
        })

    }

    validateLeftForm = (result) => {
        this.setState({ validated: { ...this.state.validated, choice1: result } })
    }

    handleRightFormChange = (formValue, label) => {
        // console.log(formValue)

        formValue.analysisdate = moment(formValue.analysisdate).format('YYYYMMDD')
        // console.log(formValue.datepicker)
        this.setState({
            searchCond: { ...this.state.searchCond, choice2: formValue },
            selectedLabel: { ...this.state.selectedLabel, choice2: label }
        })
    }

    validateRightForm = (result) => {
        this.setState({ validated: { ...this.state.validated, choice2: result } })
    }

    handleSubmit = async () => {

        let clearRes = await this.clearList()
        if (clearRes) {

            let choice1 = this.state.searchCond.choice1
            let choice2 = this.state.searchCond.choice2

            this.setState({ ...this.state, isLoading: true })

            invokeApi('post', '/api/getVideoData',
                {
                    choice1: choice1,
                    choice2: choice2
                },
                async (res) => {
                    // console.log(res)

                    let chambers = await this.getChamberList()

                    if (chambers) {
                        const chamberCount = chambers.length

                        let results = res.data

                        let label = this.state.selectedLabel
                        let choice1_title = label.choice1.site + ',' + label.choice1.program + ',' + label.choice1.line + ',' + label.choice1.content + ',' + label.choice1.analysisdate
                        let choice2_title = label.choice2.site + ',' + label.choice2.program + ',' + label.choice2.line + ',' + label.choice2.content + ',' + label.choice2.analysisdate

                        let dataSource = []

                        for (let i = 1; i <= chamberCount; i++) {
                            let chamber = 'P' + i
                            // console.log('chamber--> ', chamber)

                            let prep = []

                            //choice1

                            for (let j = 1; j <= 2; j++) {
                                let position = 'Pos' + j
                                // console.log('position----> ', position)
                                let find = results.choice1.find((member) => {
                                    return member.CHAMBER_CODE == chamber && member.POSITION == position
                                })

                                if (find) {
                                    // console.log('found CHOICE1 ', chamber, ' ', position)

                                    let choice1 = {
                                        title: choice1_title,
                                        choice: '1',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: find.IMAGE_DIRECTORY,
                                        videoURL: find.MOVIE_DIRECTORY,
                                        outputType: 'img',
                                        valid: true,
                                        content: (url) => {
                                            return (
                                                <Row>
                                                    <Col span={24}>
                                                        <img src={find.IMAGE_DIRECTORY} width="100%" height="auto" />
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    }

                                    prep.push(choice1)

                                } else {
                                    // console.log('not found CHOICE1 ', chamber, ' ', position)

                                    let dummy = {
                                        title: choice1_title,
                                        choice: '1',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: notfoundImage,
                                        videoURL: '-',
                                        outputType: 'img',
                                        valid: false,
                                        content: (url) => {
                                            return (
                                                <Row>
                                                    <Col span={24}>
                                                        <img src={notfoundImage} width="100%" height="auto" />
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    }

                                    prep.push(dummy)
                                }
                            }

                            //choice2

                            for (let j = 1; j <= 2; j++) {
                                let position = 'Pos' + j
                                // console.log('position----> ', position)
                                let find = results.choice2.find((member) => {
                                    return member.CHAMBER_CODE == chamber && member.POSITION == position
                                })

                                if (find) {
                                    // console.log('found CHOICE2 ', chamber, ' ', position)

                                    let choice2 = {
                                        title: choice2_title,
                                        choice: '2',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: find.IMAGE_DIRECTORY,
                                        videoURL: find.MOVIE_DIRECTORY,
                                        outputType: 'img',
                                        valid: true,
                                        content: (url) => {
                                            return (
                                                <Row>
                                                    <Col span={24}>
                                                        <img src={find.IMAGE_DIRECTORY} width="100%" height="auto" />
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    }

                                    prep.push(choice2)

                                } else {
                                    // console.log('not found CHOICE2 ', chamber, ' ', position)

                                    let dummy = {
                                        title: choice2_title,
                                        choice: '2',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: notfoundImage,
                                        videoURL: '-',
                                        outputType: 'img',
                                        valid: false,
                                        content: (url) => {
                                            return (
                                                <Row>
                                                    <Col span={24}>
                                                        <img src={notfoundImage} width="100%" height="auto" />
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    }

                                    prep.push(dummy)
                                }
                            }

                            //process prep
                            // console.log(prep)
                            dataSource.push(prep)

                        }

                        this.addList(dataSource)

                    }


                },
                (err) => {
                    this.setState({ ...this.state, isLoading: false })
                    console.log(err)
                }
            )


        }

    }

    getChamberList = () => {
        return new Promise((resolve, reject) => {
            invokeApi('post', '/api/getChamberList',
                {
                    site: this.state.searchCond.choice1.site
                },
                (res) => {
                    // console.log(res)

                    return resolve(res.data.chambers)

                },
                (err) => {
                    console.log(err)
                    // openMessage('error', err)
                    return resolve(0)
                }
            )
        })
    }


    addList = (data) => {

        this.setState({ ...this.state, listDataSource: data, isLoading: false })

        // // console.log('ADD LIST')
        // return new Promise((resolve, reject) => {
        //     // this.setState(state => {
        //     //     var joined = this.state.listDataSource.concat([
        //     //         data
        //     //     ])
        //     //     this.setState({ ...this.state, listDataSource: joined })
        //     // })
        //     return resolve(true)
        // })
    }

    clearList() {
        // console.log('CLEAR LIST')
        return new Promise((resolve, reject) => {
            this.setState({ ...this.state, listDataSource: [] })
            return resolve(true)
        })
    }

    clear = () => {
        this.setState({ ...this.state, listDataSource: [] })
    }

    test = async () => {

        let searchCond = this.state.searchCond

        // let choice1_title = searchCond.choice1.site +','+ searchCond.choice1.program +','+ searchCond.choice1.line +','+ searchCond.choice1.content +','+ searchCond.choice1.analysisdate
        // let choice2_title = searchCond.choice2.site +','+ searchCond.choice2.program +','+ searchCond.choice2.line +','+ searchCond.choice2.content +','+ searchCond.choice2.analysisdate

        let choice1_title = 'choice1'
        let choice2_title = 'choice2'

        const model = [
            [
                {
                    title: choice1_title,
                    choice: '1',
                    chamber: 'P1',
                    position: 'POS1',
                    imageURL: notfoundImage,
                    videoURL: '-',
                    outputType: 'img',
                    valid: false,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: choice1_title,
                    choice: '1',
                    chamber: 'P1',
                    position: 'POS2',
                    imageURL: 'static/imgoutput-1-p1-pos2.jpg',
                    videoURL: 'static/bunny.mp4',
                    outputType: 'img',
                    valid: true,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: choice2_title,
                    choice: '2',
                    chamber: 'P1',
                    position: 'POS1',
                    imageURL: 'static/imgoutput-1-p1-pos1.jpg',
                    videoURL: 'static/testvideo.mp4',
                    outputType: 'img',
                    valid: true,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: choice2_title,
                    choice: '2',
                    chamber: 'P1',
                    position: 'POS2',
                    imageURL: 'static/imgoutput-1-p1-pos2.jpg',
                    videoURL: 'static/testvideo.mp4',
                    outputType: 'img',
                    valid: true,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                }
            ],
            [
                {
                    title: choice1_title,
                    choice: '1',
                    chamber: 'P2',
                    position: 'POS1',
                    imageURL: 'static/imgoutput-1-p1-pos1.jpg',
                    videoURL: 'static/testvideo.mp4',
                    outputType: 'img',
                    valid: true,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: choice1_title,
                    choice: '1',
                    chamber: 'P2',
                    position: 'POS2',
                    imageURL: 'static/imgoutput-1-p1-pos2.jpg',
                    videoURL: 'static/testvideo.mp4',
                    outputType: 'img',
                    valid: true,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: choice2_title,
                    choice: '2',
                    chamber: 'P2',
                    position: 'POS1',
                    imageURL: 'static/imgoutput-1-p1-pos1.jpg',
                    videoURL: 'static/testvideo.mp4',
                    outputType: 'img',
                    valid: true,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                },
                {
                    title: choice2_title,
                    choice: '2',
                    chamber: 'P2',
                    position: 'POS2',
                    imageURL: 'static/imgoutput-1-p1-pos2.jpg',
                    videoURL: 'static/testvideo.mp4',
                    outputType: 'img',
                    valid: true,
                    content: (url) => {
                        return (
                            <Row>
                                <Col span={24}>
                                    <img src={url} width="100%" height="auto" />
                                </Col>
                            </Row>
                        )
                    }
                }
            ],
        ]

        let clearRes = await this.clearList()
        if (clearRes) {

            this.setState({ ...this.state, isLoading: true })
            // for (let i = 0; i < model.length; i++) {
            //     this.addList(model[i])
            // }

            this.addList(model)
        }

    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <React.Fragment>
                <Spin spinning={this.state.pageLoading} size="large">
                    <BackTop />
                    {/* <div className={this.state.loaded ? '' : 'loading'}></div> */}
                    <Row>
                        <Collapse defaultActiveKey={['1']}>
                            <Panel header={this.props.customTitle} key="1">
                                <Row>
                                    <Col>
                                        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
                                            <Divider>Output Type</Divider>
                                            <Form.Item label="Output">
                                                {getFieldDecorator('output', {
                                                    rules: [{ required: true, message: 'Please select your output!' }],
                                                    initialValue: this.state.searchCond.selectedOutput
                                                })(
                                                    <Select
                                                        placeholder="Select your output type"
                                                        onChange={this.handleOutputChange}
                                                    >
                                                        <Option value="img">Image</Option>
                                                    </Select>,
                                                )}
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <VideoSearchForm validated={this.state.validated.choice1} validateForm={this.validateLeftForm} title="CHOICE1" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleLeftFormChange} />
                                    </Col>
                                    <Col span={12}>
                                        <VideoSearchForm validated={this.state.validated.choice2} validateForm={this.validateRightForm} title="CHOICE2" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleRightFormChange} />
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" align="middle">
                                    <Col>
                                        <Button type="primary" icon="search" disabled={this.state.validated.choice1 && this.state.validated.choice2 ? false : true} onClick={this.handleSubmit}>Search</Button>
                                    </Col>
                                    <Col>
                                        <Button type="danger" onClick={this.clear}>Clear</Button>
                                    </Col>
                                    <Col>
                                        <Button type="dashed" onClick={this.test}>Test</Button>
                                    </Col>
                                </Row>
                            </Panel>
                        </Collapse>
                    </Row>
                    &nbsp;
                <Row style={{ backgroundColor: "white", borderRadius: "5px", padding: "15px" }}>
                        <List
                            header={<div>Result</div>}
                            grid={{
                                gutter: 16,
                                column: this.state.listColumnSize
                            }}
                            dataSource={this.state.listDataSource}
                            loading={this.state.isLoading}
                            rowKey={(record) => {
                                if (!record.__uniqueId)
                                    record.__uniqueId = ++uniqueId;
                                // console.log(record.__uniqueId)
                                return record.__uniqueId;
                            }}
                            renderItem={item => (
                                <List.Item style={{ marginTop: '15px', marginBottom: '5px' }}>
                                    <VideoCard key={uniqueId} item={item} orientation={this.state.orientation} store={this.props.store} />
                                </List.Item>
                            )}
                        >
                        </List>
                    </Row>
                </Spin>
            </React.Fragment>
        );
    }
}

const WrappedVideoSearch = Form.create({ name: 'video_search' })(VideoSearch)

export default WrappedVideoSearch