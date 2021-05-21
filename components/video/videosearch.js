import { Button, Row, Col, Collapse, Form, Select, message, BackTop, Spin } from 'antd'
import moment from 'moment'

import VideoResult from '../../components/video/videoresult'
import VideoSearchForm from '../../components/video/videosearch_form'

// import '../../base/spinner.css'

const { Panel } = Collapse;
const { Option } = Select;

//custom lib
import { invokeApi } from '../../utils/axios'

let uniqueId = 0
const notfoundImage = 'static/nodata-compressed.svg'
const openMessage = (type, desc) =>
{
    message[type](desc, 4);
};

class VideoSearch extends React.Component
{

    constructor(props)
    {
        super(props)

        this.state = {
            orientation: 'pc',
            isLoading: false,
            listDataSource: [],
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
        }

    }

    shouldComponentUpdate(nextProps, nextState)
    {

        if (this.state.isLoading != nextState.isLoading)
        {
            return true
        }

        if (this.state.searchCond.selectedOutput != nextState.searchCond.selectedOutput)
        {
            return true
        }

        if (this.state.searchCond.choice1 != nextState.searchCond.choice1)
        {
            return true
        }

        if (this.state.searchCond.choice2 != nextState.searchCond.choice2)
        {
            return true
        }

        if (this.state.validated.choice1 != nextState.validated.choice1)
        {
            return true
        }

        if (this.state.validated.choice2 != nextState.validated.choice2)
        {
            return true
        }

        if (this.state.listDataSource != nextState.listDataSource)
        {
            return true
        }

        // console.log(this.state)

        return false
    }

    componentDidMount()
    {
    }

    isMobileDevice = () =>
    {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    handleOutputChange = value =>
    {
        this.setState({ searchCond: { ...this.state.searchCond, selectedOutput: value } }, () =>
        {
            // console.log(this.state.searchCond.selectedOutput)
        })
    }

    handleLeftFormChange = (formValue, label) =>
    {

        // console.log(formValue)

        //change date format
        formValue.analysisdate = moment(formValue.analysisdate).format('YYYYMMDD')
        // console.log(formValue.datepicker)
        // console.log(this.state.selectedLabel)
        this.setState({
            searchCond: { ...this.state.searchCond, choice1: formValue },
            selectedLabel: { ...this.state.selectedLabel, choice1: label }
        })

    }

    validateLeftForm = (result) =>
    {
        this.setState({ validated: { ...this.state.validated, choice1: result } })
    }

    handleRightFormChange = (formValue, label) =>
    {
        // console.log(formValue)

        formValue.analysisdate = moment(formValue.analysisdate).format('YYYYMMDD')
        // console.log(formValue.datepicker)
        // console.log(this.state.selectedLabel)
        this.setState({
            searchCond: { ...this.state.searchCond, choice2: formValue },
            selectedLabel: { ...this.state.selectedLabel, choice2: label }
        })
    }

    validateRightForm = (result) =>
    {
        this.setState({ validated: { ...this.state.validated, choice2: result } })
    }

    handleSubmit = async () =>
    {

        //replace # with %23
        const doReplace = str => str.replace('#', '%23')

        window.scrollTo(0, document.body.scrollHeight);

        let clearRes = await this.clearList()
        if (clearRes)
        {

            let choice1 = this.state.searchCond.choice1
            let choice2 = this.state.validated.choice2 == true ? this.state.searchCond.choice2 : { site: null, program: null, line: null, content: null, analysisdate: null }

            this.setState({ ...this.state, isLoading: true })

            invokeApi('post', '/api/getVideoData',
                {
                    choice1: choice1,
                    choice2: choice2
                },
                async (res) =>
                {
                    // console.log(res)

                    let chambers = await this.getChamberList()

                    if (chambers)
                    {
                        const chamberCount = chambers.length

                        let results = res.data


                        let label = this.state.selectedLabel
                        let choice1_title = label.choice1.site + ',' + label.choice1.program + ',' + label.choice1.line + ',' + label.choice1.content + ',' + label.choice1.analysisdate
                        let choice2_title = label.choice2.site + ',' + label.choice2.program + ',' + label.choice2.line + ',' + label.choice2.content + ',' + label.choice2.analysisdate

                        let dataSource = []

                        for (let i = 1; i <= chamberCount; i++)
                        {
                            let chamber = 'P' + i
                            // console.log('chamber--> ', chamber)

                            let prep = []

                            //choice1
                            for (let j = 1; j <= 2; j++)
                            {
                                let position = 'Pos' + j
                                // console.log('position----> ', position)
                                let find = results.choice1.main.find((member) =>
                                {
                                    return member.CHAMBER_CODE == chamber && member.POSITION == position
                                })

                                if (find)
                                {
                                    // console.log('found CHOICE1 ', chamber, ' ', position)

                                    let areaCount = results.choice1.area_count.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })

                                    let areaInfo = results.choice1.area_info.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })

                                    let bigAreaInfo = results.choice1.big_area_info.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })

                                    let staticImgInfo = results.choice1.static_img_info.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })


                                    let choice1 = {
                                        title: choice1_title,
                                        choice: '1',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: doReplace(find.IMAGE_DIRECTORY),
                                        videoURL: doReplace(find.MOVIE_DIRECTORY),
                                        areaCount: areaCount.length > 0 ? areaCount : false,
                                        areaInfo: areaInfo.length > 0 ? areaInfo : false,
                                        bigAreaInfo: bigAreaInfo.length > 0 ? bigAreaInfo : false,
                                        // areaCountURL: find.AREA_COUNT_DIRECTORY ? doReplace(find.AREA_COUNT_DIRECTORY) : false,
                                        // areaInfoURL: find.AREA_INFOR_DIRECTORY ? doReplace(find.AREA_INFOR_DIRECTORY) : false,
                                        // bigAreaInfoURL: find.BIG_AREA_INFOR_DIRECTORY ? doReplace(find.BIG_AREA_INFOR_DIRECTORY) : false,
                                        histogramURL: find.GRAPH_DIRECTORY ? doReplace(find.GRAPH_DIRECTORY) : false,
                                        staticImageURL: find.IMAGE_STATIC_DIRECTORY ? doReplace(find.IMAGE_STATIC_DIRECTORY) : false,
                                        staticImageData: staticImgInfo.length > 0 ? staticImgInfo : false,
                                        outputType: 'img',
                                        valid: true,
                                    }

                                    prep.push(choice1)

                                } else
                                {
                                    // console.log('not found CHOICE1 ', chamber, ' ', position)

                                    let dummy = {
                                        title: choice1_title,
                                        choice: '1',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: notfoundImage,
                                        videoURL: '-',
                                        // areaCountURL: false,
                                        // areaInfoURL: false,
                                        // bigAreaInfoURL: false,
                                        histogramURL: false,
                                        staticImageURL: false,
                                        staticImageData: false,
                                        outputType: 'img',
                                        valid: false,
                                    }

                                    prep.push(dummy)
                                }
                            }

                            //choice2

                            for (let j = 1; j <= 2; j++)
                            {
                                let position = 'Pos' + j
                                // console.log('position----> ', position)
                                let find = results.choice2.main.find((member) =>
                                {
                                    return member.CHAMBER_CODE == chamber && member.POSITION == position
                                })

                                if (find)
                                {
                                    // console.log('found CHOICE2 ', chamber, ' ', position)

                                    let areaCount = results.choice2.area_count.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })

                                    let areaInfo = results.choice2.area_info.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })

                                    let bigAreaInfo = results.choice2.big_area_info.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })

                                    let staticImgInfo = results.choice2.static_img_info.filter((member) =>
                                    {
                                        return member.CHAMBER_CODE == chamber && member.POSITION == position
                                    })


                                    let choice2 = {
                                        title: choice2_title,
                                        choice: '2',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: doReplace(find.IMAGE_DIRECTORY),
                                        videoURL: doReplace(find.MOVIE_DIRECTORY),
                                        areaCount: areaCount.length > 0 ? areaCount : false,
                                        areaInfo: areaInfo.length > 0 ? areaInfo : false,
                                        bigAreaInfo: bigAreaInfo.length > 0 ? bigAreaInfo : false,
                                        // areaCountURL: find.AREA_COUNT_DIRECTORY ? doReplace(find.AREA_COUNT_DIRECTORY) : false,
                                        // areaInfoURL: find.AREA_INFOR_DIRECTORY ? doReplace(find.AREA_INFOR_DIRECTORY) : false,
                                        // bigAreaInfoURL: find.BIG_AREA_INFOR_DIRECTORY ? doReplace(find.BIG_AREA_INFOR_DIRECTORY): false,
                                        histogramURL: find.GRAPH_DIRECTORY ? doReplace(find.GRAPH_DIRECTORY) : false,
                                        staticImageURL: find.IMAGE_STATIC_DIRECTORY ? doReplace(find.IMAGE_STATIC_DIRECTORY) : false,
                                        staticImageData: staticImgInfo.length > 0 ? staticImgInfo : false,
                                        outputType: 'img',
                                        valid: true,
                                    }

                                    prep.push(choice2)

                                } else
                                {
                                    // console.log('not found CHOICE2 ', chamber, ' ', position)

                                    let dummy = {
                                        title: choice2_title,
                                        choice: '2',
                                        chamber: chamber,
                                        position: position,
                                        imageURL: notfoundImage,
                                        videoURL: '-',
                                        // areaCountURL: false,
                                        // areaInfoURL: false,
                                        // bigAreaInfoURL: false,
                                        histogramURL: false,
                                        staticImageURL: false,
                                        staticImageData: false,
                                        outputType: 'img',
                                        valid: false,
                                    }

                                    prep.push(dummy)
                                }
                            }

                            //process prep
                            // console.log(prep)
                            dataSource.push(prep)

                        }

                        //clear store of checkbox 
                        this.props.store.resetCheck()
                        this.addList(dataSource)

                    }


                },
                (err) =>
                {
                    this.setState({ ...this.state, isLoading: false })
                    console.log(err)
                }
            )


        }

    }

    getChamberList = () =>
    {
        return new Promise((resolve, reject) =>
        {
            invokeApi('post', '/api/getChamberList',
                {
                    site: this.state.searchCond.choice1.site
                },
                (res) =>
                {
                    // console.log(res)

                    return resolve(res.data.chambers)

                },
                (err) =>
                {
                    console.log(err)
                    // openMessage('error', err)
                    return resolve(0)
                }
            )
        })
    }


    addList = (data) =>
    {

        this.setState({ ...this.state, listDataSource: data, isLoading: false }, () =>
        {
            // document.getElementById('anchorResult').scrollIntoView({ behavior: 'smooth' })
        })
    }

    clearList()
    {
        // console.log('CLEAR LIST')
        return new Promise((resolve, reject) =>
        {
            this.setState({ ...this.state, listDataSource: [] })
            return resolve(true)
        })
    }

    clear = () =>
    {
        this.setState({ ...this.state, listDataSource: [] })
    }

    render()
    {
        const { getFieldDecorator } = this.props.form;

        return (
            <React.Fragment>
                {/* <Spin spinning={this.state.pageLoading} size="large"> */}
                <BackTop />
                {/* <div className={this.state.loaded ? '' : 'loading'}></div> */}
                <Row>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header={this.props.customTitle} key="1">
                            <Row>
                                <Col>
                                    <Form labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
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
                                                    <Option value="staticimg">Static Image</Option>
                                                    <Option value="areaCount">Area Count</Option>
                                                    <Option value="areaInfo">Area Info</Option>
                                                    <Option value="bigAreaInfo">Big Area Info</Option>
                                                    <Option value="histogram">Histogram</Option>
                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <VideoSearchForm validateForm={this.validateLeftForm} title="CHOICE1" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleLeftFormChange} />
                                </Col>
                                <Col span={12}>
                                    <VideoSearchForm validateForm={this.validateRightForm} title="CHOICE2" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleRightFormChange} />
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" icon="search" disabled={this.state.validated.choice1 ? false : true} onClick={this.handleSubmit}>Search</Button>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Row>
                &nbsp;
                <Row style={{ backgroundColor: "white", border: 'solid 1px #D9D9D9', borderRadius: "5px", padding: "15px" }}>
                    <div id='anchorResult' />
                    <VideoResult
                        listDataSource={this.state.listDataSource}
                        isLoading={this.state.isLoading}
                        selectedOutput={this.state.searchCond.selectedOutput}
                        orientation={this.state.orientation}
                        store={this.props.store}
                    />
                </Row>
                {/* </Spin> */}
            </React.Fragment>
        );
    }
}

const WrappedVideoSearch = Form.create({ name: 'video_search' })(VideoSearch)

export default WrappedVideoSearch