
import React from 'react'
import ReactDOM from 'react-dom'

class WindowPortal extends React.Component {
    constructor(props) {
        super(props)
        this.containerEl = document.createElement('div');
        this.externalWindow = null;
    }

    copyThings(sourceDoc, targetDoc) {
        // Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        //     if (styleSheet.cssRules) { // for <style> elements
        //         const newStyleEl = sourceDoc.createElement('style');

        //         Array.from(styleSheet.cssRules).forEach(cssRule => {
        //             // write the text of each rule into the body of the style element
        //             newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
        //         });

        //         targetDoc.head.appendChild(newStyleEl);
        //     } else if (styleSheet.href) { // for <link> elements loading CSS from a URL
        //         const newLinkEl = sourceDoc.createElement('link');

        //         newLinkEl.rel = 'stylesheet';
        //         newLinkEl.href = styleSheet.href;
        //         targetDoc.head.appendChild(newLinkEl);
        //     }
        // });
        console.log(sourceDoc)
        
    }

    componentDidMount() {
        this.externalWindow = window.open("http://localhost:3000/ext_portalplayer", '', 'width=600,height=400,left=200,top=200');

        this.copyThings(document, this.externalWindow.document);

        this.externalWindow.document.body.appendChild(this.containerEl);
    }

    componentWillUnmount() {
        this.externalWindow.close();
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.containerEl);
    }
}

export default WindowPortal