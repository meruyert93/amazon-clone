import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Header from "./Header";
import Home from "./Home";

function App() {
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route path="/">
              <Header />
              <Home />
            </Route>
          </Switch>
        </Router>
      </div>
    );
    }
    export default App;