import React from 'react';
import { render } from '@testing-library/react';
import CompositionForm from './CompositionForm';

test('renders composition form correctly', () => {
  const { getByLabelText, getByText } = render(<CompositionForm />);
  const titleInput = getByLabelText(/Title/i);
  const yearInput = getByLabelText(/Year Composed/i);
  const descriptionInput = getByLabelText(/Description/i);
  const durationInput = getByLabelText(/Duration/i);
  const instrumentationInput = getByLabelText(/Instrumentation/i);
  const chooseFileInput = getByLabelText(/Choose File/i);
  const addButton = getByText(/Add Composition/i);
  const cancelButton = getByText(/Cancel/i);

  expect(titleInput).toBeInTheDocument();
  expect(yearInput).toBeInTheDocument();
  expect(descriptionInput).toBeInTheDocument();
  expect(durationInput).toBeInTheDocument();
  expect(instrumentationInput).toBeInTheDocument();
  expect(chooseFileInput).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();
});

