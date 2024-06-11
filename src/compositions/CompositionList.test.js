import React from 'react';
import { render } from '@testing-library/react';
import CompositionList from './CompositionList';

test('renders composition list correctly', () => {
  const { getByText } = render(<CompositionList />);
  const compositionsHeader = getByText(/Compositions/i);
  const searchInput = getByLabelText(/Search compositions/i);
  const addNewButton = getByText(/Add New Composition/i);

  expect(compositionsHeader).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
  expect(addNewButton).toBeInTheDocument();
});


