import { Row, Col } from 'antd'
import VideoPlayer from '../components/video/videoplayer'

export default class ExtPortalPlayer extends React.Component {
    constructor(props) {
        super(props)
    }

    static getInitialProps({ query }) {
        return { query }
    }

    colStyle = {
        flexBasis: "49%",
        width: "100%"
    }

    render() {
        return (
            <div>
                <Row type="flex">
                    <Col span={1} style={{ ...this.colStyle }}>
                        <VideoPlayer key={1} seq="1" videoURL={this.props.query.url1} title={this.props.query.title1} isAutoPlay={true} />
                    </Col>
                    <Col span={1} style={{ width: '2%' }} />
                    <Col span={1} style={{ ...this.colStyle }}>
                        <VideoPlayer key={2} seq="2" videoURL={this.props.query.url2} title={this.props.query.title2} isAutoPlay={true} />
                    </Col>
                </Row>
            </div>
        )
    }
}
