import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store';
import './index.css';

import Project from './components/Project';
import * as serviceWorker from './serviceWorker';
ReactDOM.render(
 <Provider store={configureStore()}>
  <Project />
 </Provider>,
 document.getElementById('root')
);
serviceWorker.unregister();
