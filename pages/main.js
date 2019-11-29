import React, { forwardRef } from 'react'
import { List, Card, Table, Button, Row, Col } from 'antd'

import DatePicker from "react-datepicker";


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
                                <source src="static/bunny.mp4" type="video/mp4" />
                            </video>
                        )
                    })()
                },
                {
                    title: 'Title 2',
                    content: 'Content 2'
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
            startDate: new Date()
        }
    }

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
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                            customInput={<CustomInput />}
                        />
                    </Col>
                    <Col span={12}>
                        <Button type="danger" onClick={this.addList}>+</Button>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col>
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