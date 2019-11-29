import React from 'react'
import App, { Container } from 'next/app'
import "react-datepicker/dist/react-datepicker.css";
import MainLayout from '../components/mainlayout'
import Login from './login'

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
        return (
            <React.Fragment>
                {
                    this.isLoggedIn() ? (
                        <MainLayout>
                            <Component {...pageProps} />
                        </MainLayout>
                    ) : (
                            <Login />
                        )
                }
            </React.Fragment>
        )
    }
}

export default MyApp