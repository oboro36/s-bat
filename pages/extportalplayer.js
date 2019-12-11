import { observer } from 'mobx-react'
import { Row, Col } from 'antd'
import VideoPlayer from '../components/video/videoplayer'
@observer
export default class ExtPortalPlayer extends React.Component {
    constructor(props) {
        super(props)
    }

    setNewComponent = () => {
        this.props.store.setContent(
            <div>
                <Row>
                    <Col span={12}>
                        <VideoPlayer seq="1" videoURL={this.props.store.url1} />
                    </Col>
                    <Col span={12}>
                        <VideoPlayer seq="2" videoURL={this.props.store.url2} />
                    </Col>
                </Row>
            </div>
        )
    }

    componentDidMount() {
        this.setNewComponent()
    }

    render() {
        return (
            <div>
                {this.props.store.videoContent}
            </div>
        )
    }
}
