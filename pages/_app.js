import React from 'react'
import App, { Container } from 'next/app'
import MainLayout from '../components/mainlayout'
import Login from './login'
import ExtPortalPlayer from './ext_portalplayer'

import '../base/antdcustom.css'
import '../base/fixvisual.css'
class MyApp extends App {

    constructor(props) {
        super(props)
    }

    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    isLoggedIn = () => true

    render() {
        const { Component, pageProps } = this.props

        let contents

        if (this.isLoggedIn()) {

            contents = (
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            )

        } else {
            contents = <Login />
        }

        return (
            <React.Fragment>
                {contents}
            </React.Fragment>
        )
    }
}

export default MyApp