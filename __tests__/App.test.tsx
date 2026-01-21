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
    // Splash screen takes ~3 seconds to complete
    await waitFor(() => {
      expect(getByText('Hey there!')).toBeTruthy();
    }, {timeout: 6000});
  }, 10000);
});
