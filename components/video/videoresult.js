import { List, Switch, Select, Divider } from 'antd';

const { Option } = Select;

import VideoCard from '../../components/video/videocard'
import VisibilitySensor from "react-visibility-sensor";
// import Swiper from 'swiper';
// import 'swiper/css/swiper.min.css';

let uniqueId = 0

class VideoResult extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            paginationToggle: false,
            itemPerPage: 10,
        }
    }

    componentDidMount() {
        // if (this.isMobileDevice()) {
        //     this.setState({ itemPerPage: 15 })
        // }
    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    switchPagination = (checked) => {
        this.setState({ paginationToggle: !this.state.paginationToggle })
    }

    perPageChange = (current, value) => {
        this.setState({ itemPerPage: value })
    }

    render() {
        return (
            <React.Fragment>
                <List
                    header={
                        <div>
                            <span style={{ fontSize: '20px', fontWeight: '600' }}>Result</span><Divider type="vertical" />
                            Checkd Item:&nbsp;<span
                                id="checkedItem"
                                style={{
                                    color: 'green '
                                }}
                                ref={checkedCount => {
                                    this.checkedItem = checkedCount;
                                }}
                            >0</span><Divider type="vertical" />
                            Pagination:&nbsp;<Switch onChange={this.switchPagination} />
                            {/* Items/Page:&nbsp;
                            <Select defaultValue="10" style={{ width: 120 }} onChange={this.perPageChange}>
                                <Option value="5">5</Option>
                                <Option value="10">10</Option>
                                <Option value="15">15</Option>
                            </Select> */}
                        </div>
                    }
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
                    pagination={this.state.paginationToggle ?
                        {
                            position: 'top',
                            hideOnSinglePage: true,
                            pageSize: this.state.itemPerPage,
                            pageSizeOptions: ['5', '10', '15'],
                            showSizeChanger: true,
                            onShowSizeChange: this.perPageChange
                        } : null
                    }
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
                                checkedCount={this.checkedItem}
                            />
                        </List.Item>
                        //     }
                        // </VisibilitySensor>
                    )}
                >
                </List>
            </React.Fragment >
        )
    }
}

export default VideoResult