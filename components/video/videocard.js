import { Card, Row, Col, Form, Select, Icon } from 'antd'
const { Option } = Select;

class VideoCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initOutput: this.props.item[0].outputType,
            selectedOutput: '',
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    handleOutputChange = e => {
        console.log(e)
    }

    handleActions = (action, URL) => {
        if (action == 'zoom') {
            console.log(URL)
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Card
                            title={this.props.item[0].title}
                            extra={
                                this.props.side == 'left' ? (
                                    <div>
                                        <Select
                                            size="small"
                                            placeholder="Select your output type"
                                            defaultValue={this.props.item[0].outputType}
                                            hidden={this.props.side == 'left' ? false : true}
                                        >
                                            <Option value="img">Image</Option>
                                            <Option value="gph">Graph</Option>
                                        </Select>
                                    </div>
                                ) : (<span />)
                            }
                            actions={[
                                <Icon type="play-square" key="play-square" />,
                                <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', this.props.item[0].imageURL) }} />,
                            ]}
                        >{this.props.item[0].content}</Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title={this.props.item[1].title}
                            actions={[
                                <Icon type="play-square" key="play-square" />,
                                <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', this.props.item[1].imageURL) }} />,
                            ]}
                        >{this.props.item[1].content}</Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const WrappedVideoCard = Form.create({ name: 'video_search' })(VideoCard)

export default WrappedVideoCard