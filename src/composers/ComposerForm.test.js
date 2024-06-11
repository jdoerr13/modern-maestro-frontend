import React from 'react';
import { render } from '@testing-library/react';
import ComposerForm from './ComposerForm';

test('renders composer form', () => {
  const { getByLabelText } = render(<ComposerForm />);
  const nameLabel = getByLabelText(/Full Name/i);
  expect(nameLabel).toBeInTheDocument();
  // Add more assertions as needed
});

// Add more test cases as needed
