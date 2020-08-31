import React, { Component } from "react";
import Container from "@material-ui/core/Container";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Grid from "@material-ui/core/Grid";

import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";

import Link from "@material-ui/core/Link";

import DeleteLinkButton from "../components/DeleteLinkButton";

import axios from "axios";

import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
  root: {
    marginTop: "5rem",
    flexGrow: 1,
  },
  textInput: {
    margin: theme.spacing(1),
    width: "100%",
  },
  linkSubtitle: {
    color: "#a8a8a8",
    margin: 0,
  },
});

class Admin extends Component {
  constructor(props) {
    super();
    this.state = {
      links: [],
      loading: true,
      errored: false,
      longUrl: "",
      customShortUrl: "",
    };
  }

  loadLinks = () => {
    axios
      .get("/api/links/all")
      .then((r) => this.setState({ links: r.data, loading: false }))
      .catch(() => this.setState({ errored: true, loading: false }));
  };

  componentDidMount() {
    this.loadLinks();
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const dataToPost =
      this.state.customShortUrl.length > 1
        ? {
            url: this.state.longUrl,
            id: this.state.customShortUrl,
          }
        : {
            url: this.state.longUrl,
          };
    axios
      .post("/api/links/create", dataToPost, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({
          longUrl: "",
          customShortUrl: "",
        });
        this.loadLinks();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root}>
        <Paper style={{ marginBottom: "3rem" }}>
          <form onSubmit={this.onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.textInput}
                  id="standard-basic"
                  label="Enter the URL"
                  name="longUrl"
                  required
                  value={this.state.longUrl}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  className={classes.textInput}
                  id="standard-basic"
                  label="Custom short URL"
                  name="customShortUrl"
                  value={this.state.customShortUrl}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disableElevation
                >
                  Shorten!
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {!this.state.loading && !this.state.errored && (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.links.map((link) => (
                  <TableRow key={link.title}>
                    <TableCell component="th" scope="row">
                      <Link href={`/s/${link.shortCode}`} target="_blank">
                        {link.shortCode}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <strong>{link.title}</strong>
                      <p className={classes.linkSubtitle}>{link.longUrl}</p>
                    </TableCell>
                    <TableCell>{link.clickCount}</TableCell>
                    <TableCell>
                      <DeleteLinkButton link={link} reload={this.loadLinks} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    );
  }
}

export default withStyles(useStyles)(Admin);
