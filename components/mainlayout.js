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
      }
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

  render() {
    return (
      <React.Fragment>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar doCollapse={this.setCollapse} />
          <Layout style={this.state.initStyle}>
            {/* <Header /> */}
            <Content style={{ margin: '12px 12px' }}>
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