/**
 * @format
 */

import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders without crashing', async () => {
    const {getByText} = render(<App />);

    // Wait for the app to render the login screen (Auth First pattern)
    await waitFor(() => {
      expect(getByText('Welcome Back')).toBeTruthy();
    }, {timeout: 5000});
  });
});
