import React from "react";



class InfoContainer extends React.Component {
    render() {
        return (
        <div className="infoContainer" onClick={this.props.onClose} >
            {this.props.children}
        </div>
        )
    }
}

export default InfoContainer;