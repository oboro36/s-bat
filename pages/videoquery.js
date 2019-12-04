import { Row, Col, } from 'antd'
import { Form, Select } from 'antd'
const { Option } = Select;
import VideoSearch from '../components/video/videosearch'

const columns = [
    {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
    },
    {
        title: 'User Name',
        dataIndex: 'UserName',
        key: 'UserName',
    },
    {
        title: 'Content',
        dataIndex: 'Content',
        key: 'Content',
    },
];

class VideoQuery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            outputType: 'img',
            // loading: false,
            // tableDataSource: [
            //     {
            //         ID: '01',
            //         UserName: 'Cat',
            //         Content: '-'
            //     },
            //     {
            //         ID: '02',
            //         UserName: 'Dog',
            //         Content: '-'
            //     },
            //     {
            //         ID: '03',
            //         UserName: 'Snake',
            //         Content: '-'
            //     }
            // ],
            propFunc: () => {
                console.log('func')
            }
        }
    }

    // getPerson = () => {
    //     self = this

    //     this.setState({ loading: true })

    //     setTimeout(() => {
    //         invokeApi('post', '/alluser',
    //             (res) => {
    //                 let result = res.data
    //                 self.setState({ tableDataSource: result })
    //                 self.setState({ loading: false })
    //             },
    //             (err) => {
    //                 alert(err)
    //                 self.setState({ loading: false })
    //             }
    //         )
    //     }, 2000);
    // }

    handleOutputChange = value => {
        this.setState({ outputType: value }, () => {
            console.log(this.state.outputType)
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {/* <Card><Button type="primary" onClick={this.getPerson}>Get Data</Button></Card> */}
                {/* <Card>
                    <Table
                        columns={columns}
                        dataSource={this.state.tableDataSource}
                        loading={this.state.loading}
                        rowKey="ID"
                    />
                </Card> */}
                <Row type="flex" justify="center" align="middle">
                    <Col span={24}>
                        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
                            <Form.Item label="Output">
                                {getFieldDecorator('output', {
                                    rules: [{ required: true, message: 'Please select your output!' }],
                                    initialValue: this.state.outputType
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
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <VideoSearch customTitle="CHOICE1" side="left" selectedOutput={this.state.outputType} />
                    </Col>
                    <Col span={12}>
                        <VideoSearch customTitle="CHOICE2" side="right" selectedOutput={this.state.outputType} />
                    </Col>
                </Row>
            </div>
        )
    }
}

const WrappedVideoQuery = Form.create({ name: 'video_search' })(VideoQuery)

export default WrappedVideoQuery