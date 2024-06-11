import React from 'react';
import { render } from '@testing-library/react';
import ComposerList from './ComposerList';

test('renders composer list', () => {
  const { getByText } = render(<ComposerList />);
  const composersHeader = getByText(/Composers/i);
  expect(composersHeader).toBeInTheDocument();
  // Add more assertions as needed
});

// Add more test cases as needed
