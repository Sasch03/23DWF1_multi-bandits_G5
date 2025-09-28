import { describe, it, expect } from 'vitest';
import Algorithm from '../../Logic/Algorithm/Algorithm.js';

class DummyAlg extends Algorithm { selectArm(){ return 0; } }

describe('Algorithm', () => {
    it('abstract selectArm throws on base', () => {
        expect(() => new Algorithm({ numberOfArms:2, numberOfTries:1 }).selectArm())
            .toThrow();
    });

    it('records selection and advances step', () => {
        const a = new DummyAlg({ numberOfArms:3, numberOfTries:2 });
        a.update({ arm: a.selectArm() });
        expect(a.selectedArms[0]).toBe(0);
        expect(a.step).toBe(1);
    });
});
