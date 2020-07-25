import React from 'react';
import axios from 'axios';
import {
    Card, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';

export default class Cards extends React.Component {
    state = {
        cards: []
    };

    componentDidMount() {
        axios.get('http://localhost:5000/api/collections')
            .then(res => {
                const cards = res.data;
                this.setState({ cards })
            })
    }

    goToCarddetails = (cardId) => {
        this.props.history.push('/CardsDetails', {
            cardId: cardId
        })
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        {this.state.cards.map((person, index) =>
                            <div className="col-lg-4  px-md-5" key={index}>
                                <Card onClick = {()=>this.goToCarddetails(person._id)}>
                                    <CardBody>
                                        <CardTitle>{person.title}</CardTitle>
                                        <CardSubtitle>Total: {person.cards.length}</CardSubtitle>
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}