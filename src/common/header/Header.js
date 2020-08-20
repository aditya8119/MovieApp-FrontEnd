import React, { Component } from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import logo from '../../assets/logo.svg';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link } from 'react-router-dom';



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            value: 0,
            username: "",
            usernameRequired: "dispNone",
            password: "",
            passwordRequired: "dispNone",
            email: "",
            firstname: "",
            lastname: "",
            mobile: "",
            passwordReg: "",
            emailRequired: "dispNone",
            firstnameRequired: "dispNone",
            lastnameRequired: "dispNone",
            mobileRequired: "dispNone",
            passwordRegRequired: "dispNone",
            registrationSuccess: false,
            loggedIn: sessionStorage.getItem('access-token') == null ? false : true
        };
    }

    openModalHandler = () => {
        this.setState({ modalIsOpen: true })
    }

    closeModalHandler = () => {
        this.setState({ modalIsOpen: false })
    }
    tabChangeHandler = (event, value) => {
        this.setState({ value });
    }

    loginClickHandler = () => {
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });

        if (this.state.username === "" || this.state.password === "") { return }

        let that = this;
        let dataLogin = null

        let xhrLogin = new XMLHttpRequest();
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(xhrLogin.getResponseHeader('access-token'));

                sessionStorage.setItem('uuid', JSON.parse(this.responseText).id);
                sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));

                that.setState({ loggedIn: true });
                that.closeModalHandler();
            }
        })


        xhrLogin.open("POST", this.props.baseUrl + "auth/login");
        xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.password));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);

    }
    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value })
    }

    inputPasswordChangeHandler = (e) => {
        this.setState({ password: e.target.value })
    }


    inputEmailChangeHandler = (e) => {
        this.setState({ email: e.target.value })

    }

    inputFirstnameChangeHandler = (e) => {
        this.setState({ firstname: e.target.value })

    }

    inputLastnameChangeHandler = (e) => {
        this.setState({ lastname: e.target.value })

    }

    inputMobileChangeHandler = (e) => {
        this.setState({ mobile: e.target.value })

    }

    inputPasswordRegChangeHandler = (e) => {
        this.setState({ passwordReg: e.target.value })

    }

    logoutHandler = () => {
        console.log(sessionStorage.getItem('access-token'));
        sessionStorage.removeItem('uuid');
        sessionStorage.removeItem('access-token');
        this.setState({ loggedIn: false })

    }
    registerClickHandler = () => {
        this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
        this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
        this.state.lastname === "" ? this.setState({ lastnameRequired: "dispBlock" }) : this.setState({ lastnameRequired: "dispNone" });
        this.state.mobile === "" ? this.setState({ mobileRequired: "dispBlock" }) : this.setState({ mobileRequired: "dispNone" });
        this.state.passwordReg === "" ? this.setState({ passwordRegRequired: "dispBlock" }) : this.setState({ passwordRegRequired: "dispNone" });
        if (this.state.email === "" || this.state.firstname === "" || this.state.lastname === "" || this.state.mobile === "" || this.state.passwordReg === "") { return; }

        let that = this;
        let dataSignUp = JSON.stringify({
            "email_address": this.state.email,
            "first_name": this.state.firstname,
            "last_name": this.state.lastname,
            "mobile_number": this.state.mobile,
            "password": this.state.passwordReg
        })

        let xhrSignup = new XMLHttpRequest();
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                that.setState({ registrationSuccess: true })
            }
        })

        xhrSignup.open("POST", this.props.baseUrl + "signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send(dataSignUp);

    }



    render() {
        return (
            <div>
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    {!this.state.loggedIn ?
                        <div className="login-button">
                            <Button variant="contained" color="default" onClick={this.openModalHandler}>Login</Button>
                        </div>
                        :
                        <div className="login-button">
                            <Button variant="contained" color="default" onClick={this.logoutHandler}>Logout</Button>
                        </div>}
                    {this.props.showBookShowButton === "true" && !this.state.loggedIn ?
                        <div className="bookshow-button">
                            <Button variant="contained" onClick={this.openModalHandler} color="primary">
                                BOOK SHOW</Button>
                        </div> : ""}
                    {this.props.showBookShowButton === "true" && this.state.loggedIn ?
                        <div className="bookshow-button">
                            <Link to={"/bookshow/" + this.props.id}><Button variant="contained" color="primary">
                                BOOK SHOW</Button></Link>
                        </div> : ""}
                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}>
                    <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                    {this.state.value === 0 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="username"> Username </InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password"> Password </InputLabel>
                                <Input id="password" type="password" onChange={this.inputPasswordChangeHandler} />
                                <FormHelperText className={this.state.passwordRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>}
                    {this.state.value === 1 && <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" onChange={this.inputEmailChangeHandler} />
                            <FormHelperText className={this.state.emailRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" onChange={this.inputFirstnameChangeHandler} />
                            <FormHelperText className={this.state.firstnameRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" onChange={this.inputLastnameChangeHandler} />
                            <FormHelperText className={this.state.lastnameRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="mobile">Mobile Number</InputLabel>
                            <Input id="mobile" onChange={this.inputMobileChangeHandler} />
                            <FormHelperText className={this.state.mobileRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required aria-describedby="name-helper-text">
                            <InputLabel htmlFor="passwordReg">Password</InputLabel>
                            <Input type="password" id="passwordReg" onChange={this.inputPasswordRegChangeHandler} />
                            <FormHelperText className={this.state.passwordRegRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        {this.state.registrationSuccess === true &&
                            <FormControl>
                                <span className="successText"> Registration Successful. Please Login!</span>
                            </FormControl>}<br /><br />
                        <Button variant="contained" color="primary" onClick={this.registerClickHandler}>
                            REGISTER
                        </Button>
                    </TabContainer>}


                </Modal>
            </div>
        )
    }
}

export default Header;
