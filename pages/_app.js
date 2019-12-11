import React from 'react'
import App, { Container } from 'next/app'
import MainLayout from '../components/mainlayout'
import Login from './login'
import ExtPortalPlayer from './extportalplayer'

import VideoStore from '../store/video'

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

            if (VideoStore.hideMenu == false) {
                contents = (
                    <MainLayout>
                        <Component {...pageProps} store={VideoStore} />
                    </MainLayout>
                )
            } else {
                contents = (
                    <ExtPortalPlayer store={VideoStore} />
                )
            }

        } else {
            contents = <Login />
        }


        return (
            <React.Fragment>
                {contents}
            </React.Fragment >
        )
    }
}

export default MyApp