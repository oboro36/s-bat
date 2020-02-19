import { List } from 'antd';

import VideoCard from '../../components/video/videocard'
import VisibilitySensor from "react-visibility-sensor";
// import Swiper from 'swiper';
// import 'swiper/css/swiper.min.css';

let uniqueId = 0

class VideoResult extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            rowPerPage: 30
        }
    }

    componentDidMount() {
        if (this.isMobileDevice()) {
            this.setState({ rowPerPage: 15 })
        }
    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    render() {
        return (
            <React.Fragment>
                <List
                    header={<div>Result</div>}
                    grid={{
                        gutter: 16,
                        column: 1
                    }}
                    dataSource={this.props.listDataSource}
                    loading={this.props.isLoading}
                    rowKey={(record) => {
                        if (!record.__uniqueId)
                            record.__uniqueId = ++uniqueId;
                        return record.__uniqueId;
                    }}
                    // pagination={{
                    //     position: 'top',
                    //     hideOnSinglePage: true,
                    //     pageSize: this.state.rowPerPage
                    // }}
                    renderItem={item => (

                        // <VisibilitySensor partialVisibility={true}>
                        //     {({ isVisible }) =>
                        <List.Item style={{
                            marginTop: '15px',
                            marginBottom: '5px',
                            // visibility: isVisible ? 'visible' : 'hidden'
                        }}>
                            <VideoCard
                                item={item}
                                selectedOutput={this.props.selectedOutput}
                                orientation={this.props.orientation}
                                store={this.props.store}
                            />
                        </List.Item>
                        //     }
                        // </VisibilitySensor>
                    )}
                >
                </List>
            </React.Fragment>
        )
    }
}

export default VideoResult