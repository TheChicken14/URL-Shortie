import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "1rem",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  header: {},
}));

function Home() {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h1 className={classes.header}>URL-Shortie</h1>
            <h4>A simple URL shortener!</h4>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
