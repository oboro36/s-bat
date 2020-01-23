import { Layout } from 'antd';
import Header from './header'
import Footer from './footer'
import Sidebar from './sidebar'

const { Content } = Layout;

class MainLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sideCollapse: false,
      content: '',
      initStyle: {
        // transition: "all 0.3s",
        backgroundImage: 'url("static/content-bg.png")',
        marginLeft: this.props.isPlayer ? 0 : 80
      },
      hideMenu: this.props.isPlayer ? true : false,
    }
  }

  componentDidMount() {
    this.setState({ content: this.props.content })
  }

  setCollapse = (sideCollapse) => {
    this.setState({ sideCollapse })
    this.checkCollapse()
  }

  checkCollapse = () => {
    if (!this.state.sideCollapse) {
      this.setState(prevState => ({
        initStyle: { ...prevState.initStyle, marginLeft: 80 }
      }))
    } else {
      this.setState(prevState => ({
        initStyle: { ...prevState.initStyle, marginLeft: 200 }
      }))
    }
  }

  getSelectedHeader = (selectedHeader) => {
    return selectedHeader
  }

  render() {
    return (
      <React.Fragment>
        <Layout style={{ minHeight: '100vh' }}>
          {
            this.state.hideMenu == true ? null : <Sidebar doCollapse={this.setCollapse} setSelectedHeader={this.getSelectedHeader} />
          }
          <Layout style={this.state.initStyle}>
            {/* <Header /> */}
            <Content style={{ margin: '12px 12px' }} store={this.props.store}>
              <div style={{ padding: 15, background: '#f0f2f5', border: 'solid 1px #D9D9D9', borderRadius: '7px', minHeight: 360 }}>
                {this.props.children}
              </div>
            </Content>
            {/* <Footer /> */}
          </Layout>
        </Layout >
      </React.Fragment>
    );
  }
}



export default MainLayout