import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Register from './RegisterContainer';

import {getStore} from '../../../lib/testSetup';
const store = getStore()

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Register /></Provider>, div);
});
