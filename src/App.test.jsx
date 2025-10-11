// src/App.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

// Mock child components used by App
vi.mock('./components/ThemeToggle.jsx', () => ({
    default: () => <div>ThemeToggle</div>,
}));

vi.mock('./components/header.jsx', () => ({
    default: () => <header><h1>Multi-Armed Bandit Playground</h1></header>,
}));

vi.mock('./components/NavigationBar.jsx', () => ({
    default: () => <nav>NavigationBar</nav>,
}));

vi.mock('./components/BanditConfigForm.jsx', () => ({
    default: (props) => (
        <section>
            <div>Configuration</div>
            <button onClick={props.startSimulation}>Start</button>
            <button onClick={props.resetAll}>Reset</button>
        </section>
    ),
}));

vi.mock('./components/BanditPlayground.jsx', () => ({
    default: (props) => (
        <div>
            {props.arms && props.arms.map((a, i) => (
                <button key={i} onClick={() => props.onPull && props.onPull(a)}>{a.label}</button>
            ))}
        </div>
    ),
}));

vi.mock('./components/BanditResults.jsx', () => ({
    default: (props) => (
        <aside>
            <div>Total Attempts: {props.totalPulls}</div>
            <div>Total Reward: {props.totalReward}</div>
        </aside>
    ),
}));

vi.mock('@/components/BanditResultsChart.jsx', () => ({
    default: () => <div>Chart</div>,
}));

// Mock the hook used by App
vi.mock('./hooks/useBanditSimulation.js', () => ({
    useBanditGame: vi.fn(),
}));

import App from './App.jsx';
import { useBanditGame } from './hooks/useBanditSimulation.js';

describe('App (with mocked children & hook)', () => {
    let defaults;

    beforeEach(() => {
        vi.clearAllMocks();

        defaults = {
            type: 'Bernoulli',
            setType: vi.fn(),
            arms: [
                { id: 1, label: 'Campaign #1' },
                { id: 2, label: 'Campaign #2' },
            ],
            iterations: 5,
            setIterations: vi.fn(),
            totalPulls: 0,
            totalReward: 0,
            logs: [],
            running: false,
            showPlot: false,
            setShowPlot: vi.fn(),
            startGame: vi.fn(),
            resetAll: vi.fn(),
            setArmCount: vi.fn(),
            handlePull: vi.fn(),
            game: {},
            getCumulativeRewards: vi.fn(),
        };

        useBanditGame.mockReturnValue({ ...defaults });
    });

    it('renders main sections and an arm button', () => {
        render(<App />);

        expect(screen.getByText('Multi-Armed Bandit Playground')).toBeInTheDocument();
        expect(screen.getByText('Configuration')).toBeInTheDocument();
        expect(screen.getByText('Total Attempts: 0')).toBeInTheDocument();

        const armBtn = screen.getByText(/Campaign #1/i);
        expect(armBtn).toBeInTheDocument();
    });

    it('calls startGame, handlePull and resetAll through mocked children', () => {
        render(<App />);

        const startBtn = screen.getByText('Start');
        fireEvent.click(startBtn);
        expect(defaults.startGame).toHaveBeenCalledTimes(1);

        const armBtn = screen.getByText(/Campaign #1/i);
        fireEvent.click(armBtn);
        expect(defaults.handlePull).toHaveBeenCalledTimes(1);
        expect(defaults.handlePull).toHaveBeenCalledWith(defaults.arms[0]);

        const resetBtn = screen.getByText('Reset');
        fireEvent.click(resetBtn);
        // App passes a wrapper handleReset -> calls resetAll() from hook
        expect(defaults.resetAll).toHaveBeenCalledTimes(1);
    });

    it('renders BanditResultsChart when showPlot is true', () => {
        useBanditGame.mockReturnValue({ ...defaults, showPlot: true });
        render(<App />);

        expect(screen.getByText('Chart')).toBeInTheDocument();
    });
});
