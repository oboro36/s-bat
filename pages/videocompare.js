import { Row, Col, Button } from 'antd'

import VideoSearch from '../components/video/videosearch'
import { observer } from 'mobx-react'

class VideoComparison extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        return (
            <div>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <VideoSearch customTitle="Video Inquiry" store={this.props.store}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default observer(VideoComparison)