import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  // Mock localStorage
  let localStorageMock = {};
  beforeEach(() => {
    localStorageMock = {};
    // Mock localStorage getItem and setItem
    global.localStorage.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value;
    });
    global.localStorage.getItem = jest.fn((key) => localStorageMock[key]);
  });

  test('should set and get item in localStorage', () => {
    const TestComponent = () => {
      const [item, setItem] = useLocalStorage('testKey', 'initialValue');

      return (
        <div>
          <span data-testid="item">{item}</span>
          <button data-testid="setItemButton" onClick={() => setItem('newValue')}>
            Set Item
          </button>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    // Check if initial value is rendered
    expect(getByTestId('item').textContent).toBe('initialValue');

    // Click on the button to set new value
    fireEvent.click(getByTestId('setItemButton'));

    // Check if new value is set and rendered
    expect(getByTestId('item').textContent).toBe('newValue');

    // Check if value is set in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'));
  });

  test('should remove item from localStorage when setting null', () => {
    const TestComponent = () => {
      const [item, setItem] = useLocalStorage('testKey', 'initialValue');

      return (
        <div>
          <span data-testid="item">{item}</span>
          <button data-testid="removeItemButton" onClick={() => setItem(null)}>
            Remove Item
          </button>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    // Check if initial value is rendered
    expect(getByTestId('item').textContent).toBe('initialValue');

    // Click on the button to remove item
    fireEvent.click(getByTestId('removeItemButton'));

    // Check if item is removed from localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(null));
  });
});
