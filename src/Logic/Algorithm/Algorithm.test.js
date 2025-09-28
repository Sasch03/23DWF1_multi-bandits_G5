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

    it('throws if arm is out of range', () => {
        const a = new DummyAlg({ numberOfArms:3, numberOfTries:2 });
        expect(() => a.update({ arm: -1 })).toThrow('bad arm');
        expect(() => a.update({ arm: 3 })).toThrow('bad arm');
    });

    it('throws if no tries left', () => {
        const a = new DummyAlg({ numberOfArms:2, numberOfTries:1 });
        a.update({ arm: 0 });
        expect(() => a.update({ arm: 1 })).toThrow('out of tries');
    });

    it('throws if step already recorded', () => {
        const a = new DummyAlg({ numberOfArms:2, numberOfTries:2 });
        a.update({ arm: 0 });
        expect(() => a.update({ arm: 1 })).not.toThrow(); // step 1 ok
        a.step = 0; // setze Schritt zurück, simuliert doppeltes Schreiben
        expect(() => a.update({ arm: 1 })).toThrow('already recorded');
    });

    it('reset clears history and resets step', () => {
        const a = new DummyAlg({ numberOfArms:3, numberOfTries:3 });
        a.update({ arm: 0 });
        a.update({ arm: 1 });
        expect(a.step).toBe(2);
        expect(a.selectedArms).toEqual([0,1,null]);

        a.reset();
        expect(a.step).toBe(0);
        expect(a.selectedArms).toEqual([null,null,null]);
    });
});
