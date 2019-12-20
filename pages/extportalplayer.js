import { Row, Col } from 'antd'
import VideoPlayer from '../components/video/videoplayer'

export default class ExtPortalPlayer extends React.Component {
    constructor(props) {
        super(props)
    }

    static getInitialProps({ query }) {
        return { query }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <VideoPlayer key={1} seq="1" videoURL={this.props.query.url1} title={this.props.query.title1} />
                    </Col>
                    <Col span={12}>
                        <VideoPlayer key={2} seq="2" videoURL={this.props.query.url2} title={this.props.query.title2}/>
                    </Col>
                </Row>
            </div>
        )
    }
}
