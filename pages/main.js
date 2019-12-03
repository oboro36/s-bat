import { Row, Col, } from 'antd'

import VideoSearch from '../components/video/videosearch'

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
        super(props)
        this.state = {
            // loading: false,
            // tableDataSource: [
            //     {
            //         ID: '01',
            //         UserName: 'Cat',
            //         Content: '-'
            //     },
            //     {
            //         ID: '02',
            //         UserName: 'Dog',
            //         Content: '-'
            //     },
            //     {
            //         ID: '03',
            //         UserName: 'Snake',
            //         Content: '-'
            //     }
            // ],
        }
    }

    // getPerson = () => {
    //     self = this

    //     this.setState({ loading: true })

    //     setTimeout(() => {
    //         invokeApi('post', '/alluser',
    //             (res) => {
    //                 let result = res.data
    //                 self.setState({ tableDataSource: result })
    //                 self.setState({ loading: false })
    //             },
    //             (err) => {
    //                 alert(err)
    //                 self.setState({ loading: false })
    //             }
    //         )
    //     }, 2000);
    // }

    render() {
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
                        <VideoSearch customTitle="CHOICE1"/>
                    </Col>
                    <Col span={12}>
                        <VideoSearch customTitle="CHOICE2"/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Main