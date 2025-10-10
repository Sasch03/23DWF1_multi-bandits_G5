/* global global */

import '@testing-library/jest-dom';

// Mock for ResizeObserver (needed for Recharts)
global.ResizeObserver = class {
    // eslint-disable-next-line no-unused-vars
    constructor(callback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
};
