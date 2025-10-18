import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BanditPlayground from './BanditPlayground';

describe('BanditPlayground', () => {
    const arms = [
        { id: 0, pulls: 0 },
        { id: 1, pulls: 3 },
        { id: 2, pulls: 1 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all arms with label and pull count (English default)', () => {
        render(<BanditPlayground arms={arms} onPull={() => {}} disabled={false} />);

        arms.forEach(a => {
            expect(screen.getByText(`Campaign #${a.id + 1}`)).toBeInTheDocument();
            expect(screen.getByText(`Attempts: ${a.pulls}`)).toBeInTheDocument();
            expect(screen.getByLabelText(`campaign-${a.id}`)).toBeInTheDocument();
        });
    });

    it('calls onPull with the correct id when button is clicked', () => {
        const onPull = vi.fn();
        render(<BanditPlayground arms={arms} onPull={onPull} disabled={false} />);

        const firstButton = screen.getByLabelText('campaign-0');
        fireEvent.click(firstButton);

        expect(onPull).toHaveBeenCalledTimes(1);
        expect(onPull).toHaveBeenCalledWith(0);
    });

    it('disables all buttons when disabled=true', () => {
        render(<BanditPlayground arms={arms} onPull={() => {}} disabled={true} />);

        arms.forEach(a => {
            const btn = screen.getByLabelText(`campaign-${a.id}`);
            expect(btn).toBeDisabled();
        });
    });

    it('uses German labels when lang="de" is set', () => {
        render(<BanditPlayground arms={arms} onPull={() => {}} disabled={false} lang="de" />);

        arms.forEach(a => {
            expect(screen.getByText(`Kampagne #${a.id + 1}`)).toBeInTheDocument();
            expect(screen.getByText(`Versuche: ${a.pulls}`)).toBeInTheDocument();
            expect(screen.getByLabelText(`campaign-${a.id}`)).toBeInTheDocument();
        });
    });
});
