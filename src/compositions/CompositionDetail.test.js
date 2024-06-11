import React from 'react';
import { render } from '@testing-library/react';
import CompositionDetail from './CompositionDetail';

test('renders loading message when composition is null', () => {
  const { getByText } = render(<CompositionDetail />);
  const loadingElement = getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});


