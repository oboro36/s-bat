
import { Button, Card, Input } from 'antd'
class PortalPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            input: '(blank)'
        }
        this.props.appStore.hideMenu = true
    }

    setInput = (value) => {
        this.setState({ input: value })
    }

    printContent = () => {
        console.log(this.props.appStore.content)
    }

    changeContent = () => {
        this.props.appStore.content = "Fuckkkk !! This is new content"
    }

    render() {
        return (
            <div>
                <Card>
                    {this.props.appStore.content}
                </Card>
                <Input defaultValue={this.state.input} onChange={this.setInput} />
                <Button type="primary" onClick={this.printContent}>Print</Button>
                <Button type="primary" onClick={this.changeContent}>Change</Button>
            </div>
        )
    }
}

export default PortalPlayer