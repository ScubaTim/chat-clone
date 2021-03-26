import React from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import ApolloProvider from './ApolloProvider'

import './App.scss';
import Register from './Pages/Register'


function App() {


  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container>
          <Route path="/register" component={Register} />
        </Container>
      </BrowserRouter>
    </ApolloProvider>

  );
}

export default App;
