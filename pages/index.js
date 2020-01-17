
import { Card, Divider, Typography, Row, Col, Icon, Button, Statistic } from 'antd'
import React, { useState } from 'react';
const { Title } = Typography

const Index = () => {

  // const [feedback, setFeedback] = useState(0);
  // const [unmerged, setUnmerged] = useState(0);
  // const [toggle, setToggle] = useState('YES');

  return (
    <div>
      <Card style={{ textAlign: 'center' }}>

        <Title>Welcome to S-BAT Analyze application</Title>
        <Divider />
        <Title level={2} type="secondary">Please select menu onthe left side.</Title>
{/* 
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Feedback" value={feedback} prefix={feedback >= 0 ? <Icon type="like" /> : <Icon type="dislike" />} />
          </Col>
          <Col span={12}>
            <Statistic title="Unmerged" value={unmerged} suffix="/ 100" />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Button shape="circle" icon="plus" onClick={() => setFeedback(feedback + 1)} />&nbsp;
            <Button shape="circle" icon="minus" onClick={() => setFeedback(feedback - 1)} />
          </Col>
          <Col span={12}>
            <Button shape="circle" icon="plus" onClick={() => setUnmerged(unmerged + 1)} />&nbsp;
            <Button shape="circle" icon="minus" onClick={() => setUnmerged(unmerged - 1)} />
          </Col>
        </Row> */}

        {/* Result: {toggle} <br />

        <Button onClick={() => setToggle(toggle == 'YES' ? 'NO' : 'YES')}>Test</Button> */}

      </Card>
    </div>
  )

}
export default Index