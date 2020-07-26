import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
import axios from 'axios';

const EditDetailsModal = (props) => {

    let { buttonLabel, className, details, collectionId } = props;
    
    const [modal, setModal] = useState(false);
    const [unmountOnClose] = useState(true);

    const toggle = () => setModal(!modal);

    const save = (props) => {

        let obj = {
            word : details.word,
            definition : props
        }

        axios.put(`http://localhost:5000/api/collections/${collectionId}/cards/${details._id}`, obj )
        .then(res => {
            setModal(false);
        }, function(){
            alert('Something went wrong')
        })

    }

    const handleChange = (event) => {
        details.definition = event.target.value
    }

    return (
        <div>
            <Form inline>
                <Button color="danger" onClick={toggle}>{buttonLabel}</Button>
            </Form>
            <Modal isOpen={modal} toggle={toggle} className={className} unmountOnClose={unmountOnClose}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    <Input type="textarea" id="definition" placeholder="Definition" rows={5}
                        onChange={handleChange} defaultValue={details.definition} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => save(details.definition)}>Save</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default EditDetailsModal;