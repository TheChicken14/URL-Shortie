import React, { Component } from "react";

import Container from "@material-ui/core/Container";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import axios from "axios";
import Loading from "../components/Loading";

import { withStyles } from "@material-ui/core/styles";

// eslint-disable-next-line no-control-regex
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "3rem",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  textInput: {
    margin: theme.spacing(1),
    width: "100%",
  },
});

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      errored: false,
      accountData: {
        email: "",
        admin: false,
      },
      isEmailValid: true,
      snackbar: {
        opened: false,
        message: "",
        error: false,
      },
    };
  }

  componentDidMount() {
    axios
      .get("/api/user/details")
      .then((r) => this.setState({ loading: false, accountData: r.data }))
      .catch(() => this.setState({ loading: false, errored: true }));
  }

  updateAccount = () => {
    if (!this.state.isEmailValid) {
      return;
    }
    axios
      .post("/api/user/update", {
        email: this.state.accountData.email,
      })
      .then(() => this.openSnackbar("Successfully updated account!"))
      .catch(() =>
        this.openSnackbar(
          "An error occurred while updating your account.",
          true
        )
      );
  };

  openSnackbar = (message, error = false) => {
    this.setState({
      snackbar: {
        opened: true,
        message,
        error,
      },
    });
  };
  closeSnackbar = () => this.setState({ snackbar: { opened: false } });

  handleInputChange = (event) => {
    const { value, name } = event.target;
    let { isEmailValid } = this.state;
    if (name === "email") {
      isEmailValid = emailRegex.test(value);
    }
    this.setState({
      accountData: {
        [name]: value,
      },
      isEmailValid,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h3">Account</Typography>
        {this.state.loading && <Loading />}
        {!this.state.loading && !this.state.errored && (
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  name="email"
                  className={classes.textInput}
                  value={this.state.accountData.email}
                  onChange={this.handleInputChange}
                  error={!this.state.isEmailValid}
                  helperText={!this.state.isEmailValid ? "Invalid email" : ""}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  style={{
                    marginTop: "15px",
                  }}
                  onClick={this.updateAccount}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
        <Snackbar
          open={this.state.snackbar.opened}
          autoHideDuration={6000}
          onClose={this.closeSnackbar}
        >
          <Alert
            severity={this.state.snackbar.error ? "error" : "success"}
            onClose={this.handleClose}
          >
            {this.state.snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Account);
