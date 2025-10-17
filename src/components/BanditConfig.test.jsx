import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks for UI wrappers / components
vi.mock('@/components/ui/card.jsx', () => {
    return {
        Card: ({ children, ...props }) => React.createElement('div', props, children),
        CardHeader: ({ children }) => React.createElement('div', null, children),
        CardTitle: ({ children }) => React.createElement('h2', null, children),
        CardDescription: ({ children }) => React.createElement('p', null, children),
        CardContent: ({ children }) => React.createElement('div', null, children),
        CardFooter: ({ children }) => React.createElement('div', null, children),
    };
});


vi.mock('@/components/ui/button.jsx', () => {
    return {
        Button: ({ children, ...props }) => React.createElement('button', props, children),
    };
});

vi.mock('@/components/ui/spinner.jsx', () => ({
    Spinner: () => null,
}));

vi.mock('@/components/ui/tooltip', () => {
    return {
        TooltipProvider: ({ children }) => React.createElement('div', null, children),
        Tooltip: ({ children }) => React.createElement('div', null, children),
        TooltipTrigger: ({ children }) => React.createElement('span', null, children),
        TooltipContent: ({ children }) => React.createElement('div', null, children),
    };
});

import BanditConfig from './BanditConfig.jsx';

const setup = (overrides = {}) => {
    const props = {
        arms: Array.from({ length: 5 }),
        setArmCount: vi.fn(),
        iterations: 10,
        setIterations: vi.fn(),
        startSimulation: vi.fn(),
        resetAll: vi.fn(),
        running: false,
        showPlot: false,
        setShowPlot: vi.fn(),
        lang: 'de',
        ...overrides,
    };
    render(<BanditConfig {...props} />);
    return props;
};

describe('BanditConfigForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders labels and buttons (German)', () => {
        setup({ lang: 'de' });
        expect(screen.getByText('Konfiguration')).toBeInTheDocument();
        expect(screen.getByText('Anzahl Kampagnen')).toBeInTheDocument();
        expect(screen.getByText('Anzahl Versuche')).toBeInTheDocument();
        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByText('Zurücksetzen')).toBeInTheDocument();
    });

    it('calls setArmCount when increasing or decreasing the campaign count via buttons', () => {
        const props = setup();
        const decreaseCampaignBtn = screen.getByRole('button', { name: 'Decrease campaigns' });
        const increaseCampaignBtn = screen.getByRole('button', { name: 'Increase campaigns' });

        // increase
        fireEvent.click(increaseCampaignBtn);
        expect(props.setArmCount).toHaveBeenCalledWith(props.arms.length + 1);

        // decrease
        fireEvent.click(decreaseCampaignBtn);
        expect(props.setArmCount).toHaveBeenCalledWith(props.arms.length - 1);
    });

    it('calls setIterations when increasing or decreasing the attempts via buttons', () => {
        const props = setup();
        const decreaseAttemptsBtn = screen.getByRole('button', { name: 'Decrease attempts' });
        const increaseAttemptsBtn = screen.getByRole('button', { name: 'Increase attempts' });

        // increase
        fireEvent.click(increaseAttemptsBtn);
        expect(props.setIterations).toHaveBeenCalledWith(props.iterations + 1);

        // decrease
        fireEvent.click(decreaseAttemptsBtn);
        expect(props.setIterations).toHaveBeenCalledWith(props.iterations - 1);
    });



    it('starts simulation and resets via buttons', () => {
        const props = setup();
        fireEvent.click(screen.getByText('Start'));
        expect(props.startSimulation).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Zurücksetzen'));
        expect(props.resetAll).toHaveBeenCalled();
    });

    it('shows disabled running button and disabled counters when running=true', () => {
        setup({ running: true });

        const runningBtn = screen.getByText('Spiel gestartet...');
        expect(runningBtn).toBeDisabled();

        const decreaseCampaignBtn = screen.getByRole('button', { name: 'Decrease campaigns' });
        const increaseCampaignBtn = screen.getByRole('button', { name: 'Increase campaigns' });
        const decreaseAttemptsBtn = screen.getByRole('button', { name: 'Decrease attempts' });
        const increaseAttemptsBtn = screen.getByRole('button', { name: 'Increase attempts' });

        expect(decreaseCampaignBtn).toBeDisabled();
        expect(increaseCampaignBtn).toBeDisabled();
        expect(decreaseAttemptsBtn).toBeDisabled();
        expect(increaseAttemptsBtn).toBeDisabled();
    });


    it('shows diagram button when running=true and showPlot=false and calls setShowPlot', () => {
        const props = setup({ running: true, showPlot: false });
        const plotBtn = screen.getByText('Ergebnisse');
        expect(plotBtn).toBeInTheDocument();

        fireEvent.click(plotBtn);
        expect(props.setShowPlot).toHaveBeenCalledWith(true);
    });

    it('shows English labels when lang != "de"', () => {
        setup({ lang: 'en' });
        expect(screen.getByText('Configuration')).toBeInTheDocument();
        expect(screen.getByText('Number of campaigns')).toBeInTheDocument();
        expect(screen.getByText('Number of attempts')).toBeInTheDocument();
    });
});