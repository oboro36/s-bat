import { Input, Row, Col, Icon, Button, Form, InputNumber, Typography, message, Divider, Switch, Spin, Tooltip, Avatar, Popover } from 'antd'
import { CirclePicker } from 'react-color';

import cookies from '../../utils/cookies'

const ButtonGroup = Button.Group
const { Title, Text } = Typography;

const openMessage = (type, desc) => {
    message[type](desc, 3);
};

const EraserSvg = (props) => {
    return (
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 64 64">
            <path
                d="M61.4 22.1l-17-17a3 3 0 0 0-4.2 0L4.9 40.4a3 3 0 0 0 0 4.2l8.3 8.4h21.5l26.7-26.7a3 3 0 0 0 0-4.2z"
                fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="6" strokeLinejoin="round"
                strokeLinecap="round"></path>
            <path fill="none" stroke="currentColor" strokeMiterlimit="10"
                strokeWidth="6" d="M2 61h60" strokeLinejoin="round" strokeLinecap="round"></path>
        </svg>
    )
};


const EraserIcon = props => <Icon component={EraserSvg} {...props} />;

class VideoPlayer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            videoURL: this.props.videoURL,
            seekRate: '0.50',
            isMobile: false,
            isImageHidden: false,
            showTitle: false,
            editMode: false,
            videoLoading: true,
            pickedColor: '#FE0002',
            colorVisible: false,
            eraserMode: false,
            disableButton: {
                forward: false,
                backward: false,
                fullscreen: false,
            },
            brushIcon: 'pen',
            test: 'palm'
        }
        this._isMounted = false;
        this.id = 'video' + this.props.seq
    }

    async componentDidMount() {
        //Set mobile state
        this._isMounted = true;

        if (this._isMounted) {
            let lastSeekRate = this.getSeekRateCookie()
            if (!lastSeekRate) {
                lastSeekRate = 0.50
            }
            // console.log('set value from cookie: ', lastSeekRate)
            let res = await this.setInitialSeekRate(lastSeekRate)
            if (res) {

                this.setCanvasManipulation()

                let vidcontainer = document.getElementById('vidcontainer' + this.id)

                vidcontainer.onfullscreenchange = function (elem, event) {
                    if (document.fullscreenElement || document.webkitFullscreenElement ||
                        document.mozFullScreenElement)
                        this.setState({ ...this.state, showTitle: true })
                    else
                        this.setState({ ...this.state, showTitle: false })
                }.bind(this);


            }

        }

        if (this.isMobileDevice()) {
            this.setState({ ...this.state, isMobile: true })
        }

    }

    setInitialSeekRate = (lastSeekRate) => {
        return new Promise((resolve, reject) => {
            this.props.form.setFieldsValue({ seekRate: Number(lastSeekRate).toFixed(2) })
            this.setState({ ...this.state, seekRate: Number(lastSeekRate).toFixed(2) })
            return resolve(true)
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setSeekRateCookie = (value) => {
        cookies.setCookie('last_seek_rate', value)
    }

    getSeekRateCookie = () => {
        const nookie = cookies.getCookie('last_seek_rate')
        return nookie
    }

    setCanvasManipulation = () => {
        let video = document.querySelector('#' + this.id)
            , canvas = document.querySelector("#canvas" + this.id)
            , canvas_ctx = canvas.getContext('2d')
            , drawcanvas = document.getElementById('draw' + this.id)
            , drawcanvas_ctx = drawcanvas.getContext("2d")
            , clear_button = document.querySelector('#clear' + this.id)
        // , overlay = document.querySelector('#overlay' + this.id)
        // , info = document.querySelector('#info' + this.id)
        // , initial = document.querySelector('#initial' + this.id)

        clear_button.addEventListener('click', () => {
            drawcanvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
        })

        video.addEventListener('timeupdate', () => {
            this.props.form.setFieldsValue({ ['time' + this.id]: video.currentTime.toFixed(2) })
        })

        let setSizeForCanvas = () => {
            // Set canvas dimensions same as video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight + 65;

            // console.log('set width height')
            drawcanvas.width = video.getBoundingClientRect().width
            drawcanvas.height = video.getBoundingClientRect().height

            this.setState({ ...this.state, videoLoading: false })
        }

        // video.addEventListener('loadedmetadata', function () {
        //     // console.log('data loaded')
        //     if (this.props.seq == 'only') {
        //         setTimeout(() => {
        //             setSizeForCanvas()
        //         }, 500);
        //     } else {
        //         setTimeout(() => {
        //             setSizeForCanvas()
        //         }, 500);
        //     }
        // }.bind(this));

        video.addEventListener('canplay', function () {
            // console.log('data loaded')
            if (this.props.seq == 'only') {
                setTimeout(() => {
                    setSizeForCanvas()
                }, 500);
            } else {
                // setTimeout(() => {
                    setSizeForCanvas()
                // }, 500);
            }
        }.bind(this));

        if (video.readyState >= 2) {
            console.log('data loaded but weird')
            if (this.props.seq == 'only') {
                setTimeout(() => {
                    setSizeForCanvas()
                }, 500);
            } else {
                setTimeout(() => {
                    setSizeForCanvas()
                }, 500);
            }
        }

        //**********************************MOUSE TRACK*********************************** */

        window.addEventListener('resize', function () {
            drawcanvas.width = video.getBoundingClientRect().width
            drawcanvas.height = video.getBoundingClientRect().height
        });

        this.started = false;

        drawcanvas.addEventListener('mousedown', () => {
            drawcanvas_ctx.save()
            drawcanvas_ctx.beginPath();
            this.started = true;
        })

        drawcanvas.addEventListener('mousemove', (f) => {
            if (this.started == true) {

                var rect = drawcanvas.getBoundingClientRect();  // absolute position of element
                var x = ((event.clientX - rect.left)) | 0;
                var y = ((event.clientY - rect.top)) | 0;

                // console.log('draw x:', x, ' y:', y)
                // var endx = f.pageX - drawcanvas.offsetLeft;
                // var endy = f.pageY - drawcanvas.offsetTop;
                drawcanvas_ctx.restore()
                if (!this.state.eraserMode) {
                    //draw mode
                    drawcanvas_ctx.globalCompositeOperation = 'source-over';
                    drawcanvas_ctx.lineWidth = 3; // brush size
                } else {
                    //erase mode
                    drawcanvas_ctx.globalCompositeOperation = 'destination-out';
                    drawcanvas_ctx.lineWidth = 25; // eraser size
                }
                drawcanvas_ctx.lineTo(x, y)
                drawcanvas_ctx.strokeStyle = this.state.pickedColor
                drawcanvas_ctx.lineJoin = drawcanvas_ctx.lineCap = 'round';
                drawcanvas_ctx.stroke()
            }
        })

        drawcanvas.addEventListener('mouseup', () => {
            this.started = false;
        })

        drawcanvas.addEventListener('mouseleave', () => {
            this.started = false;
        });

        // canvasDraw.width = this.vidWidth
        // canvasDraw.height = this.vidHeight

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

        let title = this.props.title

        let downloadLink = document.querySelector("#download" + this.id)

        downloadLink.addEventListener('click', function () {
            //clear canvas
            canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);

            //get image from video position
            canvas_ctx.drawImage(video, 0, 70, video.videoWidth, video.videoHeight); // +5 y axis from height to delete green line on the bottom of image
            canvas_ctx.drawImage(drawcanvas, 0, 70, video.videoWidth, video.videoHeight);

            let textWidth = canvas_ctx.measureText(title).width

            canvas_ctx.font = 'normal ' + (textWidth > 200 ? '37px' : '40px') + ' Arial';

            canvas_ctx.fillStyle = 'yellow'
            canvas_ctx.fillText(title, 20, 45);

            // canvas_ctx.fillStyle = "#c82124"; //red
            // canvas_ctx.beginPath();
            // canvas_ctx.arc(1000, 200, 70, 0, 2 * Math.PI);
            // canvas_ctx.strokeStyle = "#c82124";
            // canvas_ctx.stroke();

            // navigator.permissions.query({
            //     name: 'clipboard-write'
            // }).then(permissionStatus => {
            //     // Will be 'granted', 'denied' or 'prompt':
            //     console.log(permissionStatus.state);

            //     // Listen for changes to the permission state
            //     permissionStatus.onchange = () => {
            //         console.log(permissionStatus.state);
            //     };
            // });

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

    }

    hideImage = () => {
        this.setState({ isImageHidden: true })
    }

    showImage = () => {
        this.setState({ isImageHidden: false })
    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    forward = () => {
        const increment = Number(this.state.seekRate)
        let video = document.querySelector('#' + this.id)
        video.pause()

        let val = (video.currentTime + increment).toFixed(2)
        this.props.form.setFieldsValue({ ['time' + this.id]: val })
        video.currentTime = val
    }

    backward = () => {
        const decrement = Number(this.state.seekRate)
        let video = document.querySelector('#' + this.id)
        video.pause()


        let val = (video.currentTime - decrement).toFixed(2)
        val = val < 0 ? 0 : val

        this.props.form.setFieldsValue({ ['time' + this.id]: val })
        video.currentTime = val
    }

    seekRateChange = (value) => {
        this.setState({ seekRate: value.toFixed(2) })
        this.setSeekRateCookie(value)
    }

    setModalClose = async () => {
        let video = document.querySelector('#' + this.id)
        let doPause = () => {
            return new Promise((resolve, reject) => {

                video.pause()

                return resolve(true)
            })
        }

        await doPause() && this.props.doClose()
    }

    setFullscreen = () => {
        let vid = document.getElementById('vidcontainer' + this.id)
        vid.requestFullscreen()
    }

    onModeChange = (checked) => {
        this.setState({
            ...this.state, editMode: checked, disableButton: {
                // forward: checked,
                // backward: checked,
                fullscreen: checked,
            }
        })
        document.querySelector('#' + this.id).pause()
    }

    changeColor = (color) => {
        this.setState({ ...this.state, pickedColor: color.hex, colorVisible: false, eraserMode: false, brushIcon: 'pen' })
    }

    handleColorVisible = visible => {
        this.setState({ ...this.state, colorVisible: visible });
    };

    chooseEraser = () => {
        this.setState({ ...this.state, eraserMode: true, colorVisible: false, pickedColor: 'grey', brushIcon: 'eraser' })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <React.Fragment>
                <Row>
                    <Title level={4}>{this.props.title}</Title>
                    <Divider style={{ marginTop: "5px", marginBottom: "15px" }} />
                </Row>
                <Row>

                    <div id={'vidcontainer' + this.id}>
                        {this.state.showTitle ? <Title style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>{this.props.title}</Title> : null}
                        <img
                            hidden={this.state.isImageHidden}
                            src={this.props.imageURL}
                            width='100%'
                            height='auto'
                            style={{ position: 'absolute', zIndex: 5, borderRadius: '6px', marginBottom: '5px' }}
                            onClick={this.hideImage}
                        />
                        <video
                            id={this.id}
                            controls={!this.state.editMode}
                            width="100%"
                            playsInline
                            // autoPlay={this.props.isAutoPlay}
                            autoPlay={false}
                            style={{ zIndex: 1, borderRadius: '6px' }}
                        >
                            <source src={this.state.videoURL} />
                        </video>
                    </div>

                    <div hidden={!this.state.editMode} style={{ position: 'absolute', left: '10px', top: '10px', zIndex: 10, color: 'yellow', fontWeight: 'bold' }}>--PAINT MODE--</div>
                    <canvas hidden={!this.state.editMode} id={'draw' + this.id} style={{ cursor: 'crosshair', zIndex: 99, border: '1px solid yellow', position: 'absolute', left: '0', top: '0' }}></canvas>

                    {/* <div id={'info' + this.id} style={{ position: 'absolute', float: 'left', top: '0', zIndex: 10, backgroundColor: 'yellow' }}></div>
                    <i id={'initial' + this.id}></i> */}

                    <canvas style={{ display: 'none' }} id={'canvas' + this.id}></canvas>
                </Row>

                <Spin spinning={this.state.videoLoading} size="large">
                    <div style={{ backgroundColor: '#EEEEEE', padding: '7px', border: '1px solid #D9D9D9', borderRadius: '6px' }}>
                        <Row style={{ textAlign: 'center' }}>
                            <Form layout="inline">
                                <Col span={8}>
                                    {/* <Form.Item label="Mode">
                                    {getFieldDecorator('mode', {
                                        // initialValue: this.state.seekRate
                                    })( */}
                                    {/* <Tooltip title={<CirclePicker onChange={this.changeColor} colors={['#FE0002', '#F9941E', '#FFFF01', '#01FF06', '#0000FE', '#F800F8']} />}>
                                        <Avatar hidden={!this.state.editMode} icon="highlight" style={{ color: '#EEEEEE', cursor: 'help', backgroundColor: this.state.pickedColor }} />
                                    </Tooltip> */}
                                    <div hidden={!this.state.editMode} style={{ display: 'inline-block', border: '1px dashed grey', padding: '3px', margin: '5px', borderRadius: '6px' }}>
                                        <Popover
                                            content={
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <CirclePicker onChange={this.changeColor} colors={['#FE0002', '#F9941E', '#FFFF01', '#01FF06', '#0000FE', '#F800F8']} />
                                                    <Divider type="vertical" />
                                                    <Button type="dashed" shape="circle" onClick={this.chooseEraser} ><EraserIcon style={{ stroke: 'black' }} /></Button>
                                                </div>
                                            }
                                            trigger="hover"
                                            visible={this.state.colorVisible}
                                            onVisibleChange={this.handleColorVisible}
                                        >
                                            <Button type="default" shape="circle" style={{ border: '0px', color: 'white', backgroundColor: this.state.pickedColor }} >
                                                {this.state.brushIcon == 'pen' ?
                                                    <Icon type="highlight" />
                                                    :
                                                    <EraserIcon style={{ stroke: 'white' }} />
                                                }
                                            </Button>
                                        </Popover>
                                        &nbsp;
                                    <Button hidden={!this.state.editMode} id={"clear" + this.id} type="danger" shape="round" size="small" ><Icon type="delete" />Clear</Button>
                                    </div>
                                    &nbsp;
                                    <Switch disabled={!this.state.isImageHidden} checkedChildren="Capture" unCheckedChildren="Player" onChange={this.onModeChange} />
                                    {/* )}
                                </Form.Item> */}
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Seek Rate">
                                        {getFieldDecorator('seekRate', {
                                            // initialValue: this.state.seekRate
                                        })(
                                            <div>
                                                <InputNumber disabled={!this.state.isImageHidden} value={this.state.seekRate} min={0} max={1} step={0.05} onChange={this.seekRateChange} />
                                                <Text> sec./click</Text>
                                            </div>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <Form.Item label="Current Time">
                                            {getFieldDecorator('time' + this.id, {
                                                initialValue: 0
                                            })(
                                                <Input
                                                    disabled={!this.state.isImageHidden}
                                                    readOnly
                                                    style={{ width: '90px' }}
                                                    suffix="sec."
                                                />
                                            )}
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Form>
                        </Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col span={8} hidden={this.state.isMobile}>
                                <a disabled={!this.state.isImageHidden} id={"download" + this.id} href="#" style={{ fontSize: '17px' }}><Button type="dashed"><Icon type="camera" /> Capture to clipboard</Button></a>
                            </Col>
                            {/* <div id="output"></div> */}
                            <Col span={8}>
                                <ButtonGroup>
                                    <Button icon="backward" disabled={this.state.disableButton.backward || !this.state.isImageHidden} size="large" shape="round" onClick={this.backward} />
                                    <Button icon="forward" disabled={this.state.disableButton.forward || !this.state.isImageHidden} size="large" shape="round" onClick={this.forward} />
                                </ButtonGroup>
                            </Col>
                            <Col span={8}>
                                <ButtonGroup style={{ marginLeft: "10px" }}>
                                    <Button hidden={!this.state.isImageHidden} disabled={this.state.editMode} size="large" onClick={this.showImage}>Show Image</Button>
                                    <Button icon="fullscreen" disabled={this.state.disableButton.fullscreen || !this.state.isImageHidden} type="default" size="large" onClick={this.setFullscreen} >Fullscreen</Button>
                                    {this.props.hasOwnProperty('doClose') ?
                                        <Button icon="close" type="danger" size="large" onClick={this.setModalClose} >Close</Button>
                                        : null}
                                </ButtonGroup>

                            </Col>
                        </Row>
                    </div>
                </Spin>
            </React.Fragment >
        )
    }
}


const WrappedVideoPlayer = Form.create({ name: 'video_player_form' })(VideoPlayer)

export default WrappedVideoPlayer