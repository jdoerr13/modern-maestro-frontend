import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when there is no value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

  });

  it('should set and retrieve a string value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem('testKey')).toBe('newValue');
  });

  it('should set and retrieve an object', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', {}));

    const newValue = { a: 1, b: 2 };

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(localStorage.getItem('testKey'))).toEqual(newValue);
  });

  it('should handle JWT strings properly', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const { result } = renderHook(() => useLocalStorage('testKey', null));

    act(() => {
      result.current[1](jwt);
    });

    expect(result.current[0]).toBe(jwt);
    expect(localStorage.getItem('testKey')).toBe(jwt);
  });

  it('should return existing value from localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify({ a: 1, b: 2 }));

    const { result } = renderHook(() => useLocalStorage('testKey'));

    expect(result.current[0]).toEqual({ a: 1, b: 2 });
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('testKey', '{invalid-json');

    const { result } = renderHook(() => useLocalStorage('testKey', 'fallbackValue'));

    expect(result.current[0]).toBe('fallbackValue');
  });
});
