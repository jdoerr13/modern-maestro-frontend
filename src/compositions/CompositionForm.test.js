import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import CompositionForm from './CompositionForm';
import ModernMaestroApi from '../api/api';

// Mock the API calls
jest.mock('../api/api');

// Mock useLocation to provide state
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('CompositionForm', () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ state: { composerId: 1, composerName: 'Mozart' } });
  });

  it('renders the form with initial state', async () => {
    ModernMaestroApi.getInstruments.mockResolvedValueOnce(['Piano', 'Violin', 'Flute']);

    render(
      <BrowserRouter>
        <CompositionForm />
      </BrowserRouter>
    );

    // Check initial form fields
    expect(screen.getByRole('textbox', { name: /title/i })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: /year composed/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /duration/i })).toBeTruthy();
    expect(screen.getByRole('listbox', { name: /instrumentation/i })).toBeTruthy();
    expect(screen.getByLabelText(/choose file/i)).toBeTruthy();

    // Wait for instrument list to be populated
    await waitFor(() => {
      expect(screen.getByText('Piano')).toBeTruthy();
      expect(screen.getByText('Violin')).toBeTruthy();
      expect(screen.getByText('Flute')).toBeTruthy();
    });
  });


  it('handles "Composer not found" scenario', async () => {
    useLocation.mockReturnValue({ state: null });
    ModernMaestroApi.getInstruments.mockResolvedValueOnce(['Piano', 'Violin', 'Flute']);

    render(
      <BrowserRouter>
        <CompositionForm />
      </BrowserRouter>
    );

    expect(screen.queryByText(/add new composition for/i)).toBeNull();
  });
});
