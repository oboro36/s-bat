import { Row, Col, Button } from 'antd'

import VideoSearch from '../components/video/videosearch'

class VideoComparison extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        console.log(this.props)
    }

    render() {

        return (
            <div>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <VideoSearch customTitle="Video Inquiry" appState={this.props.appState} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default VideoComparison