import { Avatar, Button, Row, Col, Icon } from 'antd';
import Router from 'next/router'
import Link from 'next/link'
import { slide as Menu } from 'react-burger-menu'
import '../base/burger.css'

class BurgerMenu extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMenuOpen: false,
            userName: 'Administrator'
        };
        this.style = {
            backgroundColor: '#f0f2f5',
            display: 'flex',
            height: '100%',
            // columnGap: '5px',
            justifyContent: 'space-around',
            alignItems: 'center',
            margin: '10px 10px 10px 10px',
            padding: '5px',
            borderRadius: '5px',
        }
    }

    componentDidMount() {

    }

    isMobileDevice = () => {
        return navigator.userAgent.toLowerCase().match(/mobile/i)
    }

    goHome = () => {
        this.closeMenu()

        Router.push({ pathname: '/' })
    }

    handleMenuClick = (event) => {
        this.closeMenu()

        const pageName = event.target.id
        Router.push({ pathname: '/' + pageName })

        // Router.push({ pathname: '/' + pageName, query: { name: 'PALM' } })
    }

    closeMenu = () => {
        this.setState({ isMenuOpen: false })
    }

    handleStateChange = (state) => {
        this.setState({ isMenuOpen: state.isOpen })
    }

    render() {
        return (
            <div style={{ position: 'fixed', zIndex: 1, width: '100%', height: '60px', backgroundColor: '#001529' }}>
                <Menu className="hiddenScroll" isOpen={this.state.isMenuOpen} onStateChange={this.handleStateChange}>
                    <div className="logo">
                        <img style={{ position: 'relative', left: '25%', width: '50%' }} src="static/s-bat.svg" />
                    </div>
                    <a id="home" className="menu-item" href="#" onClick={this.goHome}><Icon type="home" /> Home</a>
                    <a id="videocompare" className="menu-item" onClick={this.handleMenuClick} ><Icon type="video-camera" /> Video Compare</a>
                </Menu>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                    <div style={{ width: '10%' }}></div>
                    <div style={{ color: 'white', fontWeight: "bolder", fontSize: '20px' }}>S-BAT Analyze</div>
                    <div>
                        <div style={this.style}>
                            <Avatar icon="user" />&nbsp;
                            <span style={{ fontWeight: 'bold' }}> {this.state.userName} </span>&nbsp;
                            <Button type="primary" shape="circle" icon="setting" size="default" onClick={this.showModal} />&nbsp;
                            <Link href="/">
                                <Button type="danger" shape="circle" icon="logout" size="default" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

BurgerMenu.getInitialProps = async ({ req }) => {
    return { isServer: !!req };
};

export default BurgerMenu