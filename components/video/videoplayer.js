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
    }

    componentDidMount() {

        console.log('Now playing ', this.state.videoURL)

        let video = document.querySelector('#video')

        video.addEventListener('timeupdate', () => {
            this.props.form.setFieldsValue({ time: video.currentTime })
        })

        // let log = document.querySelector('#log')
        // let intervalRewind

        // video.addEventListener('play', (e) => {
        //     console.log('play!!')
        //     video.playbackRate = 1.0
        //     clearInterval(intervalRewind)
        // })
        // video.addEventListener('ended', function () {
        //     // this only happens when t=duration (not t==0)
        //     video.playbackRate = 1.0
        //     video.currentTime = 0.0
        //     clearInterval(intervalRewind)
        // })
        // video.addEventListener('pause', function () {
        //     video.playbackRate = 1.0
        //     clearInterval(intervalRewind)
        // })

        // let speed0 = document.querySelector('#speed0')
        // let speedpoint5 = document.querySelector('#speedpoint5')
        // let speed1 = document.querySelector('#speed1')
        // let speed2 = document.querySelector('#speed2')
        // let speed3 = document.querySelector('#speed3')
        // let speed_point5 = document.querySelector('#speed-point5')
        // let speed_1 = document.querySelector('#speed-1')
        // let speed_2 = document.querySelector('#speed-2')
        // let speed_3 = document.querySelector('#speed-3')

        // let rewind = (rewindSpeed) => {
        //     clearInterval(intervalRewind);
        //     var startSystemTime = new Date().getTime();
        //     var startVideoTime = video.currentTime;

        //     intervalRewind = setInterval(function () {
        //         video.playbackRate = 1.0;
        //         if (video.currentTime == 0) {
        //             clearInterval(intervalRewind);
        //             video.pause();
        //         } else {
        //             var elapsed = new Date().getTime() - startSystemTime;
        //             log.textContent = 'Rewind Elapsed: ' + elapsed.toFixed(3);
        //             video.currentTime = Math.max(startVideoTime - elapsed * rewindSpeed / 1000.0, 0);
        //         }
        //     }, 30);
        // }

        // speed0.addEventListener('click', function () {
        //     clearInterval(intervalRewind)
        //     video.playbackRate = 1.0
        //     video.pause()
        // })
        // speedpoint5.addEventListener('click', function () {
        //     clearInterval(intervalRewind)
        //     if (video.paused) video.play()
        //     setTimeout(function () {
        //         // Not sure why, but setting the playback to
        //         // less than 1.0 only works when out of band
        //         // or the video is already playing.
        //         video.playbackRate = 0.5
        //         console.log('delayed')
        //     }, 0)
        // })
        // speed1.addEventListener('click', function () {
        //     clearInterval(intervalRewind)
        //     video.playbackRate = 1.0
        //     if (video.paused) video.play()
        // })
        // speed2.addEventListener('click', function () {
        //     clearInterval(intervalRewind)
        //     video.playbackRate = 2.0
        //     if (video.paused) video.play()
        // })
        // speed3.addEventListener('click', function () {
        //     clearInterval(intervalRewind)
        //     video.playbackRate = 3.0
        //     if (video.paused) video.play()
        // })
        // speed_point5.addEventListener('click', function () {
        //     rewind(0.5)
        // })
        // speed_1.addEventListener('click', function () {
        //     rewind(1.0)
        // })
        // speed_2.addEventListener('click', function () {
        //     rewind(2.0)
        // })
        // speed_3.addEventListener('click', function () {
        //     rewind(3.0)
        // })

    }

    forward = () => {
        const increment = Number(this.state.seekRate)
        let video = document.querySelector('#video')
        video.pause()

        let val = (video.currentTime + increment).toFixed(2)
        this.props.form.setFieldsValue({ time: val })
        video.currentTime = val
    }

    backward = () => {
        const decrement = Number(this.state.seekRate)
        let video = document.querySelector('#video')
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
                    <video id="video" controls="controls" width="100%" preload="auto">
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