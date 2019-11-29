import React from 'react'
import LoginForm from '../components/login'

import Router from 'next/router'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        Router.push('/login', '/login', { shallow: true });
    }

    render() {
        return (
            <div className="center">
                <style jsx>{`
                .center {
                    height: 100vh;
                    width: 100%;
                    position: relative;
                    // border: 3px solid green; 
                    background-image: url("static/bg.png");
                    background-repeat: repeat;
                }
                .center .loginform {
                    margin: 0;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    -ms-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                }
                `}</style>
                <div className="loginform">
                    <div style={{display: 'flex', justifyContent: 'center'}}><img style={{ margin: ' 10px 0px 35px 0px', width: '25%' }} src="static/s-bat.svg" /></div>
                    <LoginForm />
                </div>
            </div>
        )
    }
}

export default Login