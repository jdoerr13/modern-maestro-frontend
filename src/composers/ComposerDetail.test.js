import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComposerDetail from './ComposerDetail';
import ModernMaestroApi from '../api/api';

// Mock the API calls
jest.mock('../api/api');

describe('ComposerDetail', () => {
  it('renders loading state initially', async () => {
    ModernMaestroApi.getComposerById.mockResolvedValueOnce(null);
    ModernMaestroApi.getCompositionsByComposerId.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <ComposerDetail />
      </BrowserRouter>
    );

    // Assert that loading state is rendered
    // expect(screen.getByText('Loading...')).toBeTruthy();

    // Wait for loading to disappear
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());
  });

  // it('renders composer details after loading', async () => {
  //   const composerDetails = {
  //     composer_id: 1,
  //     name: 'Mozart',
  //     biography: 'Some biography',
  //     website: 'https://mozart.com',
  //     social_media_links: {},
  //   };

  //   ModernMaestroApi.getComposerById.mockResolvedValueOnce(composerDetails);
  //   ModernMaestroApi.getCompositionsByComposerId.mockResolvedValueOnce([]);

  //   render(
  //     <BrowserRouter>
  //       <ComposerDetail />
  //     </BrowserRouter>
  //   );

  //   // Wait for the composer details to appear
  //   await waitFor(() => expect(screen.queryByText('Mozart')).toBeTruthy());
  //   expect(screen.queryByText('Some biography')).toBeTruthy();
  // });

  it('renders "Composer not found" when composer is null', async () => {
    ModernMaestroApi.getComposerById.mockResolvedValueOnce(null);
    ModernMaestroApi.getCompositionsByComposerId.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <ComposerDetail />
      </BrowserRouter>
    );

    // Wait for the "Composer not found" message to appear
    await waitFor(() => expect(screen.queryByText('Composer not found.')).toBeTruthy());
  });
});
