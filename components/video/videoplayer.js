import { Input, Select, Row, Col, Icon, Button, Form } from 'antd'
const ButtonGroup = Button.Group
const { Option } = Select;
class VideoPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            videoURL: this.props.videoURL,
            seekRate: "0.50"
        }
        this.id = 'video' + this.props.seq
    }

    componentDidMount() {

        console.log('Now playing ', this.state.videoURL)

        let video = document.querySelector('#' + this.id)

        video.addEventListener('timeupdate', () => {
            this.props.form.setFieldsValue({ time: video.currentTime })
        })

    }

    forward = () => {
        const increment = Number(this.state.seekRate)
        let video = document.querySelector('#'+ this.id)
        video.pause()

        let val = (video.currentTime + increment).toFixed(2)
        this.props.form.setFieldsValue({ time: val })
        video.currentTime = val
    }

    backward = () => {
        const decrement = Number(this.state.seekRate)
        let video = document.querySelector('#'+ this.id)
        video.pause()


        let val = (video.currentTime - decrement).toFixed(2)
        val = val < 0 ? 0 : val

        this.props.form.setFieldsValue({ time: val })
        video.currentTime = val
    }

    seekRateChange = (value) => {
        this.setState({ seekRate: value })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <React.Fragment>
                <Row>
                    <video id={this.id} controls="controls" width="100%" preload="auto">
                        <source src={this.state.videoURL} />
                    </video>
                </Row>
                <Row>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", margin: "15px 0px 15px 0px" }}>

                        <Form layout="inline">
                            <Form.Item label="Seek Rate">
                                {getFieldDecorator('seekRate', {
                                    initialValue: this.state.seekRate
                                })(
                                    <Select onChange={this.seekRateChange} style={{ width: '90px' }}>
                                        <Option value="0.05">0.05</Option>
                                        <Option value="0.10">0.10</Option>
                                        <Option value="0.25">0.25</Option>
                                        <Option value="0.50">0.50</Option>
                                        <Option value="1">1</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="Time">
                                {getFieldDecorator('time', {
                                    initialValue: 0
                                })(
                                    <Input
                                        placeholder="Time"
                                    />
                                )}
                            </Form.Item>
                        </Form>


                        <ButtonGroup>
                            <Button icon="backward" size="large" shape="round" onClick={this.backward} />
                            <Button icon="forward" size="large" shape="round" onClick={this.forward} />
                            {/* <Button id="speed-3" icon="backward" size="large" shape="round">-3</Button>
                            <Button id="speed-2" icon="backward" size="large" shape="round">-2</Button>
                            <Button id="speed-1" icon="backward" size="large" shape="round">-1</Button>
                            <Button id="speed-point5" icon="backward" size="large" shape="round">-1/2</Button>
                            <Button id="speed0" icon="play-square" size="large" shape="round"></Button>
                            <Button id="speedpoint5" icon="forward" size="large" shape="round">+1/2</Button>
                            <Button id="speed1" icon="forward" size="large" shape="round">+1</Button>
                            <Button id="speed2" icon="forward" size="large" shape="round">+2</Button>
                            <Button id="speed3" icon="forward" size="large" shape="round">+3</Button> */}
                        </ButtonGroup>
                    </div>
                    <div id="log"></div>
                </Row>
            </React.Fragment >
        )
    }
}


const WrappedVideoPlayer = Form.create({ name: 'video_player_form' })(VideoPlayer)

export default WrappedVideoPlayer