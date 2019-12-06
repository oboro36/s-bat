import { List, Card, Button, Row, Col, Collapse, Form, Select, Checkbox, Icon, Divider, Input } from 'antd'
import VideoCard from '../../components/video/videocard'

import VideoSearchForm from '../../components/video/videosearch_form'

const { Panel } = Collapse;
const { Option } = Select;

//custom lib
import { invokeApi } from '../../base/axios'

class VideoSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            listDataSource: [],
            listColumnSize: 1,
            searchCond: {
                selectedOutput: 'img',
                condLeft: [],
                condRight: [],
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     searchCond: {
        //         ...this.state.searchCond, output: nextProps.selectedOutput
        //     }
        // })
    }

    handleOutputChange = value => {
        this.setState({ searchCond: { selectedOutput: value } }, () => {
            console.log(this.state.searchCond.selectedOutput)
        })
    }

    handleLeftFormChange = (formValue) => {
        console.log(formValue)
    }

    handleRightFormChange = (formValue) => {
        console.log(formValue)
    }

    handleSubmit = () => {

        invokeApi('get', '/api/getSiteDropdown',
            (res) => {
                console.log(res)
            },
            (err) => {
                console.log(err)
            }
        )

        // let temp = this.props.form.getFieldsValue()

        // let dummy = [
        //     {
        //         title: ["P1 POS1", "P1 POS2"],
        //         imageURL: ['static/imgoutput1.jpg', 'static/imgoutput2.jpg'],
        //         videoURL: ['static/testvideo.mp4', 'static/testvideo.mp4'],
        //         outputType: this.props.selectedOutput,
        //         content: ((pos, url) => {
        //             return (
        //                 <Row>
        //                     <Col span={24}>
        //                         <img src={url} width="100%" height="auto" />
        //                     </Col>
        //                 </Row>
        //             )
        //         })()
        //     }
        // ]

        // let clearRes = await this.clearList()
        // if (clearRes) {
        //     let addRes = await this.addList(dummy)
        // }

    }


    // addList = (data) => {
    //     console.log('ADD LIST')
    //     return new Promise((resolve, reject) => {
    //         this.setState(state => {
    //             var joined = this.state.listDataSource.concat([
    //                 data
    //             ])
    //             this.setState({ listDataSource: joined })
    //         })
    //         return resolve(true)
    //     })
    // }

    // clearList() {
    //     console.log('CLEAR LIST')
    //     return new Promise((resolve, reject) => {
    //         this.setState({ listDataSource: [] })
    //         return resolve(true)
    //     })
    // }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <React.Fragment>
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
                                                    <Option value="gph">Graph</Option>
                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <VideoSearchForm title="CHOICE1" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleLeftFormChange} />
                                </Col>
                                <Col span={12}>
                                    <VideoSearchForm title="CHOICE2" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleLeftFormChange} />
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" icon="search" onClick={this.handleSubmit}>Search</Button>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Row>
                &nbsp;
                <Row style={{ backgroundColor: "white", borderRadius: "5px" }}>
                    <List
                        grid={{
                            gutter: 16,
                            column: this.state.listColumnSize
                        }}
                        dataSource={this.state.listDataSource}
                        loading={this.state.isLoading}
                        renderItem={item => (
                            <List.Item>
                                <VideoCard item={item} />
                            </List.Item>
                        )}
                    />
                </Row>
            </React.Fragment>
        );
    }
}

const WrappedVideoSearch = Form.create({ name: 'video_search' })(VideoSearch)

export default WrappedVideoSearch