import React from "react";
import './Info-Container.css';

// styles that are specific to the info container
const styles = {
    borderRadius: 10
}

class InfoContainer extends React.Component {
    render() {
        return (
        <div style={{...styles}} className='infoContainer' onClick={this.props.onClose} >
            {this.props.children}
        </div>
        )
    }
}

export default InfoContainer;