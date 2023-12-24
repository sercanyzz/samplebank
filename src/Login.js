import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import windowSize from 'react-window-size';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { CircularProgress } from '@material-ui/core';
import UUID from 'uuid/v4';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFF'
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    forgotPassword: {
        color: '#236cbb',
    },
    description: {
        fontStyle: 'italic',
        fontSize: 22,
        color: '#154280',
    },
    button: {
        height: 60,
        width: 170,
        background: 'linear-gradient(90deg, #236cbb 0%, #154280 100%)',
    },
    textFieldLabel: {
        fontWeight: 'bold',
        fontSize: 21,
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: "bold"
    },
    logo: {
        marginBottom: 24,
        flex: 1
    },
    languageDesc: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#48555D',
        minWidth: 160,
        paddingLeft: 16,
        flex: 1,
        marginBottom: 24,
    },
    textField: {
        primary: '#3e3e',
        border: '1px solid #1542'
    },
    wrapper: {
        position: 'relative',
    },
    buttonProgress: {
        color: "#fff",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
};

class Login extends React.Component {
    state = {
        password: "Password@123",
        showPassword: false,
        loading: false,
        page: "login",
        smsCode: "",
        session: null,
        clientId: null,
        user: "42566277871",
        expirationDate: null,
        token: null
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams) {
            let redirecturi = searchParams.get("redirectUrl");
            let session = searchParams.get("session");
            let clientId = searchParams.get("clientId");
            let bLclientId = searchParams.get("bLclientId");
            let bLclientSecret = searchParams.get("bLclientSecret");
            let bLScopes = searchParams.get("bLScopes");

            this.setState({
                redirecturi,
                session,
                clientId,
                bLclientId,
                bLclientSecret,
                bLScopes
            })
        }
    }

    handleUserChange = (e) => {
        this.setState({ user: e.target.value });
    };

    handleSmsCodeChange = (e) => {
        this.setState({ smsCode: e.target.value });
    };

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    };

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    smsOTPHandle = () => {
        if (!this.state.smsCode || ((this.state.smsCode.trim().length === 0))) {
            this.setState({
                smsOTPError: "Please fill empty field"
            })
        }
        else {
            this.setState({
                smsOTPError: null
            })
            this.setState({ loading: true });
            setTimeout(() => {
                this.setState({ loading: false, });
                var expirationDate = new Date().getTime()
                var token = UUID();

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("grant_type", "client_credentials");
                urlencoded.append("client_id", this.state.bLclientId);
                urlencoded.append("client_secret", this.state.bLclientSecret);
                urlencoded.append("scope", this.state.bLScopes);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                console.log("this.state.redirecturi: ", this.state.redirecturi)

                var newUri = this.state.redirecturi.split("/")[0] + "//" + this.state.redirecturi.split("/")[2]

                console.log("newUri: ", newUri)

                var url = this.state.redirecturi + "?session=" + this.state.session
                    + "&user=" + this.state.user + "&clientId=" + this.state.clientId
                    + "&token=" + token + "&expirationDate=" + expirationDate

                fetch(newUri + "/connect/token", requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        var contract = {
                            token: token,
                            session: this.state.session,
                            user: this.state.user,
                            clientId: this.state.clientId
                        }

                        fetch(newUri + "/savetoken", {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + data.access_token
                            },
                            body: JSON.stringify(contract),
                            method: 'POST',
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);

                                window.location.replace(url)

                            }).catch(err => {
                                console.log("save token error", err);
                            });

                    }).catch(err => {
                        console.log("access token error", err);
                    });
            }, 1000);
        }
    }

    loginHandle = () => {

        if (!this.state.user || (this.state.user.trim().length === 0)) {
            this.setState({
                userError: "Please fill empty field"
            })
        }
        else {
            this.setState({
                userError: null
            })
        }

        if (!this.state.password || (this.state.password.trim().length === 0)) {
            this.setState({
                passwordError: "Please fill empty field"
            })
        }
        else {
            this.setState({
                passwordError: null
            })
        }

        if ((this.state.password && this.state.password.trim().length > 0) && (this.state.user && this.state.user.trim().length > 0)) {
            this.setState({ loading: true });
            setTimeout(() => {
                this.setState({ loading: false, page: "SmsOauth" })
            }, 1000);
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="row" style={{ margin: 0, width: '100%', height: this.props.windowWidth > 768 ? 'calc(100vh)' : null, background: this.props.windowWidth > 768 ? 'url(' + require('./login-ad.jpg') + ')' : null, backgroundSize: this.props.windowWidth > 768 ? 'cover' : null, backgroundPositionX: this.props.windowWidth > 768 ? 'right' : null }}>

                <div className={classes.root + " col-12 col-md-8"} style={{ height: this.props.windowWidth < 768 ? 'calc(100vh - 110px)' : null, padding: 32, paddingBottom: 0, background: 'url(' + require('./login-bg.svg') + ')', backgroundSize: 'cover', backgroundPositionX: 'right' }}>

                    <div className={classes.logoContainer + " d-none d-md-flex"}>
                        <div className={classes.logo}>
                            <img src={require('./logo_2.png')} alt="" style={{ maxWidth: 400 }} />
                        </div>
                        <div className={classes.languageDesc} >
                            Language : <span style={{ color: '#154280' }}>English
                            <ArrowDropDownIcon style={{ fontSize: 24 }}>

                                </ArrowDropDownIcon>
                            </span>
                        </div>
                    </div>

                    <div className={"d-flex d-md-none"} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div className={classes.logo}>
                            <img src={require('./logo_2.png')} alt="" style={{ maxWidth: 400 }} />
                        </div>
                        <div className={classes.languageDesc} >
                            Selected Language : <span style={{ color: '#154280' }}>English
                            <ArrowDropDownIcon style={{ fontSize: 32 }}>

                                </ArrowDropDownIcon>
                            </span>
                        </div>
                    </div>

                    {
                        this.state.page === "login" ? <div>

                            <div className={"d-none d-md-flex"}>
                                <span className={classes.description}>Welcome to Sample Bank Internet Branch.</span>
                            </div>

                            <div className={"d-flex d-md-none"} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <span className={classes.description}>Welcome to Sample Bank Internet Branch.</span>
                            </div>
                        </div> : null
                    }



                    <div>
                        {this.state.page === "login" ?

                            <div style={{ maxWidth: this.props.windowWidth > 768 ? 370 : null }}>
                                <div style={{ marginTop: 10 }}>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label={<span className={classes.textFieldLabel}>Customer No / Identification No</span>}
                                        value={this.state.user}
                                        onChange={this.handleUserChange}
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={this.state.userError ? true : false}
                                        helperText={this.state.userError}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        id="filled-adornment-password"
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        fullWidth
                                        label={<span className={classes.textFieldLabel}>Password</span>}
                                        value={this.state.password}
                                        onChange={this.handlePasswordChange}
                                        margin="normal"
                                        variant="outlined"
                                        endAdornment={
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={this.handleClickShowPassword}
                                                onMouseDown={this.handleMouseDownPassword}
                                            >
                                                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        }
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={this.state.passwordError ? true : false}
                                        helperText={this.state.passwordError}
                                    />
                                </div>
                                <div style={{ marginTop: 10 }}>
                                    <span className={classes.forgotPassword} style={{ fontSize: 14, fontWeight: 'bold' }}>Forgot Password</span>
                                </div>

                                <div style={{ marginTop: 16 }}>

                                    <Button size="large" variant="contained" color="primary"
                                        classes={{
                                            root: classes.button,
                                            label: classes.buttonLabel
                                        }}
                                        onClick={this.loginHandle}
                                    >
                                        {this.state.loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : "Continue"}
                                    </Button>

                                </div>
                            </div>
                            :
                            <div style={{ maxWidth: this.props.windowWidth > 768 ? 370 : null }}>
                                <div style={{ marginTop: 20, marginBottom: 20, color: '#154280' }}>
                                    <span>Enter the SMS code sent to your phone.</span>
                                </div>
                                <div>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label={<span className={classes.textFieldLabel}>SMS Code</span>}
                                        value={this.state.smsCode}
                                        onChange={this.handleSmsCodeChange}
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={this.state.smsOTPError ? true : false}
                                        helperText={this.state.smsOTPError}
                                    />
                                </div>

                                <div style={{ marginTop: 24 }}>
                                    <Button size="large" variant="contained" color="primary"
                                        classes={{
                                            root: classes.button,
                                            label: classes.buttonLabel
                                        }}
                                        onClick={this.smsOTPHandle}
                                    >
                                        {this.state.loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : "Continue"}
                                    </Button>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="d-none d-md-flex" style={{ display: "flex", flexDirection: "column", position: "absolute", left: 30, bottom: 10 }}>
                        <div style={{ display: "flex", flexDirection: "row", marginTop: 16, fontSize: 12 }}>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 14 }} className="col-xs-12">
                            Copyright © {new Date().getUTCFullYear()} Sample Bank.
                        </div>
                    </div>

                </div>
                <div className="col-12 col-md-4" >
                    <div className="d-flex d-md-none" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                        <div style={{ display: "flex", flexDirection: "row", marginTop: 16, fontSize: 12 }}>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 14 }} className="col-xs-12">
                            Copyright © 2020 Sample Bank.
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

//make this component available to the app
export default windowSize(withStyles(styles)(Login));
