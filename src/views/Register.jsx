import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
// import IconButton from "@material-ui/core/IconButton";
// import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "axios";

// eslint-disable-next-line no-control-regex
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: false,
      registrationStatus: true,
      email: "",
      password: "",
      passwordValidation: "",
      disableTextFields: true,
      snackbar: {
        opened: false,
        message: "",
      },
      doPasswordsMatch: true,
      isPasswordValid: true,
      isEmailValid: true,
    };
  }

  componentDidMount() {
    axios.get("/api/user/registrationStatus").then((res) => {
      this.setState({
        registrationStatus: res.data.registration,
        loading: false,
        disableTextFields: !res.data.registration,
      });
      if (!res.data.registration) {
        this.openSnackBar("Registration is currently disabled!");
      }
    });
  }

  openSnackBar = (message) => {
    this.setState({
      snackbar: {
        opened: true,
        message,
      },
    });
  };

  handleInputChange = (event) => {
    const { value, name } = event.target;
    let { doPasswordsMatch, isEmailValid, isPasswordValid } = this.state;

    const passwordInput = name === "password" ? value : this.state.password;

    const passwordValidationInput =
      name === "passwordValidation" ? value : this.state.passwordValidation;

    const emailInput = name === "email" ? value : this.state.email;

    if (name === "password") {
      isPasswordValid = passwordInput.length > 7;
    }
    if (name === "passwordValidation") {
      doPasswordsMatch = passwordInput === passwordValidationInput;
    }
    if (name === "email") {
      isEmailValid = emailRegex.test(emailInput);
    }

    this.setState({
      [name]: value,
      doPasswordsMatch,
      isEmailValid,
      isPasswordValid,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (
      this.state.email !== "" &&
      this.state.isEmailValid &&
      this.state.passwordValidation !== "" &&
      this.state.doPasswordsMatch
    ) {
      this.setState({
        loading: true,
        error: false,
      });
      this.createAccount();
    }
  };

  createAccount = () => {
    axios
      .post(
        "/api/user/register",
        {
          email: this.state.email,
          password: this.state.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        //this.props.history.push("/login");
        console.log(res.data);
        axios
          .post("/api/user/authenticate", {
            email: this.state.email,
            password: this.state.password,
          })
          .then(() => this.props.history.push("/admin"));
      })
      .catch((err) => {
        console.error(err);
        this.setState({ error: true, loading: false, password: "" });
      });
  };

  handleClose = () => {
    this.setState({ snackbar: { opened: false } });
  };

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            {this.state.loading ? (
              <CircularProgress style={{ color: "white" }} size={30} />
            ) : (
              <LockOutlinedIcon />
            )}
          </Avatar>
          <Typography component="h1" variant="h5">
            Register account
          </Typography>
          <form className={classes.form} noValidate onSubmit={this.onSubmit}>
            <TextField
              disabled={this.state.disableTextFields}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.email}
              onChange={this.handleInputChange}
              error={!this.state.isEmailValid}
              helperText={!this.state.isEmailValid ? "Invalid email" : ""}
            />
            <TextField
              disabled={this.state.disableTextFields}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.password}
              onChange={this.handleInputChange}
              error={!this.state.isPasswordValid}
              helperText={
                !this.state.isPasswordValid
                  ? "Password should be at least 8 characters!"
                  : ""
              }
            />
            <TextField
              disabled={this.state.disableTextFields}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="passwordValidation"
              label="Repeat password"
              type="password"
              id="passwordValidation"
              autoComplete="current-password"
              value={this.state.passwordValidation}
              onChange={this.handleInputChange}
              error={!this.state.doPasswordsMatch}
              helperText={
                !this.state.doPasswordsMatch ? "Passwords don't match!" : ""
              }
            />
            <Button
              disabled={this.state.disableTextFields}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Snackbar
          open={this.state.snackbar.opened}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {this.state.snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Register);
