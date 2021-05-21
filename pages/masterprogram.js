import { Row, Col, Button, Table } from 'antd'

import ProgramTable from '../components/master/program'
import { observer } from 'mobx-react'

class MasterProgram extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }

    render() {

        return (
            <div>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <ProgramTable store={this.props.store}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default observer(MasterProgram)