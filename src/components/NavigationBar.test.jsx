// src/components/NavigationBar.test.jsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the navigation UI import so tests run without the UI library
vi.mock('@/components/ui/navigation-menu', () => {
    return {
        NavigationMenu: ({ children, ...props }) => <div {...props}>{children}</div>,
        NavigationMenuList: ({ children, ...props }) => <div {...props}>{children}</div>,
        NavigationMenuItem: ({ children, ...props }) => <div {...props}>{children}</div>,
        NavigationMenuLink: ({ children, href, onClick, className, ...props }) => (
            <a href={href} onClick={onClick} className={className} {...props}>
                {children}
            </a>
        ),
    };
});


import NavigationBar from './NavigationBar';

describe('NavigationBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders both nav items and highlights the current algorithm', () => {
        const setAlgo = vi.fn();
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgo} running={false} />);

        const bernoulli = screen.getByText('Bernoulli');
        const gaussian = screen.getByText('Gaussian');

        expect(bernoulli).toBeInTheDocument();
        expect(gaussian).toBeInTheDocument();

        // The selected item should include the selection class (check substring)
        const bernoulliLink = bernoulli.closest('a');
        expect(bernoulliLink).toBeTruthy();
        expect(bernoulliLink.className).toContain('bg-primary');
    });

    it('calls setAlgo when clicking an item if not running', () => {
        const setAlgo = vi.fn();
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgo} running={false} />);

        const gaussianLink = screen.getByText('Gaussian').closest('a');
        expect(gaussianLink).toBeTruthy();

        // Simulate a click on the Gaussian link
        fireEvent.click(gaussianLink);
        expect(setAlgo).toHaveBeenCalledTimes(1);
        expect(setAlgo).toHaveBeenCalledWith('Gaussian');
    });

    it('does not call setAlgo when running is true', () => {
        const setAlgo = vi.fn();
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgo} running={true} />);

        const gaussianLink = screen.getByText('Gaussian').closest('a');
        expect(gaussianLink).toBeTruthy();

        // Clicking should be ignored while running
        fireEvent.click(gaussianLink);
        expect(setAlgo).not.toHaveBeenCalled();

        // Optionally verify the disabled styling (opacity)
        expect(gaussianLink.className).toContain('opacity-50');
    });

    it('displays explanatory text for Bernoulli and Gaussian correctly', () => {
        const setAlgo = vi.fn();

        const { rerender } = render(<NavigationBar algo="Bernoulli" setAlgo={setAlgo} running={false} />);
        // Verify Bernoulli explanatory text appears
        expect(screen.getByText(/Bernoulli-Bandit arbeitet mit diskreten Auszahlungen/i)).toBeInTheDocument();

        // Rerender with Gaussian and verify its explanatory text
        rerender(<NavigationBar algo="Gaussian" setAlgo={setAlgo} running={false} />);
        expect(screen.getByText(/Gaussian-Bandit verwendet kontinuierliche Auszahlungen/i)).toBeInTheDocument();
    });
});
