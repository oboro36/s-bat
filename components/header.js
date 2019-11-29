import Link from 'next/link'
import { Row, Col, Avatar, Button, Breadcrumb } from 'antd';

const baseStyle = {
  backgroundColor: '#f0f2f5',
  boxShadow: "1px 1px 6px #9E9E9E",
  padding: "10px 10px 10px 36px"
}

const setStyle = (float) => {
  let style = {
    display: 'flex',
    height: '100%',
    float: float,
    columnGap: '5px',
    justifyContent: 'center',
    alignItems: 'center',
  }
  return style
}


const Header = () => (
  <div style={baseStyle}>
    <Row style={{ display: 'flex' }}>
      <Col span={8}>
        <div style={setStyle('left')}>
          <Breadcrumb style={{ fontWeight: 700 }}>
            <Breadcrumb.Item>Main</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <Col span={8}></Col>
      <Col span={8}>
        <div style={setStyle('right')}>
          <Avatar icon="user" />
          <span> Mr.Palm </span>
          <Button type="primary" shape="circle" icon="setting" size="default" />
          <Link href="/">
            <Button type="danger" shape="circle" icon="logout" size="default" />
          </Link>
        </div>
      </Col>
    </Row>
  </div>
)

export default Header