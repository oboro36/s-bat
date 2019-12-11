import React from 'react'
import { observable } from 'mobx'
import App, { Container } from 'next/app'
import MainLayout from '../components/mainlayout'
import Login from './login'
import ExtPortalPlayer from './ext_portalplayer'

import '../base/antdcustom.css'
import '../base/fixvisual.css'

class Store {
    hideMenu = false
    content = 'Start content'
    setHideMenu = (input) => {
        // this.appStore.hideMenu = input
    }
    setContent = (input) => {
        // this.appStore.content = input
    }
}
const appStore = new Store()

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
            if (this.appStore.hideMenu == false) {
                contents = (
                    <MainLayout>
                        <Component {...pageProps} appStore={this.appStore} />
                    </MainLayout>
                )
            } else {
                contents = (< ExtPortalPlayer appStore={this.appStore} />)
            }
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