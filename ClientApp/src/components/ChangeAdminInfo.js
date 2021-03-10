﻿import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);


class ChangeAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            admin: '',
            dateOfBirthAdminTemp: new Date(),
            showPassword: false,
            error: '',

        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllInfoAdmin(this.props.location.state.idAdminList).then(admin => this.setState({
            admin: admin,
            dateOfBirthAdminTemp: new Date(admin.dateOfBirth),
        }));
    }

    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));

    DeleteRecordConfirmed(setFieldValue, values) {
        userService.DeleteRecordAdminAdmin(this.props.location.state.idAdminList, values.adminCode).then(response => {
            setFieldValue("messageServer", response)
            if (response === "Доступ дозволений!") {
                this.props.history.push({
                    pathname: '/listOfAdmins',
                });
            }
        }).catch(error => this.setState({ error }));
    }
    ReturnRecord(setFieldValue) {
        userService.GetAllGenders().then(genders => this.setState({ genders })).catch(error => this.setState({ error }));
        userService.GetAllInfoAdmin(this.props.location.state.idAdminList).then(admin => this.setState({
            admin: admin,
            dateOfBirthAdminTemp: new Date(admin.dateOfBirth),
        })).catch(error => this.setState({ error }));
        setFieldValue("patronymicAdmin", this.state.admin.name)
        setFieldValue("patronymicAdmin", this.state.admin.patronymic)
        setFieldValue("surnameAdmin", this.state.admin.surname)
        setFieldValue("emailAdmin", this.state.admin.email)
        setFieldValue("passwordAdmin", this.state.admin.password)
        setFieldValue("confirmPasswordAdmin", this.state.admin.password)
        setFieldValue("dateOfBirthAdmin", this.state.dateOfBirthAdminTemp)
        setFieldValue("genderAdmin", this.state.admin.gender)
        setFieldValue("phoneAdmin", this.state.admin.phone)
        setFieldValue("descriptionAdmin", this.state.admin.adress)
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





    render() {
        return (
            <Formik
                initialValues={{
                    nameAdmin: this.state.admin.name,
                    patronymicAdmin: this.state.admin.patronymic,
                    surnameAdmin: this.state.admin.surname,
                    emailAdmin: this.state.admin.email,
                    passwordAdmin: this.state.admin.password,
                    confirmPasswordAdmin: this.state.admin.password,
                    dateOfBirthAdmin: this.state.dateOfBirthAdminTemp,
                    genderAdmin: this.state.admin.gender,
                    phoneAdmin: this.state.admin.phone,
                    descriptionAdmin: this.state.admin.description,
                    adminCode: '',
                    messageServer: ''
                }}

                validationSchema={Yup.object().shape({
                    nameAdmin: Yup.string()
                        .required("Ім'я  обов'язкове."),
                    patronymicAdmin: Yup.string()
                        .required("По батькові обов'язкове."),
                    surnameAdmin: Yup.string()
                        .required("Прізвище обов'язкове."),
                    emailAdmin: Yup.string()
                        .email('Неправильний формат пошти.')
                        .required("Пошта обов'язкова."),
                    passwordAdmin: Yup.string()
                        .min(6, 'Пароль повинен містити хоча б 6 символів!')
                        .required("Пароль обов'язковий."),
                    confirmPasswordAdmin: Yup.string()
                        .oneOf([Yup.ref('passwordAdmin'), null], 'Паролі не співпадають!')
                        .required('Треба підтвердити пароль!'),
                    dateOfBirthAdmin: Yup.date()
                        .required("Дата народження обов'язкова!"),
                    genderAdmin: Yup.string()
                        .required('Оберіть гендер!'),
                    phoneAdmin: Yup.string()
                        .required("Номер телефону обов'язковий!"),
                    descriptionAdmin: Yup.string()
                        .required('Треба написати коротке резюме про адміністратора'),
                    adminCode: Yup.string()
                        .required('Введіть спеціальний код для створення облікового запису админістратора')
                })}
                enableReinitialize
                onSubmit={({ nameAdmin, patronymicAdmin, surnameAdmin, emailAdmin, passwordAdmin, dateOfBirthAdmin, genderAdmin, phoneAdmin, descriptionAdmin, adminCode }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangeAdmin(nameAdmin, patronymicAdmin, surnameAdmin, emailAdmin, passwordAdmin, dateOfBirthAdmin, genderAdmin, phoneAdmin, descriptionAdmin, adminCode)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/listOfAdmins',
                                });
                            },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        );
                }}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Змінити дані адміністратора</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameAdmin">Ім'я</label>
                                <Field name="nameAdmin" type="text" className={'form-control' + (errors.nameAdmin && touched.nameAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicAdmin">По батькові</label>
                                <Field name="patronymicAdmin" type="text" className={'form-control' + (errors.patronymicAdmin && touched.patronymicAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameAdmin">Прізвище</label>
                                <Field name="surnameAdmin" type="text" className={'form-control' + (errors.surnameAdmin && touched.surnameAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthAdmin">Дата народження</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfBirthAdmin}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthAdmin && touched.dateOfBirthAdmin ? ' is-invalid' : '')}
                                    name="dateOfBirthAdmin"
                                    onChange={date => setFieldValue('dateOfBirthAdmin', date)}
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    dropdownMode="select"
                                    locale="uk"
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderAdmin">Гендер</label>
                            <Field name="genderAdmin" as="select" placeholder="Оберіть гендер..." className={'form-control' + (errors.genderAdmin && touched.genderAdmin ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailAdmin">Електронна пошта</label>
                            <Field name="emailAdmin" type="text" className={'form-control' + (errors.emailAdmin && touched.emailAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="emailAdmin" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneAdmin">Номер телефону</label>
                            <Field name="phoneAdmin" type="text" className={'form-control' + (errors.phoneAdmin && touched.phoneAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="phoneAdmin" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descriptionAdmin">Коротке резюме</label>
                            <Field name="descriptionAdmin" type="text" className={'form-control' + (errors.descriptionAdmin && touched.descriptionAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="descriptionAdmin" component="div" className="invalid-feedback" />
                        </div>


                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordAdmin">Пароль</label>
                                <Input name="passwordAdmin" type={this.state.showPassword ? 'text' : 'password'} value={values.passwordAdmin} className={'form-control' + (errors.passwordAdmin && touched.passwordAdmin ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('passwordAdmin', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="passwordAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="confirmPasswordAdmin">Підтвердити пароль</label>
                                <Input name="confirmPasswordAdmin" type={this.state.showPassword ? 'text' : 'password'} value={values.confirmPasswordAdmin} className={'form-control' + (errors.confirmPasswordAdmin && touched.confirmPasswordAdmin ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('confirmPasswordAdmin', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="confirmPasswordAdmin" component="div" className="invalid-feedback" />
                            </div>

                        </div>


                        <div className="form-group">
                            <label htmlFor="adminCode">Код доступу</label>
                            <Field name="adminCode" type="text" className={'form-control' + (errors.adminCode && touched.adminCode ? ' is-invalid' : '')} />
                            <ErrorMessage name="adminCode" component="div" className="invalid-feedback" />
                        </div>

                        <div class="row" >
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Змінити  обліковий запис адміністратора</button> </div>

                            <div class="col" class="pull-left">  <button type="reset" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }}>Повернути попередні дані</button> </div>

                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em", marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord(setFieldValue, values)}>
                                <Button.Content visible>Видалити оголошення</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='trash' />
                                </Button.Content>
                            </Button>
                            </div></div>
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }
                        {values.messageServer &&
                            <div className={'alert alert-danger'}>{values.messageServer}</div>
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

export { ChangeAdmin }; 