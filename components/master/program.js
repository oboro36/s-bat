import { Divider, Typography, Button, Row, Col, message, Table, Input, Icon, Card, Popconfirm, Modal, Form, Select } from 'antd'
const { Option } = Select;
const { Title } = Typography;
import moment from 'moment'

//custom lib
import { invokeApi } from '../../utils/axios'

const openMessage = (type, desc) => {
    message[type](desc, 4);
};

class ProgramTable extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            orientation: 'pc',
            loading: true,
            searchText: '',
            searchedColumn: '',
            dataSource: [],
            submitLoading: false,
            modalVisible: false,
            modalMode: 'add',
            dropdownList: {
                sites: null,
            },
        }
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._isMounted == true) {
            this.getProgramMasterData()
        }
    }

    getProgramMasterData = () => {
        this.setState({
            loading: true
        })

        invokeApi('post', '/api/getMasterProgram', null,
            (res) => {
                //console.log(res.data)
                this.setState({
                    dropdownList: {
                        sites: res.data.sites,
                    },
                    dataSource: res.data.programs,
                    loading: false
                })
            },
            (err) => {
                // //console.log(err)
                alert(err)
                this.setState({
                    loading: false
                })
            }
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => text,
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    doDelete = record => {
        console.log("DO DELETE")
    }

    //Modal 

    showModal = (record = null) => elem => {
        let mode = elem.target.getAttribute('mode')

        if (mode == 'edit') {
            // console.log(record)
            this.props.form.setFieldsValue({
                site: record.SITE,
                program: record.PROGRAM,
                programno: record.PROGRAM_NO
            });
        } else {
            this.props.form.setFieldsValue({
                site: 'SHDI',
                program: '',
                programno: '',
            });
        }

        this.setState({ modalMode: mode }, () => {
            this.setState({
                modalVisible: true,
            });
        })
    };

    handleOk = () => {

        let isValid = true

        this.props.form.validateFields((err, values) => {
            if(err){
                isValid = false
            }
        });

        if(!isValid){
            return
        }

        this.setState({ submitLoading: true });

        let url = this.state.modalMode == 'edit' ? 'updateMasterProgram' : 'insertMasterProgram'
        let sendData = {
            SITE: this.props.form.getFieldValue('site'),
            PROGRAM: this.props.form.getFieldValue('program'),
            PROGRAM_NO: this.props.form.getFieldValue('programno'),
        }
        // console.log(data)
        invokeApi('post', '/api/' + url, {
            data: sendData
        },
            (res) => {
                console.log(res)

                if (res.data.result == true) {
                    openMessage('success', 'Program ' + (this.state.modalMode == 'edit' ? 'edited' : 'added') + ' successfully')
                    this.getProgramMasterData()
                }

                this.setState({ submitLoading: false, modalVisible: false });
            },
            (err) => {
                // //console.log(err)
                alert(err)

                this.setState({ submitLoading: false });
            }
        )

    };

    handleCancel = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { modalVisible, submitLoading } = this.state;
        const columns = [
            {
                title: 'Site',
                dataIndex: 'SITE',
                key: 'SITE',
                width: '30%',
                ...this.getColumnSearchProps('SITE'),
            },
            {
                title: 'Program',
                dataIndex: 'PROGRAM',
                key: 'PROGRAM',
                width: '20%',
                ...this.getColumnSearchProps('PROGRAM'),
            },
            {
                title: 'Action',
                key: 'operation',
                render: (text, record) => {

                    let handleDelete = () => {
                        console.log(record)
                    }

                    let message = "Are you sure to delete " + record.PROGRAM + "?"

                    return (
                        <p>
                            <Button mode="edit" onClick={this.showModal(record)}>Edit</Button>&nbsp;
                            <Popconfirm title={message} onConfirm={handleDelete} disabled={true}><Button disabled={true}>Delete</Button>
                            </Popconfirm>
                        </p>)
                },
            },
        ];

        return (
            <React.Fragment>
                <Card>
                    <Row>
                        <Title level={3}>Program Master</Title>
                        <Divider />
                        <Button type="primary" mode="add" onClick={this.showModal()}>Add</Button>
                    </Row>
                    <br></br>
                    <Row>
                        <Table size="middle" loading={this.state.loading} columns={columns} dataSource={this.state.dataSource} />
                    </Row>
                </Card>
                <Modal
                    visible={modalVisible}
                    title={this.state.modalMode == 'edit' ? 'Edit Program' : "Add Program"}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" loading={submitLoading} onClick={this.handleOk}>
                            Submit
                        </Button>,
                    ]}>
                    <Form layout="vertical">
                        <Form.Item label="Site">
                            {getFieldDecorator('site', {
                                rules: [{ required: true, message: 'Please select your site!' }],
                            })(
                                <Select
                                    placeholder="Select your site"
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
                                rules: [{ required: true, message: 'Please input the program name' }],
                            })(<Input placeholder="Select your program" />)}
                        </Form.Item>
                        <Form.Item label="ProgramNo" hidden>
                            {getFieldDecorator('programno')(<Input />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

const WrappedProgramTable = Form.create({ name: 'program_table' })(ProgramTable)

export default WrappedProgramTable