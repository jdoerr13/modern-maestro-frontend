import React from 'react';
import { render } from '@testing-library/react';
import ComposerSelection from './ComposerSelection';

test('renders composer selection page', () => {
  const { getByText } = render(<ComposerSelection />);
  const selectComposerHeader = getByText(/Select a Composer/i);
  expect(selectComposerHeader).toBeInTheDocument();
  // Add more assertions as needed
});

// Add more test cases as needed
