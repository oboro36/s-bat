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
        background: "#FFFFFF",
        marginLeft: 200
      },
      thisPath: null
    }
  }

  componentDidMount() {
    this.setState({ content: this.props.content })
    if (window.location.pathname == '/extportalplayer') {
      this.setState({ ...this.state, thisPath: window.location.pathname }, () => {
        this.setState({
          initStyle: {
            ...this.state.initStyle, marginLeft: 0
          }
        })
      })
    }
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
            this.state.thisPath == '/extportalplayer' ? null : <Sidebar doCollapse={this.setCollapse} setSelectedHeader={this.getSelectedHeader} />
          }
          <Layout style={this.state.initStyle}>
            {/* <Header /> */}
            <Content style={{ margin: '12px 12px' }} store={this.props.store}>
              <div style={{ padding: 24, background: '#f0f2f5', minHeight: 360 }}>
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