import React from 'react';
import { render } from '@testing-library/react';
import ComposerDetail from './ComposerDetail';

test('renders loading message when isLoading is true', () => {
  const { getByText } = render(<ComposerDetail />);
  const loadingElement = getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders composer not found message when composer is null and isLoading is false', () => {
  const { getByText } = render(<ComposerDetail />);
  const composerNotFoundElement = getByText(/composer not found/i);
  expect(composerNotFoundElement).toBeInTheDocument();
});

// Add more test cases as needed
