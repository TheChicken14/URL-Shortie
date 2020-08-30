import React, { Component } from "react";
import Container from "@material-ui/core/Container";

export default class Admin extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      errored: false,
      loggedIn: false,
      token: "",
      createUserDialog: false,
    };
  }
  componentDidMount() {}
  render() {
    return <Container></Container>;
  }
}
