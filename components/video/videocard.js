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
                            title={this.props.item.title[0]}
                            extra={
                                <div>
                                    <Select
                                        size="small"
                                        placeholder="Select your output type"
                                        defaultValue={this.props.item.outputType}

                                    >
                                        <Option value="img">Image</Option>
                                        <Option value="gph">Graph</Option>
                                    </Select>
                                </div>
                            }
                            actions={[
                                <Icon type="play-square" key="play-square" />,
                                <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', this.props.item.imageURL[0]) }} />,
                            ]}
                        >{this.props.item.content('left', this.props.item.imageURL[0])}</Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title={this.props.item.title[1]}
                            actions={[
                                <Icon type="play-square" key="play-square" />,
                                <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', this.props.item.imageURL[1]) }} />,
                            ]}
                        >{this.props.item.content('left', this.props.item.imageURL[0])}</Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const WrappedVideoCard = Form.create({ name: 'video_search' })(VideoCard)

export default WrappedVideoCard