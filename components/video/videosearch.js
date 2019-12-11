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
                choice1: [],
                choice2: [],
            }
        }

    }


    handleOutputChange = value => {
        this.setState({ searchCond: { selectedOutput: value } }, () => {
            console.log(this.state.searchCond.selectedOutput)
        })
    }

    handleLeftFormChange = (formValue) => {
        this.setState({ searchCond: { ...this.state.searchCond, choice1: formValue } })
    }

    handleRightFormChange = (formValue) => {
        this.setState({ searchCond: { ...this.state.searchCond, choice2: formValue } })
    }

    handleSubmit = () => {

        console.log(this.state.searchCond)

        invokeApi('post', '/api/getVideoData',
            {
                choice1: this.state.searchCond.choice1,
                choice2: this.state.searchCond.choice2
            },
            async (res) => {
                console.log(res)

                let results = res.data

                let prep =
                {
                    title: [results.choice1[0]['POSITION'], results.choice2[0]['POSITION']],
                    imageURL: [results.choice1[0]['IMAGE_DIRECTORY'], results.choice2[0]['IMAGE_DIRECTORY']],
                    videoURL: [results.choice1[0]['MOVIE_DIRECTORY'], results.choice2[0]['MOVIE_DIRECTORY']],
                    outputType: 'img',
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


                let clearRes = await this.clearList()
                if (clearRes) {
                    console.log(prep)
                    this.addList(prep)
                }

            },
            (err) => {
                console.log(err)
            }
        )

    }


    addList = (data) => {
        console.log('ADD LIST')
        return new Promise((resolve, reject) => {
            this.setState(state => {
                var joined = this.state.listDataSource.concat([
                    data
                ])
                this.setState({ listDataSource: joined })
            })
            return resolve(true)
        })
    }

    clearList() {
        console.log('CLEAR LIST')
        return new Promise((resolve, reject) => {
            this.setState({ listDataSource: [] })
            return resolve(true)
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const tester1 = [
            'SHDI',
            1,
            '1300',
            1,
            new Date()
        ]

        const tester2 = [
            'SHDI',
            2,
            '1400',
            2,
            new Date()
        ]

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
                                    <VideoSearchForm title="CHOICE1" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleLeftFormChange} tester={tester1} />
                                </Col>
                                <Col span={12}>
                                    <VideoSearchForm title="CHOICE2" selectedOutput={this.state.searchCond.selectedOutput} sendFormValue={this.handleRightFormChange} tester={tester2} />
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
                    >
                    </List>
                </Row>
            </React.Fragment>
        );
    }
}

const WrappedVideoSearch = Form.create({ name: 'video_search' })(VideoSearch)

export default WrappedVideoSearch