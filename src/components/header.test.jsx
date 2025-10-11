// src/components/header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Header from './header.jsx';

describe('Header Component', () => {
    it('renders the main heading in German', () => {
        render(<Header />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Ein Bandit mit vielen Armen');
    });

    it('renders the first descriptive paragraph', () => {
        render(<Header />);
        expect(
            screen.getByText(/Stell dir vor, du bist ein Mafioso\./)
        ).toBeInTheDocument();
    });

    it('renders the algorithm selection paragraph', () => {
        render(<Header />);
        expect(
            screen.getByText(/Wähle aus verschiedenen Gehilfen/)
        ).toBeInTheDocument();
    });

    it('renders the warning paragraph', () => {
        render(<Header />);
        expect(
            screen.getByText(/Doch Obacht: Jeder Versuch kostet dich Zeit und Ressourcen!/)
        ).toBeInTheDocument();
    });
});
