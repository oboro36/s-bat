import { Slider, Popover, Button, Tag, Row, Col, Typography, Icon, InputNumber } from 'antd';
const { Text } = Typography;
let uniqueId = 0
import cookies from '../../utils/cookies'
import { set } from 'mobx';

class PrioritySlider extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            sliderVisible: false,
            sliderSetting: {
                min: 0,
                max: 20
            },
            sliderValue: this.props.priorityValue,
            tempValue: {},
            tempMax: 0,
        }
    }

    componentDidMount() {

        let last = this.getPriorityCookie()
        if (last) {
            let split = last.split('@') //high/medium/low
            let priority = {
                high: split[0].split('/'),
                mid: split[1].split('/'),
                low: split[2].split('/')
            }
            this.setState({ ...this.state, sliderValue: priority }, () => {

                let maxSetting = this.getPrioritySettingCookie()
                if (maxSetting) {
                    this.setState({
                        sliderSetting: { ...this.state.sliderSetting, max: Number(maxSetting) }
                    }, () => {
                        // console.log(this.state)

                        this.props.catchSliderValue(this.state.sliderValue)

                    })
                }
            })
        }
    }

    getPriorityCookie = () => {
        const nookie = cookies.getCookie('last_priority')
        return nookie
    }

    setPriorityCookie = (priority) => {
        let prep = [priority.high.join('/'), priority.mid.join('/'), priority.low.join('/')]
        cookies.setCookie('last_priority', prep.join('@'))
    }

    getPrioritySettingCookie = () => {
        const nookie = cookies.getCookie('last_setting')
        return nookie
    }

    setPrioritySettingCookie = (max) => {
        cookies.setCookie('last_setting', max)
    }


    handleCancel = () => {
        this.setState({
            ...this.state,
            sliderVisible: false,
            sliderValue: this.state.tempValue,
            sliderSetting: { ...this.state.sliderSetting, max: this.state.tempMax }
        },
            () => console.log(this.state.sliderSetting))
    }

    handleConfirm = () => {
        this.setPriorityCookie(this.state.sliderValue)
        this.setPrioritySettingCookie(this.state.sliderSetting.max)
        this.props.catchSliderValue(this.state.sliderValue)
        this.setState({ sliderVisible: false })
    }

    handleVisibleChange = visible => {
        let newState = {}

        if (visible) {
            newState = { tempValue: this.state.sliderValue, tempMax: this.state.sliderSetting.max }
        } else {
            newState = { sliderValue: this.state.tempValue, sliderSetting: { ...this.state.sliderSetting, max: this.state.tempMax } }
        }

        this.setState({ sliderVisible: visible }, () => {
            this.setState(newState, () => {
                console.log(this.state.sliderSetting)
            })
        });
    };

    //***************continuous range*************** range must be connected

    onHighChange = value => {
        if (value[0] > this.state.sliderValue.mid[0] && value[1] == this.state.sliderSetting.max) {
            this.setState({
                sliderValue: {
                    ...this.state.sliderValue,
                    high: value,
                    mid: [this.state.sliderValue.mid[0], value[0] - 1]
                }
            })
        }
    };

    onMidChange = value => {
        if (value[0] > this.state.sliderValue.low[0] && value[1] < this.state.sliderValue.high[1]) {
            this.setState({
                sliderValue: {
                    ...this.state.sliderValue,
                    high: [value[1] + 1, this.state.sliderValue.high[1]],
                    mid: value,
                    low: [this.state.sliderValue.low[0], value[0] - 1]
                }
            })
        }
    };

    onLowChange = value => {
        if (value[0] == this.state.sliderSetting.min && value[1] < this.state.sliderValue.mid[1]) {
            this.setState({
                sliderValue: {
                    ...this.state.sliderValue,
                    low: value,
                    mid: [value[1] + 1, this.state.sliderValue.mid[1]]
                }
            })
        }
    };

    onMaxChange = value => {
        this.setState({
            sliderSetting: {
                ...this.state.sliderSetting,
                max: Number(value)
            },
            sliderValue: {
                ...this.state.sliderValue,
                high: [this.state.sliderValue.high[0], Number(value)]
            }
        })
    };

    //***************free range*************** ordered but range can be set separately

    // onHighChange = value => {
    //     if (value[0] > this.state.sliderValue.mid[1]) {
    //         this.setState({
    //             sliderValue: {
    //                 ...this.state.sliderValue,
    //                 high: value
    //             }
    //         })
    //     }
    // };

    // onMidChange = value => {
    //     if (value[0] > this.state.sliderValue.low[1] && value[1] < this.state.sliderValue.high[0]) {
    //         this.setState({
    //             sliderValue: {
    //                 ...this.state.sliderValue,
    //                 mid: value
    //             }
    //         })
    //     }
    // };

    // onLowChange = value => {
    //     if (value[1] < this.state.sliderValue.mid[0]) {
    //         this.setState({
    //             sliderValue: {
    //                 ...this.state.sliderValue,
    //                 low: value
    //             }
    //         })
    //     }
    // };


    render() {

        let RangeTitle = props => {
            return (<span style={{ backgroundColor: props.bg, padding: '2px 8px 2px 8px', borderRadius: '1em' }}><Text style={{ color: props.color, fontWeight: 'bold' }}>{props.min} <Icon type="swap-right" /> {props.max}</Text></span>)
        }

        let prioritySetting = (
            <Col style={{ width: '250px' }}>
                <Row>
                    <Row>
                        <Col span={8}>
                            <Tag color="red">High</Tag>
                        </Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <RangeTitle color="#f85e65" bg="#fff1f0" min={this.state.sliderValue.high[0]} max={this.state.sliderValue.high[1]} />
                        </Col>
                    </Row>
                    <Slider
                        className="high-priority"
                        // marks={this.state.marks}
                        min={this.state.sliderSetting.min}
                        max={this.state.sliderSetting.max}
                        range={true}
                        included={true}
                        // dots={true}
                        onChange={this.onHighChange}
                        value={this.state.sliderValue.high}
                    />
                </Row>
                <Row>
                    <Row>
                        <Col span={8}>
                            <Tag color="gold">Medium</Tag>
                        </Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <RangeTitle color="#fab323" bg="#fffbe6" min={this.state.sliderValue.mid[0]} max={this.state.sliderValue.mid[1]} />
                        </Col>
                    </Row>
                    <Slider
                        // marks={this.state.marks}
                        min={this.state.sliderSetting.min}
                        max={this.state.sliderSetting.max}
                        range={true}
                        included={true}
                        // dots={true}
                        onChange={this.onMidChange}
                        value={this.state.sliderValue.mid}
                    />
                </Row>
                <Row>
                    <Row>
                        <Col span={8}>
                            <Tag color="green">Low</Tag>
                        </Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <RangeTitle color="#8ed967" bg="#f6ffed" min={this.state.sliderValue.low[0]} max={this.state.sliderValue.low[1]} />
                        </Col>
                    </Row>
                    <Slider
                        className="low-priority"
                        // marks={this.state.marks}
                        min={this.state.sliderSetting.min}
                        max={this.state.sliderSetting.max}
                        range={true}
                        included={true}
                        // dots={true}
                        onChange={this.onLowChange}
                        value={this.state.sliderValue.low}
                    />
                </Row>
                <Row style={{ marginTop: '10px' }} gutter={5}>
                    <Col span={12}>
                        <Button onClick={this.handleCancel} block>Cancel</Button>
                    </Col>
                    <Col span={12}>
                        <Button onClick={this.handleConfirm} type="primary" block>Confirm</Button>
                    </Col>
                </Row>
            </Col >
        )

        let title = (
            <Row>
                <Col span={14}>
                    <Text>Priority Configuration</Text>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                    &nbsp; Max: <InputNumber size="small" style={{ width: '55px' }} min={1} max={100000} value={this.state.sliderSetting.max} onChange={this.onMaxChange} />
                </Col>
            </Row>
        )


        return (
            <React.Fragment>
                <Popover
                    content={prioritySetting}
                    title={title}
                    trigger="click"
                    visible={this.state.sliderVisible}
                    onVisibleChange={this.handleVisibleChange}
                >
                    <Button type="default" shape="round" icon="setting" size="small" >Priority</Button>&nbsp;
                </Popover>
            </React.Fragment >
        )
    }
}

export default PrioritySlider