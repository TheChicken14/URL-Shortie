import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import { post } from "axios";
export default class LogOut extends Component {
  componentDidMount() {
    post("/api/user/logout")
      .then(() => {
        this.props.history.push("/");
      })
      .catch((e) => {
        if (e.response && e.response.status === 403) {
          this.props.history.push("/login");
        } else {
          alert("An error occurred while logging out.");
        }
      });
  }
  render() {
    return (
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              style={{
                textAlign: "center",
                marginTop: "5rem",
              }}
            >
              <CircularProgress size={80} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
