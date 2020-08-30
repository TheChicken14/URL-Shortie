import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import axios from "axios";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "3rem",
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
});

export default function withAuth(ComponentToProtect) {
  class withAuthClass extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      axios
        .get("/api/user/checkToken")
        .then((res) => {
          this.setState({ loading: false });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            redirect: true,
          });
        });
    }

    render() {
      const { loading, redirect } = this.state;
      const { classes } = this.props;
      if (loading) {
        return (
          <div className={classes.root}>
            <Grid container>
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                  <CircularProgress />
                </Paper>
              </Grid>
            </Grid>
          </div>
        );
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  }
  return withStyles(useStyles)(withAuthClass);
}
