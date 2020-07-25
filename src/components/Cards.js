import React from 'react';
import axios from 'axios';
import {
    Card, CardImg, CardText, CardBody, CardLink,
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
    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        {this.state.cards.map(person =>
                            <div className="col-lg-4">
                                <Card>
                                    <CardBody>
                                        <CardTitle>{person.title}</CardTitle>
                                        <CardSubtitle>Card subtitle</CardSubtitle>
                                    </CardBody>
                                    <img width="100%" src="/assets/318x180.svg" alt="Card image cap" />
                                    <CardBody>
                                        <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                                        <CardLink href="#">Card Link</CardLink>
                                        <CardLink href="#">Another Link</CardLink>
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