import { Row, Col, } from 'antd'

import VideoSearch from '../components/video/videosearch'

class VideoQuery extends React.Component {
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
                        <VideoSearch customTitle="Video Inquiry" />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default VideoQuery