import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/components/ui/button', () => {
    return {
        Button: ({ children, ...props }) => React.createElement('button', props, children),
    };
});

import LanguageToggle from './LanguageToggle';

describe('LanguageToggle', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows "DE" when lang="de" and clicking toggles to "en"', () => {
        const setLang = vi.fn();
        render(<LanguageToggle lang="de" setLang={setLang} />);

        const btn = screen.getByRole('button', { name: /DE/i });
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(setLang).toHaveBeenCalledTimes(1);
        expect(setLang).toHaveBeenCalledWith('en');
    });

    it('shows "EN" when lang="en" and clicking toggles to "de"', () => {
        const setLang = vi.fn();
        render(<LanguageToggle lang="en" setLang={setLang} />);

        const btn = screen.getByRole('button', { name: /EN/i });
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(setLang).toHaveBeenCalledTimes(1);
        expect(setLang).toHaveBeenCalledWith('de');
    });
});
