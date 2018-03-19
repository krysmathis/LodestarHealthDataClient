import React from "react";
import './Info-Container.css';



class InfoContainer extends React.Component {
    
    render() {
        return (
        <div className={this.props.containerClass} >
            {this.props.children}
        </div>
        )
    }
}

export default InfoContainer;