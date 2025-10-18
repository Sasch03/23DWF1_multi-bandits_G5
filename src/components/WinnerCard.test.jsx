import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import WinnerCard from './WinnerCard.jsx';

describe('WinnerCard', () => {

    it('shows manual winner message in English', () => {
        render(<WinnerCard lang="en" winner="Manual" />);
        expect(screen.getByText('Congratulations! You won!')).toBeInTheDocument();
    });

    it('shows single AI winner in English', () => {
        render(<WinnerCard lang="en" winner="UCB" />);
        expect(screen.getByText('You lost! The winner is Umberto (UCB).')).toBeInTheDocument();
    });

    it('shows multiple AI winners in English', () => {
        render(<WinnerCard lang="en" winner={['Epsilon-Greedy', 'Gradient Bandit', 'UCB']} />);
        expect(screen.getByText('You lost! The winners are Emilio (Epsilon-Greedy), Giovanni (Gradient Bandit) and Umberto (UCB).')).toBeInTheDocument();
    });

    it('falls back to raw name if unknown winner', () => {
        render(<WinnerCard lang="en" winner="UnknownBot" />);
        expect(screen.getByText('You lost! The winner is UnknownBot.')).toBeInTheDocument();
    });

    it('handles array with unknown and known winners', () => {
        render(<WinnerCard lang="de" winner={['Greedy', 'UnknownBot']} />);
        expect(screen.getByText('Du hast verloren! Der Gewinner sind Guido (Greedy) und UnknownBot.')).toBeInTheDocument();
    });
});
