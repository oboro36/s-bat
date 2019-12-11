import React, { forwardRef } from 'react'
import { Button, Row, Col, Form, Select, Divider } from 'antd'
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDate, getMonth, getYear, isThisHour } from 'date-fns';

import ja from 'date-fns/locale/ja';
registerLocale('ja', ja)

//custom lib
import { invokeApi } from '../../base/axios'

const { Option } = Select;

class VideoSearchForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            listDataSource: [],
            listColumnSize: 1,
            loading: {
                site: true,
                program: false,
                line: false,
                content: false
            },
            searchCond: {
                output: this.props.selectedOutput,
                site: '',
                program: '',
                line: '',
                content: '',
                condDate: new Date()
            },
            dropdownList: {
                sites: null,
                programs: null,
                lines: null,
                contents: null
            }
        }
        this._isMounted = false;
    }

    componentDidMount() {

        this._isMounted = true;

        invokeApi('post', '/api/getVideoSiteOption', null,
            (res) => {
                console.log(res)
                if (this._isMounted) {
                    this.setState({
                        loading: {
                            ...this.state.loading, site: false
                        },
                        dropdownList: {
                            sites: res.data.sites,
                        }
                    })
                }
            },
            (err) => {
                console.log(err)
                this.setState({
                    loading: { ...this.state.loading, site: false }
                })
            }
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSiteChange = (value) => {

        this.setState(prevState => ({
            loading: { ...prevState.loading, program: true, line: true, content: true }
        }))

        this.props.form.resetFields(['program', 'line', 'content'])

        invokeApi('post', '/api/getVideoOtherOption/', { site: value },
            (res) => {
                console.log(res)
                this.setState({
                    dropdownList: {
                        ...this.state.dropdownList,
                        programs: res.data.programs,
                        lines: res.data.lines,
                        contents: res.data.maintcontents,
                    }
                }, () => {
                    this.setState(prevState => ({
                        loading: { ...prevState.loading, program: false, line: false, content: false }
                    }))
                })
            },
            (err) => {
                console.log(err)
                this.setState(prevState => ({
                    loading: { ...prevState.loading, program: false, line: false, content: false }
                }))
            }
        )

    }

    handleDateChange = async (date) => {
        let editDate = () => {
            return new Promise((resolve, reject) => {
                this.setState(
                    {
                        searchCond: { condDate: date }
                    }
                )
                this.props.form.setFieldsValue(date)
                return resolve(true)
            })
        }
        await editDate() && this.props.sendFormValue(this.props.form.getFieldsValue())
        // await editDate() && this.handleSubmit()
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
                <Form labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
                    <Divider>{this.props.title}</Divider>
                    <Form.Item label="Output" hidden>
                        {getFieldDecorator('output', {
                            rules: [{ required: true, message: 'Please select your output type!' }],
                            initialValue: this.props.selectedOutput
                        })(
                            <Select
                                placeholder="Select your output type"
                            >
                                <Option value="img">Image</Option>
                                <Option value="gph">Graph</Option>
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label="Site">
                        {getFieldDecorator('site', {
                            rules: [{ required: true, message: 'Please select your site!' }],
                        })(
                            <Select
                                placeholder="Select your site"
                                onChange={this.handleSiteChange}
                                loading={this.state.loading.site}
                            >
                                {
                                    this.state.dropdownList.sites && this.state.dropdownList.sites.map(sites => (
                                        <Option key={sites.index}>{sites.value}</Option>
                                    ))
                                }
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label="Program">
                        {getFieldDecorator('program', {
                            rules: [{ required: true, message: 'Please select your program!' }],
                        })(
                            <Select
                                placeholder="Select your program"
                                loading={this.state.loading.program}
                            >
                                {
                                    this.state.dropdownList.programs && this.state.dropdownList.programs.map(programs => (
                                        <Option key={programs.index}>{programs.value}</Option>
                                    ))
                                }
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label="Line">
                        {getFieldDecorator('line', {
                            rules: [{ required: true, message: 'Please select your line!' }],
                        })(
                            <Select
                                placeholder="Select your line"
                                loading={this.state.loading.line}
                            >
                                {
                                    this.state.dropdownList.lines && this.state.dropdownList.lines.map(lines => (
                                        <Option key={lines.index}>{lines.value}</Option>
                                    ))
                                }
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label="Contents">
                        {getFieldDecorator('content', {
                            rules: [{ required: false, message: 'Please select your content!' }],
                        })(
                            <Select
                                placeholder="Select your content"
                                loading={this.state.loading.content}
                                allowClear
                            >
                                {
                                    this.state.dropdownList.contents && this.state.dropdownList.contents.map(contents => (
                                        <Option key={contents.index}>{contents.value}</Option>
                                    ))
                                }
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label="Date">
                        {getFieldDecorator('date-picker', {
                            rules: [{ type: 'object', required: true, message: 'Please select date!' }],
                            initialValue: this.state.searchCond.condDate
                        })(
                            <DatePicker
                                renderCustomHeader={customDatepickerHeader}
                                locale="ja"
                                // showMonthDropdown
                                // showYearDropdown
                                // dropdownMode="select"
                                selected={this.state.searchCond.condDate}
                                onChange={this.handleDateChange}
                                customInput={<CustomInput />}
                                dateFormat="yyyy/MM/dd"
                                renderDayContents={renderDayContents}
                            />
                        )}
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

const WrappedVideoSearchForm = Form.create({ name: 'video_search_form' })(VideoSearchForm)

export default WrappedVideoSearchForm