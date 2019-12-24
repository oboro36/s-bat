
import { Card, Divider, Typography } from 'antd'

const { Title } = Typography

const Index = () => (
  <div>
    <Card style={{ textAlign: 'center' }}>

      <Title>Welcome to S-BAT Analyze application</Title>
      <Divider />
      <Title level={2} type="secondary">Please select menu onthe left side.</Title>

    </Card>
  </div>
)

export default Index