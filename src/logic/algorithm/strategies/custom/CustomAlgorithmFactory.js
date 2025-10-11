import { AlgorithmTyp } from "@/logic/enumeration/AlgorithmTyp.js";

/**
 * Factory that instantiates algorithm classes based on user selection.
 */
export default class CustomAlgorithmFactory {
    /**
     * Create a new factory.
     * @param {Object.<string,Function>} [classMap={}] - Mapping from AlgorithmTyp values to constructor functions/classes.
     * @param {boolean} [strict=true] - If true, unknown algorithm types produce a thrown error.
     */
    constructor({ classMap = {}, strict = true } = {}) {
        this.classMap = Object.assign({}, classMap);
        // The !! ensures that as soon as an object is instantiated that is not instantiated with true or false
        // (but rather, for example, 1 or 0), it automatically becomes a boolean through double negation.
        this.strict = !!strict;

        console.log(`CustomAlgorithmFactory constructed (strict=${this.strict}). Registered types: ${Object.keys(this.classMap)}`);
    }

    /**
     * Create a factory pre-filled with the AlgorithmTyp keys.
     * @param {Object} [mapping={}] - Optional overrides for default map.
     * @returns {CustomAlgorithmFactory}
     */
    static withDefaults(mapping = {}) {
        const defaultMap = {
            [AlgorithmTyp.GREEDY]: null,
            [AlgorithmTyp.EPSILON_GREEDY]: null,
            [AlgorithmTyp.GRADIENT_BANDIT]: null,
            [AlgorithmTyp.UPPER_CONFIDENCE_BOUND]: null
        };

        const merged = { ...defaultMap, ...mapping };
        return new CustomAlgorithmFactory({ classMap: merged });
    }

    /**
     * Register or override a class for the given algorithm type.
     * @param {string} type - One of AlgorithmTyp values.
     * @param {Function} clazz - Constructor (class) for the algorithm.
     */
    register(type, clazz) {
        if (!Object.values(AlgorithmTyp).includes(type)) {
            console.log(`CustomAlgorithmFactory: '${type}' is not present in AlgorithmTyp enumeration.`);
        }
        if (typeof clazz !== "function") {
            throw new Error("CustomAlgorithmFactory: clazz must be a constructor/function");
        }
        this.classMap[type] = clazz;
        console.log(`CustomAlgorithmFactory: registered class for type='${type}'.`);
    }

    /**
     * Return supported algorithm types (keys present in classMap).
     * @returns {string[]}
     */
    supportedTypes() {
        return Object.keys(this.classMap);
    }

    /**
     * Instantiate a configured algorithm instance.
     *
     * @param {string} type - AlgorithmTyp value.
     * @param {Object} [params={}] - Algorithm-specific parameters (passed through to constructor).
     * @param {number} numberOfArms - Number of arms (integer > 0).
     * @param {number} numberOfTries - Number of tries (integer > 0).
     * @returns {Object} Instance of the requested algorithm class.
     */
    create({ type, params = {}, numberOfArms, numberOfTries } = {}) {
        // Basic validation of type and numerics
        if (typeof type !== "string" || type.length === 0) {
            throw new Error("CustomAlgorithmFactory: missing algorithm type");
        }
        if (!Object.values(AlgorithmTyp).includes(type)) {
            throw new Error(`CustomAlgorithmFactory: unknown algorithm type '${type}' (not in AlgorithmTyp).`);
        }
        if (!Number.isInteger(numberOfArms) || numberOfArms <= 0) {
            throw new Error("CustomAlgorithmFactory: numberOfArms must be an integer > 0");
        }
        if (!Number.isInteger(numberOfTries) || numberOfTries <= 0) {
            throw new Error("CustomAlgorithmFactory: numberOfTries must be an integer > 0");
        }

        const AlgoClass = this.classMap[type];
        if (!AlgoClass) {
            const msg = `CustomAlgorithmFactory: algorithm '${type}' is not registered.`;
            if (this.strict) {
                throw new Error(msg);
            } else {
                console.log(msg);
                return null;
            }
        }

        // Build constructor options - designers of the algorithm classes are expected to accept this shape.
        const ctorOpts = Object.assign({ numberOfArms, numberOfTries }, params);

        // Defensive instantiation with clear logging and error translation.
        let instance;
        try {
            instance = new AlgoClass(ctorOpts);
        } catch (err) {
            // Make the error message actionable for the developer / UI.
            const message = `CustomAlgorithmFactory: failed to instantiate algorithm '${type}'`;
            console.log(message, err);
            throw new Error(message);
        }

        // Sanity check: instance must implement expected Algorithm API.
        if (typeof instance.selectArm !== "function" || typeof instance.update !== "function") {
            throw new Error(`CustomAlgorithmFactory: instantiated class for '${type}' does not implement required methods selectArm/update.`);
        }

        console.log(`CustomAlgorithmFactory: created instance of ${type} (${instance.constructor.name}) with params:`, params);
        return instance;
    }
}
