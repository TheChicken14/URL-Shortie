import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import axios from "axios";

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

      if (loading) {
        return (
          <div>
            <Grid container>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  color="inherit"
                  style={{
                    textAlign: "center",
                    marginTop: "5rem",
                    backgroundColor: "",
                  }}
                >
                  <CircularProgress size={80} />
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
  return withAuthClass;
}
