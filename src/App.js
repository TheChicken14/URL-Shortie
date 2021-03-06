import React from "react";
import { BrowserRouter as Router, Link, Route, Switch, useLocation } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Home from "./views/Home";
import Admin from "./views/Admin";
import LogIn from "./views/Login";
import Register from "./views/Register"
import LogOut from "./views/LogOut"
import withAuth from "./components/withAuth";
import Account from "./views/Account"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  spacer: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            URL-Shortie
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <span className={classes.spacer}></span>
          <AccountButton />
          <AdminOrLogOutButton />
        </Toolbar>
      </AppBar>

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/admin" component={withAuth(Admin)} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={LogIn} />
        <Route path="/logout" component={LogOut} />
        <Route path="/account" component={withAuth(Account)} />
      </Switch>
    </Router>
  );
}

export default App;

function AdminOrLogOutButton() {
  let location = useLocation();
  return location.pathname === "/admin" ? (
    <Button color="inherit" component={Link} to="/logout">
      Log out
    </Button>
  ) : (
      <Button color="inherit" component={Link} to="/admin">
        Dashboard
      </Button>
    )
}
function AccountButton() {
  let location = useLocation();
  return location.pathname === "/admin" ? (
    <Button color="inherit" component={Link} to="/account">
      Account
    </Button>
  ) : null
}