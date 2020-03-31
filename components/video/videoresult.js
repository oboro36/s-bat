import { List, Switch, Select, Divider, Button, Spin } from 'antd';
const { Option } = Select;

import VideoCard from '../../components/video/videocard'
import VisibilitySensor from "react-visibility-sensor";
import PrioritySlider from '../../components/video/priorityslider'
import cookies from '../../utils/cookies'

let uniqueId = 0

class VideoResult extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            paginationToggle: false,
            itemPerPage: 10,
            priorityValue: {
                low: [0, 5],
                mid: [6, 15],
                high: [16, 20]
            },
            spinning: false
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

    catchSliderValue = value => {
        // console.log(value)
        this.setState({ spinning: true }, () => {
            setTimeout(function () {
                this.setState({ priorityValue: value }, () => {
                    this.setState({ spinning: false })
                })
            }.bind(this), 1000)
        })

    }

    render() {

        return (
            <React.Fragment>
                <Spin spinning={this.state.spinning}>
                    <List
                        header={
                            <div>
                                <span style={{ fontSize: '20px', fontWeight: '600' }}>Result</span><Divider type="vertical" />
                                Checked Item:&nbsp;<span
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
                                <Divider type="vertical" />
                                <PrioritySlider priorityValue={this.state.priorityValue} catchSliderValue={this.catchSliderValue} />
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
                                    priorityValue={this.state.priorityValue}
                                />
                            </List.Item>
                            //     }
                            // </VisibilitySensor>
                        )}
                    >
                    </List>
                </Spin>
            </React.Fragment >
        )
    }
}

export default VideoResult