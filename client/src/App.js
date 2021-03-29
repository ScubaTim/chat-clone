import React from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import ApolloProvider from './ApolloProvider'

import './App.scss';

import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'

import { AuthProvider } from './context/auth'

function App() {


  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>

  );
}

export default App;
