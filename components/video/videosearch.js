import React, { forwardRef } from 'react'
import { List, Card, Button, Row, Col, Collapse, Form, Select, Checkbox, Icon } from 'antd'
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDate, getMonth, getYear } from 'date-fns';

import ja from 'date-fns/locale/ja';
registerLocale('ja', ja)
const { Panel } = Collapse;
const { Option } = Select;

//custom lib
import { invokeApi } from '../../base/axios'

class VideoSearch extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableDataSource: [
                {
                    ID: '01',
                    UserName: 'Cat',
                    Content: '-'
                },
                {
                    ID: '02',
                    UserName: 'Dog',
                    Content: '-'
                },
                {
                    ID: '03',
                    UserName: 'Snake',
                    Content: '-'
                }
            ],
            listDataSource: [],
            listColumnSize: 1,
            searchCond: {
                site: '',
                program: '',
                line: '',
                contents: '',
                condDate: new Date()
            },
        }
    }


    handleChange = date => {
        this.setState(
            {
                searchCond: { condDate: date }
            }
        )
    }

    addList = () => {

        let dummy = [
            {
                title: "P1 POS1",
                imageURL: 'static/imgoutput1.jpg',
                videoURL: 'static/testvideo.mp4',
                content: (() => {
                    return (
                        <Row>
                            <Col span={24}>
                                {/* <video id="video" controls="controls" width="100%" height="auto" preload="metadata">
                                    <source src="static/testvideo.mp4" type="video/mp4" />
                                </video> */}
                                <img src="static/imgoutput1.jpg" width="100%" height="auto" />
                            </Col>
                        </Row>
                    )
                })()
            },
            {
                title: "P1 POS2",
                imageURL: 'static/imgoutput2.jpg',
                videoURL: 'static/testvideo.mp4',
                content: (() => {
                    return (
                        <Row>
                            <Col span={24}>
                                {/* <video id="video" controls="controls" width="100%" height="auto" preload="metadata">
                                    <source src="static/testvideo.mp4" type="video/mp4" />
                                </video> */}
                                <img src="static/imgoutput2.jpg" width="100%" height="auto" />
                            </Col>
                        </Row>
                    )
                })()
            },
        ]

        this.setState(state => {
            var joined = this.state.listDataSource.concat([
                dummy
            ])
            this.setState({ listDataSource: joined })
        })
    }

    handleSubmit = () => {

    }

    handleActions = (action, URL) => {
        if (action == 'zoom') {
            console.log(URL)
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const CustomInput = forwardRef((props, ref) => {
            return (
                <Button icon="calendar" onClick={props.onClick}>
                    {props.value}
                </Button>
            )
        })

        const renderDayContents = (day, date) => {
            let tooltipText = `Tooltip for date: ${date}`;
            let highlight = {}
            let clickEvent = null
            let dayType = ''
            if (day == 15) {
                dayType = 'blue'
            } else if (day == 24) {
                dayType = 'red'
            }

            switch (dayType) {
                case 'blue':
                    //set style for the day
                    highlight.border = '1px solid #1890ff'
                    highlight.backgroundColor = '#DEEFFF'
                    highlight.borderRadius = '0.3rem'

                    tooltipText = 'BLUE day'

                    //add Event

                    clickEvent = () => {
                        alert('This is BLUE day!!!')
                    }
                    break
                case 'red':
                    //set style for the day
                    highlight.border = '1px solid #ff9292'
                    highlight.backgroundColor = '#FFDEDE'
                    highlight.borderRadius = '0.3rem'

                    tooltipText = 'RED day'

                    //add Event

                    clickEvent = () => {
                        alert('This is RED day!!!')
                    }
                    break
                default:
                    break
            }

            return <div style={highlight} onClick={clickEvent} title={tooltipText}>{getDate(date)}</div>;
        };


        const range = (start, end, incre = 1) => {
            let arr = []

            for (let index = start; index <= end; index++) {
                arr.push(index)
            }

            return arr
        }

        const years = range(2010, getYear(new Date()) + 10);
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        const customDatepickerHeader = ({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled
        }) => {
            return (
                <div
                    style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Button icon="arrow-left" shape="circle" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} />
                    &nbsp;
                    <select
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}
                    >
                        {years.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    &nbsp;
                    <select
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                        }
                    >
                        {months.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    &nbsp;
                    <Button icon="arrow-right" shape="circle" onClick={increaseMonth} disabled={nextMonthButtonDisabled} />
                </div>
            )
        }

        return (
            <React.Fragment>
                <Row>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header={this.props.customTitle} key="1">
                            <Button type="danger" onClick={this.addList}>+</Button>
                            <Form labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
                                <Form.Item label="Site">
                                    {getFieldDecorator('site', {
                                        rules: [{ required: true, message: 'Please select your site!' }],
                                    })(
                                        <Select
                                            placeholder="Select your site"
                                        >
                                            <Option value="SHDI">SHDI</Option>
                                            <Option value="SHDT">SHDT</Option>
                                        </Select>,
                                    )}
                                </Form.Item>
                                <Form.Item label="Program">
                                    {getFieldDecorator('program', {
                                        rules: [{ required: true, message: 'Please select your site!' }],
                                    })(
                                        <Select
                                            placeholder="Select your program"
                                        >
                                            <Option value="SHDI">SHDI</Option>
                                            <Option value="SHDT">SHDT</Option>
                                        </Select>,
                                    )}
                                </Form.Item>
                                <Form.Item label="Line">
                                    {getFieldDecorator('line', {
                                        rules: [{ required: true, message: 'Please select your site!' }],
                                    })(
                                        <Select
                                            placeholder="Select your line"
                                        >
                                            <Option value="SHDI">SHDI</Option>
                                            <Option value="SHDT">SHDT</Option>
                                        </Select>,
                                    )}
                                </Form.Item>
                                <Form.Item label="Contents">
                                    {getFieldDecorator('contents', {
                                        rules: [{ required: false, message: 'Please select your site!' }],
                                    })(
                                        <Select
                                            placeholder="Select your content"
                                            allowClear
                                        >
                                            <Option value="SHDI">SHDI</Option>
                                            <Option value="SHDT">SHDT</Option>
                                        </Select>,
                                    )}
                                </Form.Item>
                                <Form.Item label="Date">
                                    {getFieldDecorator('date-picker', {
                                        rules: [{ type: 'object', required: true, message: 'Please select date!' }],
                                    })(
                                        <DatePicker
                                            renderCustomHeader={customDatepickerHeader}
                                            locale="ja"
                                            // showMonthDropdown
                                            // showYearDropdown
                                            // dropdownMode="select"
                                            selected={this.state.searchCond.condDate}
                                            onChange={this.handleChange}
                                            customInput={<CustomInput />}
                                            dateFormat="yyyy/MM/dd"
                                            renderDayContents={renderDayContents}
                                        />
                                    )}
                                </Form.Item>
                                {/* <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                                    <Button type="primary">
                                        Submit
                                    </Button>
                                </Form.Item> */}
                            </Form>
                        </Panel>
                    </Collapse>
                </Row>
                &nbsp;
                <Row>
                    <List
                        grid={{
                            gutter: 16,
                            column: this.state.listColumnSize
                        }}
                        dataSource={this.state.listDataSource}
                        renderItem={item => (
                            <List.Item>
                                <Row>
                                    <Col span={12}>
                                        <Card
                                            title={item[0].title}
                                            actions={[
                                                <Icon type="play-square" key="play-square" />,
                                                <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', item[0].imageURL) }} />,
                                            ]}
                                        >{item[0].content}</Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card
                                            title={item[1].title}
                                            actions={[
                                                <Icon type="play-square" key="play-square" />,
                                                <Icon type="zoom-in" key="zoom-in" onClick={() => { this.handleActions('zoom', item[1].imageURL) }} />,
                                            ]}
                                        >{item[1].content}</Card>
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                </Row>
            </React.Fragment>
        );
    }
}

const WrappedVideoSearchForm = Form.create({ name: 'video_search' })(VideoSearch)

export default WrappedVideoSearchForm