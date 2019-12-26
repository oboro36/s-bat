import { Layout, Menu, Icon, Avatar, Modal, Button, Tooltip, Row, Col } from 'antd';
import Router from 'next/router'
import Link from 'next/link'
const { Sider } = Layout;
const { SubMenu } = Menu;

class SideBar extends React.Component {

    constructor(props) {
        super(props)
        this.style = {
            backgroundColor: '#f0f2f5',
            display: 'flex',
            height: '100%',
            columnGap: '5px',
            justifyContent: 'space-around',
            alignItems: 'center',
            margin: '10px 10px 10px 10px',
            padding: '5px',
            borderRadius: '5px',
        }
    }

    state = {
        //Modal
        ModalText: (() => {
            return 'Nothing'
        })(),
        visible: false,
        confirmLoading: false,
        //Side Bar
        collapsed: false,
        content: 'videoplayer',
        userName: 'Name'
    };

    componentDidMount() {
        // if (this.isMobileDevice()) {
            this.setState({ collapsed: true })
            this.props.doCollapse({ collapsed: true })
        // }
    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            ModalText: 'Setting in process . . . ',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    onCollapse = collapsed => {
        this.setState({ collapsed })
        this.setState({ showUserInfo: !collapsed })
        this.props.doCollapse(collapsed)
    };

    handleMenuClick = (event) => {
        const pageName = event.item.props.name
        this.setContent(pageName)
        Router.push({ pathname: '/' + pageName })
        // Router.push({ pathname: '/' + pageName, query: { name: 'PALM' } })
    }

    setContent = (content) => {
        this.setState({ content: content })
    }

    setLoggedOut = () => {
        return new Promise((resolve, reject) => {
            return reject(false)
        })
    }

    render() {
        return (
            <React.Fragment>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}
                    style={{
                        overflow: 'hidden',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        transition: "all 0s",
                        // backgroundImage: "url('static/bg.png')"
                    }}
                >
                    <div>
                        <div className="logo"><img style={{ margin: ' 10px 0px 10px 0px', position: 'relative', left: '25%', width: '50%' }} src="static/s-bat.svg" /></div>
                        <div>
                            {this.state.collapsed ?
                                <div style={this.style}>
                                    <Tooltip placement="right" title={this.state.userName}>
                                        <Avatar icon="user" />
                                    </Tooltip>
                                </div>
                                :
                                <React.Fragment>
                                    <Row>
                                        <Col span={24}>
                                            <div style={{ color: 'white', fontWeight: "bold", textAlign: "center" }}>S-BAT Analyze</div>
                                        </Col>
                                    </Row>
                                    <div style={this.style}>
                                        <Avatar icon="user" />
                                        <span style={{ fontWeight: 'bold' }}> {this.state.userName} </span>
                                        <Button type="primary" shape="circle" icon="setting" size="default" onClick={this.showModal} />
                                        <Link href="/">
                                            <Button type="danger" shape="circle" icon="logout" size="default" />
                                        </Link>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                        <Menu theme="dark" mode="inline" onClick={this.handleMenuClick} selectable={false}>
                            <Menu.Item key="1" name="videocompare" title="Video Comparison Tool">
                                <Icon type="video-camera" theme="filled" />
                                <span>Video Comparison</span>
                            </Menu.Item>
                            {/* <Menu.Item key="2" name="about">
                                <Icon type="idcard" theme="filled" />
                                <span>About</span>
                            </Menu.Item>
                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
                                        <Icon type="appstore" theme="filled" />
                                        <span>Utility</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="3">Site Data Compare</Menu.Item>
                                <Menu.Item key="4">Transfer File</Menu.Item>
                            </SubMenu> */}
                        </Menu>
                    </div>
                    <Modal
                        title="User Config"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleCancel}
                        style={{ top: '10px' }}
                    >
                        <div>{this.state.ModalText}</div>
                    </Modal>
                </Sider>
            </React.Fragment>
        )
    }
}

SideBar.getInitialProps = async ({ req }) => {
    return { isServer: !!req };
};

export default SideBar