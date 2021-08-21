import './App.css';
import React from 'react'
import { Dashboard, Signup, Login } from './Views'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from './Components'

export default function App() {

  return (
    <Router>
      {/* <Navbar /> */}
      <Switch>

        <Route exact path="/">
          <Container>
            <Dashboard />
          </Container>
        </Route>

        <Route path="/login">
          <Container alignItems="center" justifyContent="center">
            <Login />
          </Container>
        </Route>

        <Route path="/signup">
          <Container alignItems="center" justifyContent="center">
            <Signup />
          </Container>
        </Route>

      </Switch>
    </Router >
  );
}
