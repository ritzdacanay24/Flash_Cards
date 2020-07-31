import React from 'react';
import axios from 'axios';
import EditDetailsModal from './EditDetails.js';
import { Button, Popover, PopoverHeader, PopoverBody, Progress } from "reactstrap";
import { NotificationManager } from 'react-notifications';

export default class CardDetails extends React.Component {

    constructor(props) {
        super(props);

        this.quizInfo = {
            isQuiz: false,
            results: [],
            correct: 0,
            currentAnswer: ""
        }

        this.state = {
            details: [],
            startViewDetails: [],
            showResults: false,
            currentIndex: null,
            collectionId: null,
            popoverOpen: false,
            quiz: this.quizInfo
        }

        this.shortCutKeys = this.shortCutKeys.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
    }

    componentDidMount() {
        this.getCollectionById();
        document.addEventListener("keydown", this.shortCutKeys, false);
    }

    togglePopover() {
        this.setState({ popoverOpen: !this.state.popoverOpen })
    }

    getCollectionById = () => {

        axios.get('http://localhost:5000/api/collections/' + this.props.location.state.cardId)
            .then(res => {

                this.setState({
                    collectionId: res.data._id,
                    details: res.data.cards,
                    showResults: false
                })

                this.changeCardId(0, null)

            }, function () {
                alert('Something went wrong')
            })
    }

    changeCardId = (startView, type, showResults = false) => {
        if (type !== null) {
            type === 'right' ? startView++ : startView--
        }

        for (let i = 0; i < this.state.details.length; i++) {
            if (i === startView) {
                this.setState({
                    startViewDetails: this.state.details[i],
                    currentIndex: i,
                    showResults: showResults
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
        if(!this.state.quiz.isQuiz){
            if (event.keyCode === 39) {
                this.changeCardId(this.state.currentIndex, 'right')
            } else if (event.keyCode === 37) {
                this.changeCardId(this.state.currentIndex, 'left')
            } else if (event.keyCode === 0 || event.keyCode === 32) {
                this.viewResults()
            }
        }
    }

    takeQuiz = () => {
        //start quiz

        //start quiz at the beginning.
        this.changeCardId(0, null);

        //set quiz values
        this.setState(prevState => ({
            quiz: { ...prevState.quiz, isQuiz: true },
            showResults: true
        }))
    }

    setAnswerHandler = (e) => {
        //update quiz state.
        let userAnswer = e.target.value
        this.setState(prevState => ({
            quiz: {
                ...prevState.quiz,
                currentAnswer: userAnswer
            }
        }))
    }

    displayQuizResults = (correctAnsert) => {
        let userPercentScore = ( correctAnsert /  this.state.details.length ) * 100  ;
        let userMessage = 'Wheeeee! Awsome job!';
        if(userPercentScore < 50){
            userMessage = 'Need more practice my brother!';
        }else if(userPercentScore < 75){
            userMessage = 'Not too shabby!';
        }
        
        NotificationManager.info(userMessage, ` Your score is ${correctAnsert} of ${this.state.details.length}`);

        //Quiz is complete. Reset quiz values
        this.setState({
            showResults: false, 
            quiz: this.quizInfo
        })

        //quiz is done, lets return to the beginning.
        this.changeCardId(0, null)

    }

    trimAnswers = (string) => {
        return string.toLowerCase().trim();
    }

    submitAnswer = (e) => {
        e.preventDefault()
        
        let currentIndex = this.offsetIndex();
        let correctAnsert = this.state.quiz.correct;

        //check if user input matches word
        if (this.trimAnswers(this.state.startViewDetails.word) === this.trimAnswers(this.state.quiz.currentAnswer)) {

            //if answer is correct, add 1 and set state.
            correctAnsert++;
            this.setState(prevState => ({
                showResults: true,
                quiz: {
                    ...prevState.quiz,
                    correct: correctAnsert,
                    currentAnswer: ""
                }
            }))
            NotificationManager.success('That is correct!', 'Success', 2000);
        } else {
            NotificationManager.warning('Sorry, that is incorrect', 'Incorrect', 2000);
        }

        if(currentIndex === this.state.details.length){
            //No more cards, lets display the results to the user.
            this.displayQuizResults(correctAnsert)
        }else{
            //If the collection of cards has only one, display end results.
            if(this.state.details.length == 1){
                this.displayQuizResults(correctAnsert)
            }else{
                //clear input and move on to the next card.
                document.getElementById("userAnswer").reset();
                this.changeCardId(this.state.currentIndex, 'right', true)
            }
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

                                    {
                                        this.state.quiz.isQuiz && <div> {this.state.quiz.correct} of {this.state.details.length} correct </div>
                                    }

                                    {!this.state.showResults ?

                                        <div class="card-body align-items-center d-flex justify-content-center">
                                            <h1>{this.state.startViewDetails.word}</h1>
                                        </div>

                                        :

                                        <div class="card-body align-items-center d-flex justify-content-center">
                                            <h1>{this.state.startViewDetails.definition}</h1>
                                        </div>
                                    }

                                    {
                                        this.state.quiz.isQuiz ?
                                            <form onSubmit={this.submitAnswer} id="userAnswer">
                                                <div class="btn-group" role="group" aria-label="Basic example">
                                                    <input autoComplete="off" type="text" defaultValue="" name="answerField" className="form-control" autoFocus onChange={this.setAnswerHandler} placeholder="Enter term" />
                                                    <button type="submit" className="btn btn-info" >Submit</button>
                                                </div>
                                            </form> : ''
                                    }

                                    {
                                        !this.state.quiz.isQuiz &&
                                        <div class="card-footer align-items-center d-flex justify-content-center bg-white border-0">

                                            {
                                                !this.state.showResults ? <div class="btn-group" role="group" aria-label="Basic example">
                                                    <Button className="mt-auto" color="danger" onClick={() => this.viewResults()}>See Definition!</Button>
                                                    <EditDetailsModal className="text-right" modalTitle="Edit" buttonLabel="Edit" details={this.state.startViewDetails} collectionId={this.state.collectionId} />
                                                </div> :
                                                    <Button className="mt-auto" color="danger" onClick={() => this.viewResults()}>See Word!</Button>

                                            }
                                            <Button className="mt-auto" color="info" onClick={() => this.takeQuiz()}>Take Quiz!</Button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="float-left">
                                <span className="pointer" onClick={() => this.changeCardId(this.state.currentIndex, 'left')}> &larr; Left </span> &nbsp;&nbsp;
                                <span className="pointer" onClick={() => this.changeCardId(this.state.currentIndex, 'right')}> Right 	&rarr;</span>

                            </div>
                            <Button id="mypopover" type="button" className="float-right">
                                Keyboard Keys
                                </Button>
                            <Popover
                                placement="top"
                                isOpen={this.state.popoverOpen}
                                target="mypopover"
                                toggle={this.togglePopover}
                                st
                            >
                                <PopoverHeader>Keyboard Keys</PopoverHeader>
                                <PopoverBody>
                                    <p>Next <kbd>&rarr;</kbd> </p>
                                    <p>Previous <kbd>&larr;</kbd> </p>
                                    <p>Flip Card <kbd>Spacebar  </kbd> </p>
                                </PopoverBody>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}