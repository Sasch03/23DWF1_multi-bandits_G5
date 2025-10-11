import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/components/ui/button', () => {
    return {
        Button: ({ children, ...props }) => <button {...props}>{children}</button>,
    };
});

import ThemeToggle from './ThemeToggle';

function setMatchMedia(matches) {
    const target = typeof window !== 'undefined' ? window : globalThis;
    target.matchMedia = (query) => ({
        matches,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.className = '';
    setMatchMedia(false);
});

describe('ThemeToggle', () => {
    it('initializes dark when localStorage.theme = "dark"', () => {
        localStorage.setItem('theme', 'dark');
        render(<ThemeToggle />);

        const btn = screen.getByRole('button', { name: /Toggle Theme/i });
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(btn).toHaveTextContent('Light');
    });

    it('initializes light when localStorage.theme = "light"', () => {
        localStorage.setItem('theme', 'light');
        render(<ThemeToggle />);

        const btn = screen.getByRole('button', { name: /Toggle Theme/i });
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(btn).toHaveTextContent('Dark');
    });

    it('falls back to prefers-color-scheme when no localStorage key', () => {
        // prefers dark
        setMatchMedia(true);
        render(<ThemeToggle />);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(screen.getByRole('button', { name: /Toggle Theme/i })).toHaveTextContent('Light');

        // rerender with prefers light
        document.documentElement.className = '';
        setMatchMedia(false);
        const { rerender } = render(<ThemeToggle />);
        rerender(<ThemeToggle />);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('toggles theme on click and updates localStorage and document class', () => {
        localStorage.setItem('theme', 'light');
        render(<ThemeToggle />);

        const btn = screen.getByRole('button', { name: /Toggle Theme/i });
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('light');
        expect(btn).toHaveTextContent('Dark');

        fireEvent.click(btn);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(btn).toHaveTextContent('Light');

        fireEvent.click(btn);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('light');
        expect(btn).toHaveTextContent('Dark');
    });
});
