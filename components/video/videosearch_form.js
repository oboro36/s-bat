import React, { forwardRef } from 'react'
import { Badge, Button, Row, Col, Form, Select, Divider, message } from 'antd'
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDate, getMonth, getYear, isThisHour } from 'date-fns';

import ja from 'date-fns/locale/ja';
registerLocale('ja', ja)

//custom lib
import { invokeApi } from '../../utils/axios'
import moment from 'moment';

const { Option } = Select;

const openMessage = (type, desc) => {
    message[type](desc, 4);
};

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
                analysisdate: ''
            },
            searchDisable: {
                site: false,
                program: true,
                line: true,
                content: true,
                analysisdate: true
            },
            dropdownList: {
                sites: null,
                programs: null,
                lines: null,
                contents: null
            },
            selectedLabel: {
                site: '',
                program: '',
                line: '',
                content: '',
                analysisdate: '',
            },
            includeDates: [],
            maintDates: [],
            middleDates: [],
            otherDates: [],
            searchBy: 'none'
        }
        this._isMounted = false;
        this.maintcontens = [];
    }



    componentDidMount() {

        this._isMounted = true;

        invokeApi('post', '/api/getVideoSiteOption', null,
            (res) => {
                //console.log(res.data)
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
                // //console.log(err)
                alert(err)
                this.setState({
                    loading: { ...this.state.loading, site: false }
                })
            }
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSiteChange = (value, option) => {
        this.setState(prevState => ({
            loading: { ...prevState.loading, program: true, line: true }
        }))

        this.setClear(['program', 'line', 'content', 'analysisdate'])
        this.setDisable(true, ['program', 'line', 'content', 'analysisdate'])

        // this.setDisable(true,'program')

        invokeApi('post', '/api/getVideoProgramLineOption', {
            site: value
        },
            (res) => {

                if (res.status == 204) {
                    openMessage('warning', 'No data in selected Site')
                } else if (res.status == 200) {
                    this.setDisable(false, ['program', 'line'])
                }

                this.setState({
                    dropdownList: {
                        ...this.state.dropdownList,
                        programs: res.data.programs,
                        lines: res.data.lines,
                    }
                })

                this.setState(prevState => ({
                    loading: { ...prevState.loading, program: false, line: false },
                    selectedLabel: { ...prevState.selectedLabel, site: option.props.children },
                }))

            },
            (err) => {
                // //console.log(err)
                this.setState(prevState => ({
                    loading: { ...prevState.loading, program: false, line: false }
                }))
            }
        )
    }

    handleProgramChange = async (value, option) => {
        if (this.state.searchBy == 'none' || this.state.searchBy == 'program') {
            this.setState(prevState => ({
                loading: { ...prevState.loading, line: true }
            }))

            this.setClear(['line', 'content', 'analysisdate'])
            this.setDisable(true, ['line', 'content', 'analysisdate'])

            invokeApi('post', '/api/getVideoLineOption', {
                site: this.props.form.getFieldValue('site'),
                program: value
            },
                (res) => {
                    //console.log(res)
                    if (res.status == 204) {
                        openMessage('warning', 'No data in selected Program')
                    } else if (res.status == 200) {
                        this.setDisable(false, 'line')
                        this.setState({ searchBy: 'program' })
                    }
                    this.setState({
                        dropdownList: {
                            ...this.state.dropdownList,
                            lines: res.data.lines,
                        }
                    })

                    this.setState(prevState => ({
                        loading: { ...prevState.loading, line: false },
                    }))
                },
                (err) => {
                    // //console.log(err)
                    this.setState(prevState => ({
                        loading: { ...prevState.loading, line: false }
                    }))
                }
            )
        }

        this.setState({ selectedLabel: { ...this.state.selectedLabel, program: option.props.children } })

        let [program, line] = await this.getProgramLine()
        if (value && line) {
            this.getContent()
        }
    }

    handleLineChange = async (value, option) => {
        if (this.state.searchBy == 'none' || this.state.searchBy == 'line') {
            this.setState(prevState => ({
                loading: { ...prevState.loading, program: true }
            }))

            this.setClear(['program', 'content', 'analysisdate'])
            this.setDisable(true, ['program', 'content', 'analysisdate'])

            // this.setDisable(true,'program')
            invokeApi('post', '/api/getVideoProgramOption', {
                site: this.props.form.getFieldValue('site'),
                line: value
            },
                (res) => {
                    if (res.status == 204) {
                        openMessage('warning', 'No data in selected Line')
                    } else if (res.status == 200) {
                        this.setDisable(false, 'program')
                        this.setState({ searchBy: 'line' })
                    }

                    this.setState({
                        dropdownList: {
                            ...this.state.dropdownList,
                            programs: res.data.programs,
                        }
                    })

                    this.setState(prevState => ({
                        loading: { ...prevState.loading, program: false }
                    }))

                },
                (err) => {
                    console.log(err)
                    this.setState(prevState => ({
                        loading: { ...prevState.loading, program: false }
                    }))
                }
            )
        }

        this.setState({ selectedLabel: { ...this.state.selectedLabel, line: value } })

        let [program, line] = await this.getProgramLine()
        if (program && value) {
            this.getContent()
        }

    }

    getProgramLine = () => {
        return new Promise((resolve, reject) => {
            return resolve([this.props.form.getFieldValue('program'), this.props.form.getFieldValue('line')])
        })
    }

    getContent = () => {
        this.setState(prevState => ({
            loading: { ...prevState.loading, content: true }
        }))

        this.setClear(['content', 'analysisdate'])
        this.setDisable(true, ['content', 'analysisdate'])

        const selectedProgram = this.props.form.getFieldValue('program')
        const selectedLine = this.props.form.getFieldValue('line')

        invokeApi('post', '/api/getVideoContentOption', {
            site: this.props.form.getFieldValue('site'),
            program: selectedProgram,
            line: selectedLine,
        },
            (res) => {
                //console.log(res)
                if (res.status == 204) {
                    openMessage('warning', 'No data in selected Line')
                } else if (res.status == 200) {

                    this.setDisable(false, 'content')
                    this.setIncludeDate()

                }

                this.setState({
                    dropdownList: {
                        ...this.state.dropdownList,
                        contents: res.data.contents,
                    }
                })

                this.setState(prevState => ({
                    loading: { ...prevState.loading, content: false },
                    // selectedLabel: { ...prevState.selectedLabel, line: option.props.children },
                }))
            },
            (err) => {
                // //console.log(err)
                this.setState(prevState => ({
                    loading: { ...prevState.loading, content: false }
                }))
            }
        )
    }

    handleContentChange = (value, option = null) => {
        this.setState({ selectedLabel: { ...this.state.selectedLabel, content: option == null ? null : option.props.children } })

        this.setClear(['analysisdate'])
        this.setDisable(true, ['analysisdate'])

        this.setIncludeDate(value)
    }

    setIncludeDate = (value = null) => {

        //console.log(this.props.form.getFieldsValue())

        invokeApi('post', '/api/getVideoAvailableDate', { cond: this.props.form.getFieldsValue(), content: value },
            (res) => {
                // console.log(res)
                if (res.status == 204) {
                    openMessage('warning', 'No data')
                    this.setState({ ...this.state, includeDates: [] })
                } else if (res.status == 200) {

                    let formatDate = res.data.dates.map((member) => {
                        return member.ANALYSIS_DATE
                    }).map((date) => {
                        return moment(date, 'YYYYMMDD').toDate();
                    })

                    this.setState({ ...this.state, includeDates: formatDate }, () => {
                        this.setDisable(false, 'analysisdate')
                    })

                    //manage 3 type of date

                    let prep = {
                        maint: [],
                        middle: []
                    }

                    res.data.dates.forEach((member) => {
                        switch (member.MAINT_CONTENTS_CODE) {
                            case '1':
                                prep.maint.push(member.ANALYSIS_DATE)
                                break
                            case '2':
                                prep.middle.push(member.ANALYSIS_DATE)
                                break
                            default:
                                break
                        }
                    })

                    this.setState({ ...this.state, maintDates: prep.maint, middleDates: prep.middle })

                    // console.log(this.state.maintDates)

                }

            },
            (err) => {
                console.log(err)
            }
        )
    }

    handleDateChange = async (date, event) => {
        //console.log(date)
        let editDate = () => {
            return new Promise((resolve, reject) => {
                this.setState(
                    {
                        searchCond: { ...this.state.searchCond, analysisdate: date },
                        selectedLabel: { ...this.state.selectedLabel, analysisdate: moment(date, 'YYYYMMDD').format('YYYY-MM-DD'), content: event.target.title },
                    }
                )
                this.props.form.setFieldsValue(date)
                return resolve(true)
            })
        }

        await editDate() && this.props.sendFormValue(this.props.form.getFieldsValue(), this.state.selectedLabel)

        // if (this.props.form.getFieldValue('content')) {
        this.props.validateForm(true)
        // } else {
        //     openMessage('error', <span>Please select <b>content</b>.</span>)
        //     this.props.validateForm(false)
        // }

    }

    setClear = (option) => {

        this.props.validateForm(false)


        if (Array.isArray(option)) {
            this.props.form.resetFields(option)
        } else {
            this.props.form.resetFields([option])
        }

        //reset date on button
        this.setState(
            {
                searchCond: { ...this.state.searchCond, analysisdate: null }
            }
        )
    }

    setDisable = (set, option) => {
        if (Array.isArray(option)) {
            let newState = { ...this.state.searchDisable }

            option.forEach((member) => {
                newState[member] = set
            })

            // console.log(newState)

            this.setState({ searchDisable: { ...this.state.searchDisable, ...newState } })

        } else {
            this.setState({ searchDisable: { ...this.state.searchDisable, [option]: set } })
        }
    }

    maint_contents_data = (() => {
        invokeApi('post', '/api/getMasterMaintContents', { site: 'SHDI' },
            (res) => {
                if (res.status == 204) {
                    openMessage('warning', 'No master maintenance content data')
                } else if (res.status == 200) {
                    this.maintcontens = res.data.contents
                }
            },
            (err) => {
                console.log(err)
            }) //based on SHDI
    })()

    renderDayContents = (day, date) => {
        let tooltipText = `Tooltip for date: ${date} `;
        let highlight = {}
        let clickEvent = null

        let dayType = ''
        let contents_code = ''

        let now = moment(date).format('YYYYMMDD')

        if (this.state.maintDates.includes(now)) {
            dayType = 'maint'
            contents_code = '1'
            tooltipText = '整備'
        } else if (this.state.middleDates.includes(now)) {
            dayType = 'middle'
            contents_code = '2'
            tooltipText = '中日対応'
        }

        switch (dayType) {
            case 'maint':
                //set style for the day
                highlight.border = '1px solid #68A033'
                highlight.backgroundColor = '#99CD68'
                highlight.borderRadius = '0.3rem'

                //add Event
                this.setState.bind(this)

                clickEvent = () => {
                    // console.log(this.props.form.getFieldValue('content'))
                    this.props.form.setFieldsValue({ content: contents_code })
                    // this.setState({ selectedLabel: { ...this.state.selectedLabel, content: tooltipText } }, () => { console.log(this.state.selectedLabel.content) })
                    this.setIncludeDate(contents_code) //reset date include list
                }
                break
            case 'middle':
                //set style for the day
                highlight.border = '1px solid #3DAAC7'
                highlight.backgroundColor = '#84D7F5'
                highlight.borderRadius = '0.3rem'

                //add Event

                clickEvent = () => {
                    // console.log(this.props.form.getFieldValue('content'))
                    this.props.form.setFieldsValue({ content: contents_code })
                    // this.setState({ selectedLabel: { ...this.state.selectedLabel, content: tooltipText } })
                    this.setIncludeDate(contents_code)
                }
                break
            default:
                break
        }

        return <div style={highlight} onClick={clickEvent} title={tooltipText}>{getDate(date)}</div>;
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const CustomInput = forwardRef((props, ref) => {
            let val = props.value ? props.value : "Select date"

            return (
                <Button icon="calendar" onClick={props.onClick} disabled={props.disabled}>
                    {val}
                </Button>
            )
        })


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
                    <Divider>
                        <Badge status={this.props.validated ? 'success' : 'error'}>
                            <div style={{ border: '1px solid #EEEEEE', padding: '4px', borderRadius: '3px' }} >{this.props.title}</div>
                        </Badge>
                    </Divider>
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
                                disabled={this.state.searchDisable.site}
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
                                disabled={this.state.searchDisable.program}
                                onChange={this.handleProgramChange}
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
                                disabled={this.state.searchDisable.line}
                                onChange={this.handleLineChange}
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
                                disabled={this.state.searchDisable.content}
                                onChange={this.handleContentChange}
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
                        {getFieldDecorator('analysisdate', {
                            rules: [{ type: 'object', required: true, message: 'Please select date!' }],
                            initialValue: this.state.searchCond.analysisdate
                        })(
                            <DatePicker
                                renderCustomHeader={customDatepickerHeader}
                                // locale="ja"
                                // showMonthDropdown
                                // showYearDropdown
                                // dropdownMode="select"
                                selected={this.state.searchCond.analysisdate}
                                onChange={this.handleDateChange}
                                customInput={<CustomInput />}
                                dateFormat="yyyy/MM/dd"
                                renderDayContents={this.renderDayContents}
                                includeDates={this.state.includeDates}
                                disabled={this.state.searchDisable.analysisdate}
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