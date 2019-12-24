import { Input, Select, Row, Col, Icon, Button, Form, InputNumber, Typography, message } from 'antd'
const ButtonGroup = Button.Group
const { Option } = Select;
const { Title } = Typography;

const openMessage = (type, desc) => {
    message[type](desc, 3);
};

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            videoURL: this.props.videoURL,
            seekRate: "0.50",
            isMobile: false
        }
        this.id = 'video' + this.props.seq
    }

    componentDidMount() {

        let video = document.querySelector('#' + this.id)
            , canvas = document.querySelector("#canvas" + this.id)
            , canvas_ctx = canvas.getContext('2d')
        // , overlay = document.querySelector('#overlay' + this.id)
        // , info = document.querySelector('#info' + this.id)
        // , initial = document.querySelector('#initial' + this.id)
        // , canvasDraw = document.querySelector("#draw" + this.id)
        // , canvasDraw_ctx = canvasDraw.getContext('2d')

        //**********************************MOUSE TRACK*********************************** */

        // //Variables
        // let canvasx = canvasDraw.offsetLeft;
        // let canvasy = canvasDraw.offsetTop;
        // let last_mousex = 0;
        // let last_mousey = 0;
        // let mousex = 0;
        // let mousey = 0;
        // let mousedown = false;

        // //Mousedown

        // canvasDraw.addEventListener('mousedown', (e) => {
        //     last_mousex = mousex
        //     last_mousey = mousey
        //     mousedown = true;
        // })

        // canvasDraw.addEventListener('mouseup', (e) => {
        //     mousedown = false;
        // })

        // function getElementCSSSize(el) {
        //     var cs = getComputedStyle(el);
        //     var w = parseInt(cs.getPropertyValue("width"), 10);
        //     var h = parseInt(cs.getPropertyValue("height"), 10);
        //     return { width: w, height: h }
        // }

        // canvasDraw.addEventListener('mousemove', (e) => {

        //     var size = getElementCSSSize(video);
        //     var scaleX = video.videoWidth / size.width;
        //     var scaleY = video.videoHeight / size.height;

        //     var rect = canvasDraw.getBoundingClientRect();  // absolute position of element
        //     mousex = ((event.clientX - rect.left) * scaleX + 0.5) | 0;
        //     mousey = ((event.clientY - rect.top) * scaleY + 0.5) | 0;

        //     // mousex = parseInt(e.clientX - canvasx);
        //     // mousey = parseInt(e.clientY - canvasy);
        //     if (mousedown) {
        //         canvasDraw_ctx.clearRect(0, 0, canvasDraw.width, canvasDraw.height); //clear canvas
        //         //Save
        //         canvasDraw_ctx.save();
        //         canvasDraw_ctx.beginPath();
        //         //Dynamic scaling
        //         var scalex = 1 * ((mousex - last_mousex) / 10);
        //         var scaley = 1 * ((mousey - last_mousey) / 10);
        //         canvasDraw_ctx.scale(scalex, scaley);
        //         //Create ellipse
        //         var centerx = (last_mousex / scalex) + 1;
        //         var centery = (last_mousey / scaley) + 1;
        //         canvasDraw_ctx.arc(centerx, centery, 1, 0, 2 * Math.PI);
        //         //Restore and draw
        //         canvasDraw_ctx.restore();
        //         canvasDraw_ctx.strokeStyle = 'red';
        //         canvasDraw_ctx.lineWidth = 5;
        //         canvasDraw_ctx.stroke();
        //     }

        //     let output = document.querySelector('#output')

        //     output.innerHTML = ('current: ' + mousex + ', ' + mousey + '<br/>last: ' + last_mousex + ', ' + last_mousey + '<br/>mousedown: ' + mousedown);
        // })


        // function getElementCSSSize(el) {
        //     var cs = getComputedStyle(el);
        //     var w = parseInt(cs.getPropertyValue("width"), 10);
        //     var h = parseInt(cs.getPropertyValue("height"), 10);
        //     return { width: w, height: h }
        // }

        // function mouseHandler(event) {
        //     var size = getElementCSSSize(this);
        //     var scaleX = this.videoWidth / size.width;
        //     var scaleY = this.videoHeight / size.height;

        //     var rect = this.getBoundingClientRect();  // absolute position of element
        //     var x = ((event.clientX - rect.left) * scaleX + 0.5) | 0;
        //     var y = ((event.clientY - rect.top) * scaleY + 0.5) | 0;

        //     info.innerHTML = "x: " + x + " y: " + y;
        //     initial.innerHTML = "(video: " + this.videoWidth + " x " + this.videoHeight + ")";
        // }


        // video.addEventListener("mousemove", mouseHandler);

        //**********************************DOWNLOAD*********************************** */

        video.addEventListener('timeupdate', () => {
            this.props.form.setFieldsValue({ time: video.currentTime.toFixed(2) })
        })

        video.addEventListener('loadedmetadata', function () {
            // Set canvas dimensions same as video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // canvasDraw.width = video.offsetWidth;
            // canvasDraw.height = video.offsetHeight;
        });

        let title = this.props.title

        let downloadLink = document.querySelector("#download" + this.id)

        downloadLink.addEventListener('click', function () {

            canvas_ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            // canvas_ctx.drawImage(canvasDraw, 0, 0, video.videoWidth, video.videoHeight);

            let textWidth = canvas_ctx.measureText(title).width

            canvas_ctx.font = 'normal ' + (textWidth > 200 ? '17px' : '20px') + ' Arial';

            canvas_ctx.fillStyle = 'yellow'
            canvas_ctx.fillText(title, 20, 32);

            // canvas_ctx.fillStyle = "#c82124"; //red
            // canvas_ctx.beginPath();
            // canvas_ctx.arc(1000, 200, 70, 0, 2 * Math.PI);
            // canvas_ctx.strokeStyle = "#c82124";
            // canvas_ctx.stroke();

            navigator.permissions.query({
                name: 'clipboard-write'
            }).then(permissionStatus => {
                // Will be 'granted', 'denied' or 'prompt':
                console.log(permissionStatus.state);

                // Listen for changes to the permission state
                permissionStatus.onchange = () => {
                    console.log(permissionStatus.state);
                };
            });

            //********* vvvvvv IN CASE OF DONWLOADING TO PNG FILE vvvvvv ********/
            // downloadLink.setAttribute('href', canvas.toDataURL("image/png"));
            // downloadLink.setAttribute('download', title);

            //********* vvvvvv IN CASE OF COPYING TO CLIPBOARD vvvvvv ********/
            canvas.toBlob(function (blob) {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]);
            });

            openMessage('success', 'Captured image has been copied to clipboard.')

        })

        //Set mobile state

        if (this.isMobileDevice()) {
            this.setState({ ...this.state, isMobile: true })
        }

    }


    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    forward = () => {
        const increment = Number(this.state.seekRate)
        let video = document.querySelector('#' + this.id)
        video.pause()

        let val = (video.currentTime + increment).toFixed(2)
        this.props.form.setFieldsValue({ time: val })
        video.currentTime = val
    }

    backward = () => {
        const decrement = Number(this.state.seekRate)
        let video = document.querySelector('#' + this.id)
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
                    <Title level={4}>{this.props.title}</Title>
                </Row>
                <Row>
                    <video id={this.id} controls="controls" width="100%" playsInline autoPlay={this.props.isAutoPlay} style={{ zIndex: 1, borderRadius: '6px' }}>
                        <source src={this.state.videoURL} />
                    </video>

                    {/* <canvas id={'draw' + this.id} style={{ border: '2px solid blue', position: 'absolute', left: '0', top: '0', zIndex: 99 }}></canvas>

                    <div id={'info' + this.id} style={{ position: 'absolute', float: 'left', top: '0', zIndex: 10, backgroundColor: 'yellow' }}></div>
                    <i id={'initial' + this.id}></i> */}

                    <canvas style={{ display: 'none' }} id={'canvas' + this.id}></canvas>
                </Row>
                <Row style={{ textAlign: 'center' }}>
                    {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingLeft: "15px", paddingRight: "15px", margin: "15px 0px 15px 0px" }}> */}
                    <Form layout="inline">
                        <Col span={12}>
                            <Form.Item label="Time">
                                {getFieldDecorator('time', {
                                    initialValue: 0
                                })(
                                    <Input
                                        readOnly
                                        style={{ width: '90px' }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Seek Rate">
                                {getFieldDecorator('seekRate', {
                                    initialValue: this.state.seekRate
                                })(
                                    <InputNumber min={0} max={1} step={0.05} onChange={this.seekRateChange} />
                                )}
                            </Form.Item>
                        </Col>
                    </Form>
                </Row><br />
                <Row style={{ textAlign: 'center' }}>
                    <Col span={12} hidden={this.state.isMobile}>
                        <a id={"download" + this.id} href="#" style={{ fontSize: '17px' }}><Button type="dashed"><Icon type="camera" /> Capture to clipboard</Button></a>
                    </Col>

                    {/* <div id="output"></div> */}
                    <Col span={12}>
                        <ButtonGroup>
                            <Button icon="backward" size="large" shape="round" onClick={this.backward} />
                            <Button icon="forward" size="large" shape="round" onClick={this.forward} />
                        </ButtonGroup>
                    </Col>
                </Row>
                {/* </div> */}

            </React.Fragment >
        )
    }
}


const WrappedVideoPlayer = Form.create({ name: 'video_player_form' })(VideoPlayer)

export default WrappedVideoPlayer