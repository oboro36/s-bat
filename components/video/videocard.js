import { Card, Row, Col, Form, Select, Icon, Modal } from 'antd'
import VideoPlayer from './videoplayer'
import WindowPortal from './windowportal'
const { Option } = Select;

class VideoCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playerVisible: false,
            modalContent: 'Default Content',
            initOutput: this.props.item.outputType,
            selectedOutput: '',
            showWindowPortal: false,
            portalContent: 'Default Content',
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    handleOutputChange = e => {
        console.log(e)
    }

    handleActions = async (action, URL) => {
        switch (action) {
            case "zoom":

                break
            case "play":

                this.showModal(URL)

                break
            case "full-play":

                this.showNewWindow(URL)

                break
            default:
                break
        }
    }

    //***************************Modal Player***************************

    showModal = (URL) => {
        console.log('Create Video Modal with ', URL)
        this.setState({
            modalContent: (
                <VideoPlayer videoURL={URL} />
            )
        }, () => {
            console.log('Show Video Modal with ', URL)
            this.setState({ ...this.state, playerVisible: true })
        });
    };

    handlePlayerCancel = () => {
        this.setState({
            playerVisible: false,
            modalContent: 'Default Content',
        });
    };

    //***************************New Window Player***************************

    showNewWindow = (URL) => {
        this.toggleWindowPortal(URL)
    }

    toggleWindowPortal = (URL) => {

        // this.props.appStore.setContent(<VideoPlayer videoURL={URL} />)

        // this.props.appStore.setHideMenu(false)

        this.setState({
            ...this.state, portalContent: 'content year'
        }, () => {
            this.setState(state => ({
                ...state,
                showWindowPortal: !state.showWindowPortal,
            }));
        })

    }

    render() {
        const { getFieldDecorator } = this.props.form;

        console.log(this.props.item)

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
                                <Icon type="play-square" key="play-square" onClick={() => { this.handleActions('play', this.props.item.videoURL[0]) }} />,
                                <Icon type="fullscreen" key="fullscreen" onClick={() => { this.handleActions('full-play', this.props.item.videoURL[0]) }} />,
                                // <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', this.props.item.imageURL[0]) }} />,
                            ]}
                        >{this.props.item.content(this.props.item.imageURL[0])}</Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title={this.props.item.title[1]}
                            actions={[
                                <Icon type="play-square" key="play-square" onClick={() => { this.handleActions('play', this.props.item.videoURL[1]) }} />,
                                <Icon type="fullscreen" key="fullscreen" onClick={() => { this.handleActions('full-play', this.props.item.videoURL[1]) }} />,
                                // <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', this.props.item.imageURL[1]) }} />,
                            ]}
                        >{this.props.item.content(this.props.item.imageURL[1])}</Card>
                    </Col>
                </Row>
                <Modal
                    title="Video Player"
                    visible={this.state.playerVisible}
                    onCancel={this.handlePlayerCancel}
                    style={{ top: '10px' }}
                    width="60%"
                >
                    <div>{this.state.modalContent}</div>
                </Modal>
                {this.state.showWindowPortal && (
                    <WindowPortal>
                    </WindowPortal>
                )}
            </div>
        )
    }
}

const WrappedVideoCard = Form.create({ name: 'video_search' })(VideoCard)

export default WrappedVideoCard