import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComposerForm from './ComposerForm';
import ModernMaestroApi from '../api/api';

// Mock the API calls
jest.mock('../api/api');

describe('ComposerForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockComposerInfo = {
    name: 'Wolfgang Amadeus Mozart',
    biography: 'A prolific and influential composer of the Classical period.',
    website: 'https://mozart.com',
    social_media_links: {
      Facebook: 'https://facebook.com/mozart',
      Twitter: 'https://twitter.com/mozart',
    },
  };

  it('renders the form with initial state', () => {
    render(
      <BrowserRouter>
        <ComposerForm />
      </BrowserRouter>
    );


  });

  it('fills the form with composerInfo', () => {
    render(
      <BrowserRouter>
        <ComposerForm composerInfo={mockComposerInfo} />
      </BrowserRouter>
    );


  });

  it('adds a new social media link', () => {
    render(
      <BrowserRouter>
        <ComposerForm composerInfo={mockComposerInfo} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/add link/i));

    expect(screen.getAllByPlaceholderText(/platform name/i)).toHaveLength(3);
    expect(screen.getAllByPlaceholderText(/url/i)).toHaveLength(3);
  });

  it('submits the form successfully', async () => {
    ModernMaestroApi.createComposer.mockResolvedValueOnce({ data: { message: 'Composer created successfully' } });

    render(
      <BrowserRouter>
        <ComposerForm user_id="1" />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ludwig van Beethoven' } });
    fireEvent.change(screen.getByLabelText(/biography/i), { target: { value: 'A German composer and pianist.' } });
    fireEvent.change(screen.getByLabelText(/website/i), { target: { value: 'https://beethoven.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/platform name/i)[0], { target: { value: 'Twitter' } });
    fireEvent.change(screen.getAllByPlaceholderText(/url/i)[0], { target: { value: 'https://twitter.com/beethoven' } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => expect(ModernMaestroApi.createComposer).toHaveBeenCalled());

    expect(ModernMaestroApi.createComposer).toHaveBeenCalledWith("", {
      name: 'Ludwig van Beethoven',
      biography: 'A German composer and pianist.',
      website: 'https://beethoven.com',
      social_media_links: { Twitter: 'https://twitter.com/beethoven' },
      user_id: "1"
    });

    // await waitFor(() => expect(screen.getByText(/composer updated successfully/i)).toBeInTheDocument());
  });

  it('shows error message on failed submit', async () => {
    ModernMaestroApi.createComposer.mockRejectedValueOnce({ response: { data: { error: 'Failed to create composer' } } });

    render(
      <BrowserRouter>
        <ComposerForm user_id="1" />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ludwig van Beethoven' } });
    fireEvent.change(screen.getByLabelText(/biography/i), { target: { value: 'A German composer and pianist.' } });
    fireEvent.change(screen.getByLabelText(/website/i), { target: { value: 'https://beethoven.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/platform name/i)[0], { target: { value: 'Twitter' } });
    fireEvent.change(screen.getAllByPlaceholderText(/url/i)[0], { target: { value: 'https://twitter.com/beethoven' } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => expect(ModernMaestroApi.createComposer).toHaveBeenCalled());

    expect(ModernMaestroApi.createComposer).toHaveBeenCalledWith("", {
      name: 'Ludwig van Beethoven',
      biography: 'A German composer and pianist.',
      website: 'https://beethoven.com',
      social_media_links: { Twitter: 'https://twitter.com/beethoven' },
      user_id: "1"
    });

   
  });
});
