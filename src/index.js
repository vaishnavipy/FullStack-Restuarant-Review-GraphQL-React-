import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom"
import {ApolloCache,ApolloClient,ApolloLink,ApolloProvider,concat, HttpLink, InMemoryCache,split} from "@apollo/client"
import { getMainDefinition } from '@apollo/client/utilities';

import { WebSocketLink } from '@apollo/client/link/ws';


const wsLink = new WebSocketLink({
  lazy: true,
  uri: "ws://restuarant-review.hasura.app/v1/graphql",
  options: {
    reconnect: true
  }
});


const httpLink = new HttpLink({uri:"https://restuarant-review.hasura.app/v1/graphql"});


/*const headerInfo = new ApolloLink((operation,forward) => {

  operation.setContext(({headers={}})=>({

    headers:{
      ...headers,
      "content-type": "application/json",
      "x-hasura-admin-secret":adminSecret
    }
  }));

  return forward(operation)
}) */

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
 httpLink,
);





const client=new ApolloClient({
  link:splitLink,
  cache:new InMemoryCache()
})


ReactDOM.render(

  <ApolloProvider client={client}>
    <Router> 
        <App />
    </Router>
  </ApolloProvider>
 ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))

