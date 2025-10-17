import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('./components/LanguageToggle.jsx', () => ({
    default: (props) => (
        <button onClick={() => props.setLang(props.lang === 'de' ? 'en' : 'de')}>
            LangToggle:{props.lang}
        </button>
    ),
}));

vi.mock('./components/ThemeToggle.jsx', () => ({
    default: (props) => <div>ThemeToggle:{props.lang}</div>,
}));

vi.mock('./components/header.jsx', () => ({
    default: (props) => <div>Header:{props.lang}</div>,
}));

vi.mock('./components/NavigationBar.jsx', () => ({
    default: () => <nav>NavigationBar</nav>,
}));

vi.mock('./components/BanditConfig.jsx', () => ({
    default: (props) => (
        <section>
            <button onClick={() => props.startSimulation && props.startSimulation()}>
                Start
            </button>
            <button onClick={() => props.resetAll && props.resetAll()}>Reset</button>
        </section>
    ),
}));

vi.mock('./components/BanditPlayground.jsx', () => ({
    default: (props) => (
        <div>
            {props.arms?.map((a) => (
                <button key={a.id} onClick={() => props.onPull && props.onPull(a)}>
                    {a.label}
                </button>
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

describe('App interactions (Vitest)', () => {
    let defaults;
    let consoleSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
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

    it('updates Header when LanguageToggle is clicked (App state lifts language)', () => {
        render(<App />);

        expect(screen.getByText('Header:de')).toBeInTheDocument();

        const toggleBtn = screen.getByRole('button', { name: /LangToggle:de/i });
        fireEvent.click(toggleBtn);

        expect(screen.getByText('Header:en')).toBeInTheDocument();
    });

    it('calls hook functions via child controls and handleReset logs', () => {
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
        expect(defaults.resetAll).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('Simulation stopped and reset');
    });

    it('renders BanditResultsChart when showPlot is true', () => {
        useBanditGame.mockReturnValue({ ...defaults, showPlot: true });
        render(<App />);

        expect(screen.getByText('Chart')).toBeInTheDocument();
    });
});
