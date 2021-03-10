﻿import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { SelectField } from "./SelectField";
import DataTable from "react-data-table-component";
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class WatchFeedbackResponseParent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feedbackList: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllFeedbackParent().then(feedbackList => this.setState({ feedbackList }));
    }

    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetFileTeacherFeedback(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }
    onRedirectToFeedback() {
        this.props.history.push({
            pathname: '/feedbackParent',
        });
    }


    render() {
        return (
            <Formik>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form className="justify-content-md-center" class="container-fluid">
                        <div class="container-fluid">
                            <div class="row">
                                <h1 style={{ marginLeft: -0.5 + "em" }}>Усі вхідні</h1> </div>
                            <hr />
                            {this.state.feedbackList.map(feedbackEntity =>
                                <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                    <div class="card-header">
                                        {feedbackEntity.senderName}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">{feedbackEntity.title}</h5>
                                        <br />
                                        <h6 class="card-subtitle mb-2 text-muted">Дата звернення: {new Date(feedbackEntity.dateOfFeedback).toLocaleDateString()}</h6>
                                        <br />
                                        <h6 class="card-subtitle mb-2 text-muted">Наповнення:</h6>
                                        <p class="card-text">{feedbackEntity.content}</p>
                                        {feedbackEntity.filename !== 'nodata' &&
                                            <Button variant="outline-primary" block onClick={selectValue => this.onDownload(feedbackEntity.idFeedback, feedbackEntity.filename)}> {feedbackEntity.filename} </Button>
                                        }
                                        <br /> <Link to="/feedbackParent" style={{ fontSize: '.9em', marginLeft: '0.5em' }}>Відкрити вкладку спілкування</Link>
                                    </div>
                                </div>
                            )}
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export { WatchFeedbackResponseParent }; 