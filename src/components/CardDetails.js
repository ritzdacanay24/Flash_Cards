import React from 'react';
import axios from 'axios';
import EditDetailsModal from './EditDetails.js';

import {
    Card, CardBody,
    CardTitle, CardSubtitle,
    Button, Progress
} from 'reactstrap';

export default class CardDetails extends React.Component {
    state = {
        details: [],
        startViewDetails: [],
        showResults: false,
        currentIndex: null,
        main: {}
    }

    componentDidMount() {
        let cardIdView = this.props.location.state;

        axios.get('http://localhost:5000/api/collections/' + cardIdView.cardId)
            .then(res => {

                this.setState({
                    main: {
                        id: res.data._id,
                        title: res.data.title
                    }, 
                    details: res.data.cards, 
                    showResults:false
                })
                this.changeCardId(0)
            })
    }

    changeCardId = (startView, type) => {
        if (type != null) {
            type == 'right' ? startView++ : startView--
        }

        for (let i = 0; i < this.state.details.length; i++) {
            if (i === startView) {
                this.setState({
                    startViewDetails: this.state.details[i], 
                    currentIndex: i, 
                    showResults:false
                })
                break;
            }
        }
    }

    viewResults = () => {
        this.setState({ showResults: this.state.showResults = !this.state.showResults });
    }

    calculateProgress = () => {
        return (((this.state.currentIndex + 1) / this.state.details.length) * 100).toFixed(2)
    }

    getProgress = () => {
        return this.state.currentIndex + 1 + ' / ' + this.state.details.length;
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="text-center">{this.calculateProgress()}%</div>
                    <Progress value={this.calculateProgress()} />
                    Progress {this.getProgress()}
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <Card className="p-5 shadow-sm">
                                {!this.state.showResults ?
                                    <CardBody>
                                        <CardTitle><h3>{this.state.startViewDetails.word}</h3></CardTitle>
                                        <Button className="mt-auto" color="danger" onClick={() => this.viewResults()}>See Definition!</Button>
                                        <EditDetailsModal buttonLabel="Edit" details={this.state.startViewDetails} main={this.state.main} />
                                    </CardBody>
                                    :
                                    <CardBody>
                                        <CardSubtitle><h3>{this.state.startViewDetails.definition}</h3></CardSubtitle>
                                        <Button className="mt-auto" color="danger" onClick={() => this.viewResults()}>See Word!</Button>
                                    </CardBody>
                                }
                            </Card>
                            <span className="pointer" onClick={() => this.changeCardId(this.state.currentIndex, 'left')}> Left </span>
                            <span className="pointer" onClick={() => this.changeCardId(this.state.currentIndex, 'right')}> Right </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}