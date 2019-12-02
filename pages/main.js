import React, { forwardRef } from 'react'
import { List, Card, Table, Button, Row, Col } from 'antd'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDate, getMonth, getYear } from 'date-fns';
import moment from 'moment';
import { invokeApi } from '../base/axios'

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

class Main extends React.Component {
    constructor(props) {
        // console.log(process.browser)
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
            listDataSource: [
                {
                    title: 'Title 1',
                    content: (() => {
                        return (
                            <video id="video" controls="controls" width="100%" height="auto" preload="auto">
                                <source src="static/testvideo.mp4" type="video/mp4" />
                            </video>
                        )
                    })()
                },
                {
                    title: 'Title 2',
                    content: (() => {
                        return (
                            <video id="video" controls="controls" width="100%" height="auto" preload="auto">
                                <source src="static/testvideo.mp4" type="video/mp4" />
                            </video>
                        )
                    })()
                },
                {
                    title: 'Title 3',
                    content: 'Content 3'
                },
                {
                    title: 'Title 4',
                    content: 'Content 4'
                },
                {
                    title: 'Title 5',
                    content: 'Content 5'
                },
                {
                    title: 'Title 6',
                    content: 'Content 6'
                },
            ],
            listColumnSize: 4,
            startDate: new Date(),
            hightlightList: {
                type1: [],
                type2: [],
                type3: []
            }
        }
    }

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    componentDidMount() {
        if (this.isMobileDevice()) {
            this.setState({ listColumnSize: 2 })
        }
    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    getPerson = () => {
        self = this

        this.setState({ loading: true })

        setTimeout(() => {
            invokeApi('post', '/alluser',
                (res) => {
                    let result = res.data
                    self.setState({ tableDataSource: result })
                    self.setState({ loading: false })
                },
                (err) => {
                    alert(err)
                    self.setState({ loading: false })
                }
            )
        }, 2000);
    }

    addList = () => {
        this.setState(state => {
            var joined = this.state.listDataSource.concat({ title: 'Title new', content: 'Content new' });
            this.setState({ listDataSource: joined })
        })
    }

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    render() {

        const CustomInput = forwardRef((props, ref) => {
            return (
                <Button onClick={props.onClick}>
                    {props.value}
                </Button>
            )
        })

        const renderDayContents = (day, date) => {
            let tooltipText = `Tooltip for date: ${date}`;
            let highlight = {}
            let clickEvent = null
            let dayType = ''
            if(day == 15){
                dayType = 'blue'
            } else if(day == 24) {
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
                <Row gutter={[16, 16]} style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    <Col span={6}>
                        <DatePicker
                            renderCustomHeader={({
                                date,
                                changeYear,
                                changeMonth,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled
                            }) => (
                                    <div
                                        style={{
                                            margin: 10,
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                            {"<"}
                                        </button>
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

                                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                            {">"}
                                        </button>
                                    </div>
                                )}
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                            customInput={<CustomInput />}
                            dateFormat="yyyy/MM/dd"
                            renderDayContents={renderDayContents}
                        />
                    </Col>
                    <Col span={6}>
                        <Button type="danger" onClick={this.addList}>+</Button>
                    </Col>
                    <Col span={6}>

                    </Col>
                    <Col span={6}>

                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <List
                            grid={{
                                gutter: 16,
                                column: this.state.listColumnSize
                            }}
                            dataSource={this.state.listDataSource}
                            renderItem={item => (
                                <List.Item>
                                    <Card title={item.title}>{item.content}</Card>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Main