// javascript
// File: `src/components/BanditConfigForm.test.jsx`
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

vi.mock('@/components/shared/Counter.jsx', () => {
    return {
        default: ({ value = 0, onChange = () => {}, disabled }) =>
            React.createElement(
                'div',
                null,
                React.createElement('button', {
                    'data-testid': 'decrement',
                    disabled,
                    onClick: () => onChange(Math.max(0, value - 1)),
                }, '-'),
                React.createElement('span', null, String(value)),
                React.createElement('button', {
                    'data-testid': 'increment',
                    disabled,
                    onClick: () => onChange(value + 1),
                }, '+')
            ),
    };
});

import BanditConfig from './BanditConfigForm.jsx';

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

    it('calls setArmCount when increasing the campaign counter', () => {
        const props = setup();
        const incrementButtons = screen.getAllByTestId('increment');
        fireEvent.click(incrementButtons[0]);
        expect(props.setArmCount).toHaveBeenCalledWith(6);
    });

    it('calls setIterations when increasing the attempts counter', () => {
        const props = setup();
        const incrementButtons = screen.getAllByTestId('increment');
        fireEvent.click(incrementButtons[1]);
        expect(props.setIterations).toHaveBeenCalledWith(11);
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
        const runningBtn = screen.getByText('Läuft');
        expect(runningBtn).toBeDisabled();

        const decrementButtons = screen.getAllByTestId('decrement');
        const incrementButtons = screen.getAllByTestId('increment');
        expect(decrementButtons[0]).toBeDisabled();
        expect(incrementButtons[0]).toBeDisabled();
        expect(decrementButtons[1]).toBeDisabled();
        expect(incrementButtons[1]).toBeDisabled();
    });

    it('shows diagram button when running=true and showPlot=false and calls setShowPlot', () => {
        const props = setup({ running: true, showPlot: false });
        const plotBtn = screen.getByText('Diagramm');
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