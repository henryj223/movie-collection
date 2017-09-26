import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import About from './AboutContainer';

import {getStore} from '../../../lib/testSetup';
const store = getStore()

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><About /></Provider>, div);
});
