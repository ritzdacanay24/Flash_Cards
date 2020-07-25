import React from 'react';


export default class CardDetails extends React.Component {
    state = {
        details:[]
    }
    componentDidMount() {
        console.log(this.props.location.state)
    }
    render() {
        return (
            <div>
                Details
            </div>
        )
    }

}