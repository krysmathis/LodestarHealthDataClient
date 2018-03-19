import React from "react";
import './Info-Container.css';



class InfoContainer extends React.Component {
    
    render() {
        return (
        <div className={this.props.containerClass} onClick={this.props.onClose} >
            {this.props.children}
        </div>
        )
    }
}

export default InfoContainer;