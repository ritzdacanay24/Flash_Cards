import React from 'react';
import axios from 'axios';
import EditDetailsModal from './EditDetails.js';

import {
    Button, Progress
} from 'reactstrap';

export default class CardDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            details: [],
            startViewDetails: [],
            showResults: false,
            currentIndex: null,
            collectionId: null
        }

        this.shortCutKeys = this.shortCutKeys.bind(this);
    }

    componentDidMount() {
        this.getCollectionById();
        document.addEventListener("keydown", this.shortCutKeys, false);
    }

    getCollectionById = () => {

        axios.get('http://localhost:5000/api/collections/' + this.props.location.state.cardId)
            .then(res => {

                this.setState({
                    collectionId: res.data._id,
                    details: res.data.cards,
                    showResults: false
                })

                this.getCurrentIndex();

            }, function () {
                alert('Something went wrong')
            })
    }

    //save current index when page is refreshed.
    getCurrentIndex = () => {
        let isIndexSet = localStorage.getItem('flash_cards');
        if (isIndexSet) {
            this.changeCardId(parseInt(isIndexSet) + 1, true)
        } else {
            this.changeCardId(0)
        }
    }

    changeCardId = (startView, type) => {
        if (type !== null) {
            type === 'right' ? startView++ : startView--
        }

        for (let i = 0; i < this.state.details.length; i++) {
            if (i === startView) {
                localStorage.setItem('flash_cards', i);
                this.setState({
                    startViewDetails: this.state.details[i],
                    currentIndex: i,
                    showResults: false
                })
                break;
            }
        }
    }

    offsetIndex = () => {
        return this.state.currentIndex + 1;
    }

    viewResults = () => {
        this.setState({ showResults: this.state.showResults = !this.state.showResults });
    }

    calculateProgress = () => {
        return (this.offsetIndex() / this.state.details.length * 100).toFixed(2)
    }

    getProgress = () => {
        return this.offsetIndex() + ' / ' + this.state.details.length;
    }

    shortCutKeys(event) {
        if (event.keyCode === 39) {
            this.changeCardId(this.state.currentIndex, 'right')
        } else if (event.keyCode === 37) {
            this.changeCardId(this.state.currentIndex, 'left')
        } else if (event.keyCode == 0 || event.keyCode == 32) {
            this.viewResults()
        }
    }

    render() {
        return (
            <div className="container" >
                <div className="row justify-content-center" >
                    <div className="col-lg-8" >
                        <div className="text-center">{this.calculateProgress()}%</div>
                        <Progress value={this.calculateProgress()} />
                        Progress {this.getProgress()}

                        <br /> <br />

                        <div class="text-center h-100">
                            <div class="text-center my-auto">
                                <div class="card card-block d-flex  shadow p-3 mb-5 bg-white rounded" style={{ height: "calc(75vh - 230px)", overflow: "auto" }}>

                                    {!this.state.showResults ?

                                        <div class="card-body align-items-center d-flex justify-content-center">
                                            <h1>{this.state.startViewDetails.word}</h1>
                                        </div>

                                        :

                                        <div class="card-body align-items-center d-flex justify-content-center">
                                            <h1>{this.state.startViewDetails.definition}</h1>
                                        </div>
                                    }


                                    <div class="card-footer align-items-center d-flex justify-content-center bg-white border-0">
                                        {
                                            !this.state.showResults ? <Button className="mt-auto" color="danger" onClick={() => this.viewResults()}>See Definition!</Button> :
                                            <Button className="mt-auto" color="danger" onClick={() => this.viewResults()}>See Word!</Button>
                                            
                                        }
                                    </div>
                                </div>
                            </div>
                            <span className="pointer" onClick={() => this.changeCardId(this.state.currentIndex, 'left')}> &larr; Left </span> &nbsp;&nbsp;
                            <span className="pointer" onClick={() => this.changeCardId(this.state.currentIndex, 'right')}> Right 	&rarr;</span>
                            <span><EditDetailsModal modalTitle="Edit" buttonLabel="Edit" details={this.state.startViewDetails} collectionId={this.state.collectionId}/></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}