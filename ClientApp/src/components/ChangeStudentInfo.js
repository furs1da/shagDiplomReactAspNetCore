﻿import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { authenticationService } from '../services';
import { userService } from '../services';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);

class ChangePupil extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [], 
            student: '',
            dateOfBirthStudentTemp: new Date(),
            classCode: '',
            showPassword: false,
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllInfoPupil(this.props.location.state.idStudentList).then(student => this.setState({
            student: student,
            dateOfBirthStudentTemp: new Date(student.dateOfBirth),
        })); 
        userService.GetClassCodeStudent(this.props.location.state.idStudentList).then(classCode => this.setState({ classCode }));
    }

    DeleteRecordConfirmed(setFieldValue, values) {
        userService.DeleteRecordStudentAdmin(this.props.location.state.idStudentList, values.adminCode).then(response => {
            console.log(response)
            setFieldValue("messageServer", response)
            if (response === "Доступ дозволений!") {
                this.props.history.push({
                    pathname: '/listOfStudents',
                });
            }
        });
    }
    ReturnRecord(setFieldValue) {
        userService.GetAllGenders().then(genders => this.setState({ genders })).catch(error => this.setState({ error }));
        userService.GetAllInfoPupil(this.props.location.state.idStudentList).then(student => this.setState({
            student: student,
            dateOfBirthAdminTemp: new Date(student.dateOfBirth),
        })).catch(error => this.setState({ error }));
        userService.GetClassCodeStudent(this.props.location.state.idStudentList).then(classCode => this.setState({ classCode })).catch(error => this.setState({ error }));


        setFieldValue("namePupil", this.state.student.name)
        setFieldValue("patronymicPupil", this.state.student.patronymic)
        setFieldValue("surnamePupil", this.state.student.surname)
        setFieldValue("emailPupil", this.state.student.email)
        setFieldValue("passwordPupil", this.state.student.password)
        setFieldValue("confirmPasswordPupil", this.state.student.password)
        setFieldValue("dateOfBirthPupil", this.state.dateOfBirthStudentTemp)
        setFieldValue("genderPupil", this.state.student.gender)
        setFieldValue("motoPupil", this.state.student.moto)
        setFieldValue("phonePupil", this.state.student.phone)
        setFieldValue("adressPupil", this.state.student.adress)
        setFieldValue("classCode", this.state.classCode)
    }
    DeleteRecord(setFieldValue, values) {
        confirmAlert({
            title: "Підтвердіть дію",
            message: "Ви впевнені, що хочете видалити цей обліковий запис?",
            buttons: [
                {
                    label: "Так",
                    onClick: () => { this.DeleteRecordConfirmed(setFieldValue, values) }
                },
                {
                    label: "Ні"
                }
            ]
        });
    };
    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));


    render() {
        return (
            <Formik
                initialValues={{
                    namePupil: this.state.student.name,
                    patronymicPupil: this.state.student.patronymic,
                    surnamePupil: this.state.student.surname,
                    emailPupil: this.state.student.email,
                    passwordPupil: this.state.student.password,
                    confirmPasswordPupil: this.state.student.password,
                    dateOfBirthPupil: this.state.dateOfBirthStudentTemp,
                    genderPupil: this.state.student.gender,
                    motoPupil: this.state.student.moto,
                    phonePupil: this.state.student.phone,
                    adressPupil: this.state.student.adress,
                    classCode: this.state.classCode,
                    imageOfPupil: null
                }}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                    namePupil: Yup.string()
                        .required("Ім'я  обов'язкове."),
                    patronymicPupil: Yup.string()
                        .required("По батькові обов'язкове."),
                    surnamePupil: Yup.string()
                        .required("Прізвище обов'язкове."),
                    emailPupil: Yup.string()
                        .email('Неправильний формат пошти.')
                        .required("Пошта обов'язкова."),
                    passwordPupil: Yup.string()
                        .min(6, 'Пароль повинен містити хоча б 6 символів!')
                        .required("Пароль обов'язковий"),
                    confirmPasswordPupil: Yup.string()
                        .oneOf([Yup.ref('passwordPupil'), null], 'Паролі не співпадають!')
                        .required('Треба підтвердити пароль!'),
                    phonePupil: Yup.string()
                        .required("Номер телефону обов'язковий"),
                    genderPupil: Yup.string()
                        .required("Оберіть гендер"),
                    adressPupil: Yup.string()
                        .required("Адреса обов'язкова"),
                    classCode: Yup.string()
                        .required('Введіть код класу'),
                    dateOfBirthPupil: Yup.date()
                        .required("Дата народження обов'язкова!"),
                    adminCode: '',
                    messageServer: '',

                })}
                onSubmit={({ namePupil, patronymicPupil, surnamePupil, emailPupil, passwordPupil, dateOfBirthPupil, genderPupil, motoPupil, phonePupil, adressPupil, imageOfPupil, classCode, adminCode }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangePupil(namePupil, patronymicPupil, surnamePupil, emailPupil, passwordPupil, dateOfBirthPupil, genderPupil, motoPupil, phonePupil, adressPupil, imageOfPupil, classCode, this.props.location.state.idStudentList, adminCode)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/listOfStudents',
                                });
                            },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        );
                }}
            >
                {({ errors, status, touched, values, setFieldValue }) => (
                    <Form>
                        <h1>Змінити дані адміністратора</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="namePupil">Ім'я</label>
                                <Field name="namePupil" type="text" className={'form-control' + (errors.namePupil && touched.namePupil ? ' is-invalid' : '')} />
                                <ErrorMessage name="namePupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicPupil">По батькові</label>
                                <Field name="patronymicPupil" type="text" className={'form-control' + (errors.patronymicPupil && touched.patronymicPupil ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicPupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnamePupil">Прізвище</label>
                                <Field name="surnamePupil" type="text" className={'form-control' + (errors.surnamePupil && touched.surnamePupil ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnamePupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthPupil">Дата народження</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfBirthPupil}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthPupil && touched.dateOfBirthPupil ? ' is-invalid' : '')}
                                    name="dateOfBirthPupil"
                                    onChange={date => setFieldValue('dateOfBirthPupil', date)}
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    dropdownMode="select"
                                    locale="uk"
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderPupil">Гендер</label>
                            <Field name="genderPupil" as="select" placeholder="Оберіть гендер..." className={'form-control' + (errors.genderPupil && touched.genderPupil ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailPupil">Електронна пошта</label>
                            <Field name="emailPupil" type="text" className={'form-control' + (errors.emailPupil && touched.emailPupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="emailPupil" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adressPupil">Адреса</label>
                            <Field name="adressPupil" type="text" className={'form-control' + (errors.adressPupil && touched.adressPupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="adressPupil" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="classCode">Введіть інший код класу, якщо хочете перемістити учня в інший клас...</label>
                            <Field name="classCode" type="text" className={'form-control' + (errors.classCode && touched.classCode ? ' is-invalid' : '')} />
                            <ErrorMessage name="classCode" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phonePupil">Номер телефону</label>
                            <Field name="phonePupil" type="text" className={'form-control' + (errors.phonePupil && touched.phonePupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="phonePupil" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="motoPupil">Девіз</label>
                            <Field name="motoPupil" type="text" className={'form-control' + (errors.motoPupil && touched.motoPupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="motoPupil" component="div" className="invalid-feedback" />
                        </div>
                        <div>
                            <h4>Фото учня</h4>
                            <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + this.state.student.imageOfPupil} />
                        </div>
                        <div className="form-group">
                            <label for="imageOfTeacher">Загрузити фото учня, якщо ви хочете змінити фото учня</label>
                            <br/>
                            <input
                                id="imageOfPupil"
                                type="file"
                                name="imageOfPupil"
                                onChange={(event) => {
                                    setFieldValue("imageOfPupil", event.currentTarget.files[0]);
                                }}
                            />
                        </div>
                   
                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordPupil">Пароль</label>
                                <Input name="passwordPupil" type={this.state.showPassword ? 'text' : 'password'} value={values.passwordPupil} className={'form-control' + (errors.passwordPupil && touched.passwordPupil ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('passwordPupil', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="passwordPupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="confirmPasswordPupil">Підтвердити пароль</label>
                                <Input name="confirmPasswordPupil" type={this.state.showPassword ? 'text' : 'password'} value={values.confirmPasswordPupil} className={'form-control' + (errors.confirmPasswordPupil && touched.confirmPasswordPupil ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('confirmPasswordPupil', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="confirmPasswordPupil" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="adminCode">Код доступу</label>
                            <Field name="adminCode" type="text" className={'form-control' + (errors.adminCode && touched.adminCode ? ' is-invalid' : '')} />
                            <ErrorMessage name="adminCode" component="div" className="invalid-feedback" />
                        </div>        
                        <div class="row" >
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Змінити  обліковий запис адміністратора</button> </div>

                            <div class="col" class="pull-left">   <button type="button" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }} onClick={selectValue => this.ReturnRecord(setFieldValue)}>Повернути попередні дані</button> </div>

                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em", marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord(setFieldValue, values)}>
                                <Button.Content visible>Видалити обліковий запис</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='trash' />
                                </Button.Content>
                            </Button>
                            </div></div>

                        {values.messageServer &&
                            <div className={'alert alert-danger'}>{values.messageServer}</div>
                        }
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { ChangePupil }; 