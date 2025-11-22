(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/mathjs/lib/esm/core/config.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_CONFIG",
    ()=>DEFAULT_CONFIG
]);
var DEFAULT_CONFIG = {
    // minimum relative difference between two compared values,
    // used by all comparison functions
    epsilon: 1e-12,
    // type of default matrix output. Choose 'matrix' (default) or 'array'
    matrix: 'Matrix',
    // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
    number: 'number',
    // number of significant digits in BigNumbers
    precision: 64,
    // predictable output type of functions. When true, output type depends only
    // on the input types. When false (default), output type can vary depending
    // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
    // predictable is false, and returns `NaN` when true.
    predictable: false,
    // random seed for seeded pseudo random number generation
    // null = randomly seed
    randomSeed: null
};
}),
"[project]/frontend/node_modules/mathjs/lib/esm/core/function/config.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MATRIX_OPTIONS",
    ()=>MATRIX_OPTIONS,
    "NUMBER_OPTIONS",
    ()=>NUMBER_OPTIONS,
    "configFactory",
    ()=>configFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/object.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$core$2f$config$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/core/config.js [client] (ecmascript)");
;
;
var MATRIX_OPTIONS = [
    'Matrix',
    'Array'
]; // valid values for option matrix
var NUMBER_OPTIONS = [
    'number',
    'BigNumber',
    'Fraction'
]; // valid values for option number
function configFactory(config, emit) {
    /**
   * Set configuration options for math.js, and get current options.
   * Will emit a 'config' event, with arguments (curr, prev, changes).
   *
   * This function is only available on a mathjs instance created using `create`.
   *
   * Syntax:
   *
   *     math.config(config: Object): Object
   *
   * Examples:
   *
   *
   *     import { create, all } from 'mathjs'
   *
   *     // create a mathjs instance
   *     const math = create(all)
   *
   *     math.config().number                // outputs 'number'
   *     math.evaluate('0.4')                // outputs number 0.4
   *     math.config({number: 'Fraction'})
   *     math.evaluate('0.4')                // outputs Fraction 2/5
   *
   * @param {Object} [options] Available options:
   *                            {number} epsilon
   *                              Minimum relative difference between two
   *                              compared values, used by all comparison functions.
   *                            {string} matrix
   *                              A string 'Matrix' (default) or 'Array'.
   *                            {string} number
   *                              A string 'number' (default), 'BigNumber', or 'Fraction'
   *                            {number} precision
   *                              The number of significant digits for BigNumbers.
   *                              Not applicable for Numbers.
   *                            {string} parenthesis
   *                              How to display parentheses in LaTeX and string
   *                              output.
   *                            {string} randomSeed
   *                              Random seed for seeded pseudo random number generator.
   *                              Set to null to randomly seed.
   * @return {Object} Returns the current configuration
   */ function _config(options) {
        if (options) {
            var prev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["mapObject"])(config, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clone"]); // validate some of the options
            validateOption(options, 'matrix', MATRIX_OPTIONS);
            validateOption(options, 'number', NUMBER_OPTIONS); // merge options
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["deepExtend"])(config, options);
            var curr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["mapObject"])(config, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clone"]);
            var changes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["mapObject"])(options, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clone"]); // emit 'config' event
            emit('config', curr, prev, changes);
            return curr;
        } else {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["mapObject"])(config, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clone"]);
        }
    } // attach the valid options to the function so they can be extended
    _config.MATRIX_OPTIONS = MATRIX_OPTIONS;
    _config.NUMBER_OPTIONS = NUMBER_OPTIONS; // attach the config properties as readonly properties to the config function
    Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$core$2f$config$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DEFAULT_CONFIG"]).forEach((key)=>{
        Object.defineProperty(_config, key, {
            get: ()=>config[key],
            enumerable: true,
            configurable: true
        });
    });
    return _config;
}
/**
 * Test whether an Array contains a specific item.
 * @param {Array.<string>} array
 * @param {string} item
 * @return {boolean}
 */ function contains(array, item) {
    return array.indexOf(item) !== -1;
}
/**
 * Validate an option
 * @param {Object} options         Object with options
 * @param {string} name            Name of the option to validate
 * @param {Array.<string>} values  Array with valid values for this option
 */ function validateOption(options, name, values) {
    if (options[name] !== undefined && !contains(values, options[name])) {
        // unknown value
        console.warn('Warning: Unknown value "' + options[name] + '" for configuration option "' + name + '". ' + 'Available options: ' + values.map((value)=>JSON.stringify(value)).join(', ') + '.');
    }
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/core/function/typed.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Create a typed-function which checks the types of the arguments and
 * can match them against multiple provided signatures. The typed-function
 * automatically converts inputs in order to find a matching signature.
 * Typed functions throw informative errors in case of wrong input arguments.
 *
 * See the library [typed-function](https://github.com/josdejong/typed-function)
 * for detailed documentation.
 *
 * Syntax:
 *
 *     math.typed(name, signatures) : function
 *     math.typed(signatures) : function
 *
 * Examples:
 *
 *     // create a typed function with multiple types per argument (type union)
 *     const fn2 = typed({
 *       'number | boolean': function (b) {
 *         return 'b is a number or boolean'
 *       },
 *       'string, number | boolean': function (a, b) {
 *         return 'a is a string, b is a number or boolean'
 *       }
 *     })
 *
 *     // create a typed function with an any type argument
 *     const log = typed({
 *       'string, any': function (event, data) {
 *         console.log('event: ' + event + ', data: ' + JSON.stringify(data))
 *       }
 *     })
 *
 * @param {string} [name]                          Optional name for the typed-function
 * @param {Object<string, function>} signatures   Object with one or multiple function signatures
 * @returns {function} The created typed-function.
 */ __turbopack_context__.s([
    "createTyped",
    ()=>createTyped
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$typed$2d$function$2f$typed$2d$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/typed-function/typed-function.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/factory.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/map.js [client] (ecmascript)"); // returns a new instance of typed-function
;
;
;
;
;
var _createTyped2 = function _createTyped() {
    // initially, return the original instance of typed-function
    // consecutively, return a new instance from typed.create.
    _createTyped2 = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$typed$2d$function$2f$typed$2d$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create;
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$typed$2d$function$2f$typed$2d$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"];
};
var dependencies = [
    '?BigNumber',
    '?Complex',
    '?DenseMatrix',
    '?Fraction'
];
var createTyped = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])('typed', dependencies, function createTyped(_ref) {
    var { BigNumber, Complex, DenseMatrix, Fraction } = _ref;
    // TODO: typed-function must be able to silently ignore signatures with unknown data types
    // get a new instance of typed-function
    var typed = _createTyped2(); // define all types. The order of the types determines in which order function
    // arguments are type-checked (so for performance it's important to put the
    // most used types first).
    typed.types = [
        {
            name: 'number',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNumber"]
        },
        {
            name: 'Complex',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isComplex"]
        },
        {
            name: 'BigNumber',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isBigNumber"]
        },
        {
            name: 'Fraction',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isFraction"]
        },
        {
            name: 'Unit',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isUnit"]
        },
        {
            name: 'string',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isString"]
        },
        {
            name: 'Chain',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isChain"]
        },
        {
            name: 'Array',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isArray"]
        },
        {
            name: 'Matrix',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isMatrix"]
        },
        {
            name: 'DenseMatrix',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isDenseMatrix"]
        },
        {
            name: 'SparseMatrix',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isSparseMatrix"]
        },
        {
            name: 'Range',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isRange"]
        },
        {
            name: 'Index',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isIndex"]
        },
        {
            name: 'boolean',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isBoolean"]
        },
        {
            name: 'ResultSet',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isResultSet"]
        },
        {
            name: 'Help',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isHelp"]
        },
        {
            name: 'function',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isFunction"]
        },
        {
            name: 'Date',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isDate"]
        },
        {
            name: 'RegExp',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isRegExp"]
        },
        {
            name: 'null',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNull"]
        },
        {
            name: 'undefined',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isUndefined"]
        },
        {
            name: 'AccessorNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isAccessorNode"]
        },
        {
            name: 'ArrayNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isArrayNode"]
        },
        {
            name: 'AssignmentNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isAssignmentNode"]
        },
        {
            name: 'BlockNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isBlockNode"]
        },
        {
            name: 'ConditionalNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isConditionalNode"]
        },
        {
            name: 'ConstantNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isConstantNode"]
        },
        {
            name: 'FunctionNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isFunctionNode"]
        },
        {
            name: 'FunctionAssignmentNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isFunctionAssignmentNode"]
        },
        {
            name: 'IndexNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isIndexNode"]
        },
        {
            name: 'Node',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNode"]
        },
        {
            name: 'ObjectNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isObjectNode"]
        },
        {
            name: 'OperatorNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isOperatorNode"]
        },
        {
            name: 'ParenthesisNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isParenthesisNode"]
        },
        {
            name: 'RangeNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isRangeNode"]
        },
        {
            name: 'SymbolNode',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isSymbolNode"]
        },
        {
            name: 'Map',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isMap"]
        },
        {
            name: 'Object',
            test: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isObject"]
        } // order 'Object' last, it matches on other classes too
    ];
    typed.conversions = [
        {
            from: 'number',
            to: 'BigNumber',
            convert: function convert(x) {
                if (!BigNumber) {
                    throwNoBignumber(x);
                } // note: conversion from number to BigNumber can fail if x has >15 digits
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["digits"])(x) > 15) {
                    throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
                }
                return new BigNumber(x);
            }
        },
        {
            from: 'number',
            to: 'Complex',
            convert: function convert(x) {
                if (!Complex) {
                    throwNoComplex(x);
                }
                return new Complex(x, 0);
            }
        },
        {
            from: 'number',
            to: 'string',
            convert: function convert(x) {
                return x + '';
            }
        },
        {
            from: 'BigNumber',
            to: 'Complex',
            convert: function convert(x) {
                if (!Complex) {
                    throwNoComplex(x);
                }
                return new Complex(x.toNumber(), 0);
            }
        },
        {
            from: 'Fraction',
            to: 'BigNumber',
            convert: function convert(x) {
                throw new TypeError('Cannot implicitly convert a Fraction to BigNumber or vice versa. ' + 'Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.');
            }
        },
        {
            from: 'Fraction',
            to: 'Complex',
            convert: function convert(x) {
                if (!Complex) {
                    throwNoComplex(x);
                }
                return new Complex(x.valueOf(), 0);
            }
        },
        {
            from: 'number',
            to: 'Fraction',
            convert: function convert(x) {
                if (!Fraction) {
                    throwNoFraction(x);
                }
                var f = new Fraction(x);
                if (f.valueOf() !== x) {
                    throw new TypeError('Cannot implicitly convert a number to a Fraction when there will be a loss of precision ' + '(value: ' + x + '). ' + 'Use function fraction(x) to convert to Fraction.');
                }
                return f;
            }
        },
        {
            // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
            //  from: 'Fraction',
            //  to: 'number',
            //  convert: function (x) {
            //    return x.valueOf()
            //  }
            // }, {
            from: 'string',
            to: 'number',
            convert: function convert(x) {
                var n = Number(x);
                if (isNaN(n)) {
                    throw new Error('Cannot convert "' + x + '" to a number');
                }
                return n;
            }
        },
        {
            from: 'string',
            to: 'BigNumber',
            convert: function convert(x) {
                if (!BigNumber) {
                    throwNoBignumber(x);
                }
                try {
                    return new BigNumber(x);
                } catch (err) {
                    throw new Error('Cannot convert "' + x + '" to BigNumber');
                }
            }
        },
        {
            from: 'string',
            to: 'Fraction',
            convert: function convert(x) {
                if (!Fraction) {
                    throwNoFraction(x);
                }
                try {
                    return new Fraction(x);
                } catch (err) {
                    throw new Error('Cannot convert "' + x + '" to Fraction');
                }
            }
        },
        {
            from: 'string',
            to: 'Complex',
            convert: function convert(x) {
                if (!Complex) {
                    throwNoComplex(x);
                }
                try {
                    return new Complex(x);
                } catch (err) {
                    throw new Error('Cannot convert "' + x + '" to Complex');
                }
            }
        },
        {
            from: 'boolean',
            to: 'number',
            convert: function convert(x) {
                return +x;
            }
        },
        {
            from: 'boolean',
            to: 'BigNumber',
            convert: function convert(x) {
                if (!BigNumber) {
                    throwNoBignumber(x);
                }
                return new BigNumber(+x);
            }
        },
        {
            from: 'boolean',
            to: 'Fraction',
            convert: function convert(x) {
                if (!Fraction) {
                    throwNoFraction(x);
                }
                return new Fraction(+x);
            }
        },
        {
            from: 'boolean',
            to: 'string',
            convert: function convert(x) {
                return String(x);
            }
        },
        {
            from: 'Array',
            to: 'Matrix',
            convert: function convert(array) {
                if (!DenseMatrix) {
                    throwNoMatrix();
                }
                return new DenseMatrix(array);
            }
        },
        {
            from: 'Matrix',
            to: 'Array',
            convert: function convert(matrix) {
                return matrix.valueOf();
            }
        }
    ];
    return typed;
});
function throwNoBignumber(x) {
    throw new Error("Cannot convert value ".concat(x, " into a BigNumber: no class 'BigNumber' provided"));
}
function throwNoComplex(x) {
    throw new Error("Cannot convert value ".concat(x, " into a Complex number: no class 'Complex' provided"));
}
function throwNoMatrix() {
    throw new Error('Cannot convert array into a Matrix: no class \'DenseMatrix\' provided');
}
function throwNoFraction(x) {
    throw new Error("Cannot convert value ".concat(x, " into a Fraction, no class 'Fraction' provided."));
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// type checks for all known types
//
// note that:
//
// - check by duck-typing on a property like `isUnit`, instead of checking instanceof.
//   instanceof cannot be used because that would not allow to pass data from
//   one instance of math.js to another since each has it's own instance of Unit.
// - check the `isUnit` property via the constructor, so there will be no
//   matches for "fake" instances like plain objects with a property `isUnit`.
//   That is important for security reasons.
// - It must not be possible to override the type checks used internally,
//   for security reasons, so these functions are not exposed in the expression
//   parser.
__turbopack_context__.s([
    "isAccessorNode",
    ()=>isAccessorNode,
    "isArray",
    ()=>isArray,
    "isArrayNode",
    ()=>isArrayNode,
    "isAssignmentNode",
    ()=>isAssignmentNode,
    "isBigNumber",
    ()=>isBigNumber,
    "isBlockNode",
    ()=>isBlockNode,
    "isBoolean",
    ()=>isBoolean,
    "isChain",
    ()=>isChain,
    "isCollection",
    ()=>isCollection,
    "isComplex",
    ()=>isComplex,
    "isConditionalNode",
    ()=>isConditionalNode,
    "isConstantNode",
    ()=>isConstantNode,
    "isDate",
    ()=>isDate,
    "isDenseMatrix",
    ()=>isDenseMatrix,
    "isFraction",
    ()=>isFraction,
    "isFunction",
    ()=>isFunction,
    "isFunctionAssignmentNode",
    ()=>isFunctionAssignmentNode,
    "isFunctionNode",
    ()=>isFunctionNode,
    "isHelp",
    ()=>isHelp,
    "isIndex",
    ()=>isIndex,
    "isIndexNode",
    ()=>isIndexNode,
    "isMatrix",
    ()=>isMatrix,
    "isNode",
    ()=>isNode,
    "isNull",
    ()=>isNull,
    "isNumber",
    ()=>isNumber,
    "isObject",
    ()=>isObject,
    "isObjectNode",
    ()=>isObjectNode,
    "isOperatorNode",
    ()=>isOperatorNode,
    "isParenthesisNode",
    ()=>isParenthesisNode,
    "isRange",
    ()=>isRange,
    "isRangeNode",
    ()=>isRangeNode,
    "isRegExp",
    ()=>isRegExp,
    "isResultSet",
    ()=>isResultSet,
    "isSparseMatrix",
    ()=>isSparseMatrix,
    "isString",
    ()=>isString,
    "isSymbolNode",
    ()=>isSymbolNode,
    "isUndefined",
    ()=>isUndefined,
    "isUnit",
    ()=>isUnit,
    "typeOf",
    ()=>typeOf
]);
function isNumber(x) {
    return typeof x === 'number';
}
function isBigNumber(x) {
    if (!x || typeof x !== 'object' || typeof x.constructor !== 'function') {
        return false;
    }
    if (x.isBigNumber === true && typeof x.constructor.prototype === 'object' && x.constructor.prototype.isBigNumber === true) {
        return true;
    }
    if (typeof x.constructor.isDecimal === 'function' && x.constructor.isDecimal(x) === true) {
        return true;
    }
    return false;
}
function isComplex(x) {
    return x && typeof x === 'object' && Object.getPrototypeOf(x).isComplex === true || false;
}
function isFraction(x) {
    return x && typeof x === 'object' && Object.getPrototypeOf(x).isFraction === true || false;
}
function isUnit(x) {
    return x && x.constructor.prototype.isUnit === true || false;
}
function isString(x) {
    return typeof x === 'string';
}
var isArray = Array.isArray;
function isMatrix(x) {
    return x && x.constructor.prototype.isMatrix === true || false;
}
function isCollection(x) {
    return Array.isArray(x) || isMatrix(x);
}
function isDenseMatrix(x) {
    return x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isSparseMatrix(x) {
    return x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isRange(x) {
    return x && x.constructor.prototype.isRange === true || false;
}
function isIndex(x) {
    return x && x.constructor.prototype.isIndex === true || false;
}
function isBoolean(x) {
    return typeof x === 'boolean';
}
function isResultSet(x) {
    return x && x.constructor.prototype.isResultSet === true || false;
}
function isHelp(x) {
    return x && x.constructor.prototype.isHelp === true || false;
}
function isFunction(x) {
    return typeof x === 'function';
}
function isDate(x) {
    return x instanceof Date;
}
function isRegExp(x) {
    return x instanceof RegExp;
}
function isObject(x) {
    return !!(x && typeof x === 'object' && x.constructor === Object && !isComplex(x) && !isFraction(x));
}
function isNull(x) {
    return x === null;
}
function isUndefined(x) {
    return x === undefined;
}
function isAccessorNode(x) {
    return x && x.isAccessorNode === true && x.constructor.prototype.isNode === true || false;
}
function isArrayNode(x) {
    return x && x.isArrayNode === true && x.constructor.prototype.isNode === true || false;
}
function isAssignmentNode(x) {
    return x && x.isAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isBlockNode(x) {
    return x && x.isBlockNode === true && x.constructor.prototype.isNode === true || false;
}
function isConditionalNode(x) {
    return x && x.isConditionalNode === true && x.constructor.prototype.isNode === true || false;
}
function isConstantNode(x) {
    return x && x.isConstantNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionAssignmentNode(x) {
    return x && x.isFunctionAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionNode(x) {
    return x && x.isFunctionNode === true && x.constructor.prototype.isNode === true || false;
}
function isIndexNode(x) {
    return x && x.isIndexNode === true && x.constructor.prototype.isNode === true || false;
}
function isNode(x) {
    return x && x.isNode === true && x.constructor.prototype.isNode === true || false;
}
function isObjectNode(x) {
    return x && x.isObjectNode === true && x.constructor.prototype.isNode === true || false;
}
function isOperatorNode(x) {
    return x && x.isOperatorNode === true && x.constructor.prototype.isNode === true || false;
}
function isParenthesisNode(x) {
    return x && x.isParenthesisNode === true && x.constructor.prototype.isNode === true || false;
}
function isRangeNode(x) {
    return x && x.isRangeNode === true && x.constructor.prototype.isNode === true || false;
}
function isSymbolNode(x) {
    return x && x.isSymbolNode === true && x.constructor.prototype.isNode === true || false;
}
function isChain(x) {
    return x && x.constructor.prototype.isChain === true || false;
}
function typeOf(x) {
    var t = typeof x;
    if (t === 'object') {
        // JavaScript types
        if (x === null) return 'null';
        if (Array.isArray(x)) return 'Array';
        if (x instanceof Date) return 'Date';
        if (x instanceof RegExp) return 'RegExp'; // math.js types
        if (isBigNumber(x)) return 'BigNumber';
        if (isComplex(x)) return 'Complex';
        if (isFraction(x)) return 'Fraction';
        if (isMatrix(x)) return 'Matrix';
        if (isUnit(x)) return 'Unit';
        if (isIndex(x)) return 'Index';
        if (isRange(x)) return 'Range';
        if (isResultSet(x)) return 'ResultSet';
        if (isNode(x)) return x.type;
        if (isChain(x)) return 'Chain';
        if (isHelp(x)) return 'Help';
        return 'Object';
    }
    if (t === 'function') return 'Function';
    return t; // can be 'string', 'number', 'boolean', ...
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/object.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canDefineProperty",
    ()=>canDefineProperty,
    "clone",
    ()=>clone,
    "deepExtend",
    ()=>deepExtend,
    "deepFlatten",
    ()=>deepFlatten,
    "deepStrictEqual",
    ()=>deepStrictEqual,
    "extend",
    ()=>extend,
    "get",
    ()=>get,
    "hasOwnProperty",
    ()=>hasOwnProperty,
    "isLegacyFactory",
    ()=>isLegacyFactory,
    "lazy",
    ()=>lazy,
    "mapObject",
    ()=>mapObject,
    "pick",
    ()=>pick,
    "pickShallow",
    ()=>pickShallow,
    "set",
    ()=>set,
    "traverse",
    ()=>traverse,
    "values",
    ()=>values
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)");
;
function clone(x) {
    var type = typeof x; // immutable primitive types
    if (type === 'number' || type === 'string' || type === 'boolean' || x === null || x === undefined) {
        return x;
    } // use clone function of the object when available
    if (typeof x.clone === 'function') {
        return x.clone();
    } // array
    if (Array.isArray(x)) {
        return x.map(function(value) {
            return clone(value);
        });
    }
    if (x instanceof Date) return new Date(x.valueOf());
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isBigNumber"])(x)) return x; // bignumbers are immutable
    if (x instanceof RegExp) throw new TypeError('Cannot clone ' + x); // TODO: clone a RegExp
    // object
    return mapObject(x, clone);
}
function mapObject(object, callback) {
    var clone = {};
    for(var key in object){
        if (hasOwnProperty(object, key)) {
            clone[key] = callback(object[key]);
        }
    }
    return clone;
}
function extend(a, b) {
    for(var prop in b){
        if (hasOwnProperty(b, prop)) {
            a[prop] = b[prop];
        }
    }
    return a;
}
function deepExtend(a, b) {
    // TODO: add support for Arrays to deepExtend
    if (Array.isArray(b)) {
        throw new TypeError('Arrays are not supported by deepExtend');
    }
    for(var prop in b){
        // We check against prop not being in Object.prototype or Function.prototype
        // to prevent polluting for example Object.__proto__.
        if (hasOwnProperty(b, prop) && !(prop in Object.prototype) && !(prop in Function.prototype)) {
            if (b[prop] && b[prop].constructor === Object) {
                if (a[prop] === undefined) {
                    a[prop] = {};
                }
                if (a[prop] && a[prop].constructor === Object) {
                    deepExtend(a[prop], b[prop]);
                } else {
                    a[prop] = b[prop];
                }
            } else if (Array.isArray(b[prop])) {
                throw new TypeError('Arrays are not supported by deepExtend');
            } else {
                a[prop] = b[prop];
            }
        }
    }
    return a;
}
function deepStrictEqual(a, b) {
    var prop, i, len;
    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        for(i = 0, len = a.length; i < len; i++){
            if (!deepStrictEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else if (typeof a === 'function') {
        return a === b;
    } else if (a instanceof Object) {
        if (Array.isArray(b) || !(b instanceof Object)) {
            return false;
        }
        for(prop in a){
            // noinspection JSUnfilteredForInLoop
            if (!(prop in b) || !deepStrictEqual(a[prop], b[prop])) {
                return false;
            }
        }
        for(prop in b){
            // noinspection JSUnfilteredForInLoop
            if (!(prop in a)) {
                return false;
            }
        }
        return true;
    } else {
        return a === b;
    }
}
function deepFlatten(nestedObject) {
    var flattenedObject = {};
    _deepFlatten(nestedObject, flattenedObject);
    return flattenedObject;
} // helper function used by deepFlatten
function _deepFlatten(nestedObject, flattenedObject) {
    for(var prop in nestedObject){
        if (hasOwnProperty(nestedObject, prop)) {
            var value = nestedObject[prop];
            if (typeof value === 'object' && value !== null) {
                _deepFlatten(value, flattenedObject);
            } else {
                flattenedObject[prop] = value;
            }
        }
    }
}
function canDefineProperty() {
    // test needed for broken IE8 implementation
    try {
        if (Object.defineProperty) {
            Object.defineProperty({}, 'x', {
                get: function get() {
                    return null;
                }
            });
            return true;
        }
    } catch (e) {}
    return false;
}
function lazy(object, prop, valueResolver) {
    var _uninitialized = true;
    var _value;
    Object.defineProperty(object, prop, {
        get: function get() {
            if (_uninitialized) {
                _value = valueResolver();
                _uninitialized = false;
            }
            return _value;
        },
        set: function set(value) {
            _value = value;
            _uninitialized = false;
        },
        configurable: true,
        enumerable: true
    });
}
function traverse(object, path) {
    if (path && typeof path === 'string') {
        return traverse(object, path.split('.'));
    }
    var obj = object;
    if (path) {
        for(var i = 0; i < path.length; i++){
            var key = path[i];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }
    }
    return obj;
}
function hasOwnProperty(object, property) {
    return object && Object.hasOwnProperty.call(object, property);
}
function isLegacyFactory(object) {
    return object && typeof object.factory === 'function';
}
function get(object, path) {
    if (typeof path === 'string') {
        if (isPath(path)) {
            return get(object, path.split('.'));
        } else {
            return object[path];
        }
    }
    var child = object;
    for(var i = 0; i < path.length; i++){
        var key = path[i];
        child = child ? child[key] : undefined;
    }
    return child;
}
function set(object, path, value) {
    if (typeof path === 'string') {
        if (isPath(path)) {
            return set(object, path.split('.'), value);
        } else {
            object[path] = value;
            return object;
        }
    }
    var child = object;
    for(var i = 0; i < path.length - 1; i++){
        var key = path[i];
        if (child[key] === undefined) {
            child[key] = {};
        }
        child = child[key];
    }
    if (path.length > 0) {
        var lastKey = path[path.length - 1];
        child[lastKey] = value;
    }
    return object;
}
function pick(object, properties, transform) {
    var copy = {};
    for(var i = 0; i < properties.length; i++){
        var key = properties[i];
        var value = get(object, key);
        if (value !== undefined) {
            set(copy, key, transform ? transform(value, key) : value);
        }
    }
    return copy;
}
function pickShallow(object, properties) {
    var copy = {};
    for(var i = 0; i < properties.length; i++){
        var key = properties[i];
        var value = object[key];
        if (value !== undefined) {
            copy[key] = value;
        }
    }
    return copy;
}
function values(object) {
    return Object.keys(object).map((key)=>object[key]);
} // helper function to test whether a string contains a path like 'user.name'
function isPath(str) {
    return str.indexOf('.') !== -1;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DBL_EPSILON",
    ()=>DBL_EPSILON,
    "acosh",
    ()=>acosh,
    "asinh",
    ()=>asinh,
    "atanh",
    ()=>atanh,
    "cbrt",
    ()=>cbrt,
    "copysign",
    ()=>copysign,
    "cosh",
    ()=>cosh,
    "digits",
    ()=>digits,
    "expm1",
    ()=>expm1,
    "format",
    ()=>format,
    "isInteger",
    ()=>isInteger,
    "log10",
    ()=>log10,
    "log1p",
    ()=>log1p,
    "log2",
    ()=>log2,
    "nearlyEqual",
    ()=>nearlyEqual,
    "roundDigits",
    ()=>roundDigits,
    "sign",
    ()=>sign,
    "sinh",
    ()=>sinh,
    "splitNumber",
    ()=>splitNumber,
    "tanh",
    ()=>tanh,
    "toEngineering",
    ()=>toEngineering,
    "toExponential",
    ()=>toExponential,
    "toFixed",
    ()=>toFixed,
    "toPrecision",
    ()=>toPrecision
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)");
;
function isInteger(value) {
    if (typeof value === 'boolean') {
        return true;
    }
    return isFinite(value) ? value === Math.round(value) : false;
}
var sign = /* #__PURE__ */ Math.sign || function(x) {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
};
var log2 = /* #__PURE__ */ Math.log2 || function log2(x) {
    return Math.log(x) / Math.LN2;
};
var log10 = /* #__PURE__ */ Math.log10 || function log10(x) {
    return Math.log(x) / Math.LN10;
};
var log1p = /* #__PURE__ */ Math.log1p || function(x) {
    return Math.log(x + 1);
};
var cbrt = /* #__PURE__ */ Math.cbrt || function cbrt(x) {
    if (x === 0) {
        return x;
    }
    var negate = x < 0;
    var result;
    if (negate) {
        x = -x;
    }
    if (isFinite(x)) {
        result = Math.exp(Math.log(x) / 3); // from https://en.wikipedia.org/wiki/Cube_root#Numerical_methods
        result = (x / (result * result) + 2 * result) / 3;
    } else {
        result = x;
    }
    return negate ? -result : result;
};
var expm1 = /* #__PURE__ */ Math.expm1 || function expm1(x) {
    return x >= 2e-4 || x <= -2e-4 ? Math.exp(x) - 1 : x + x * x / 2 + x * x * x / 6;
};
/**
 * Formats a number in a given base
 * @param {number} n
 * @param {number} base
 * @param {number} size
 * @returns {string}
 */ function formatNumberToBase(n, base, size) {
    var prefixes = {
        2: '0b',
        8: '0o',
        16: '0x'
    };
    var prefix = prefixes[base];
    var suffix = '';
    if (size) {
        if (size < 1) {
            throw new Error('size must be in greater than 0');
        }
        if (!isInteger(size)) {
            throw new Error('size must be an integer');
        }
        if (n > 2 ** (size - 1) - 1 || n < -(2 ** (size - 1))) {
            throw new Error("Value must be in range [-2^".concat(size - 1, ", 2^").concat(size - 1, "-1]"));
        }
        if (!isInteger(n)) {
            throw new Error('Value must be an integer');
        }
        if (n < 0) {
            n = n + 2 ** size;
        }
        suffix = "i".concat(size);
    }
    var sign = '';
    if (n < 0) {
        n = -n;
        sign = '-';
    }
    return "".concat(sign).concat(prefix).concat(n.toString(base)).concat(suffix);
}
function format(value, options) {
    if (typeof options === 'function') {
        // handle format(value, fn)
        return options(value);
    } // handle special cases
    if (value === Infinity) {
        return 'Infinity';
    } else if (value === -Infinity) {
        return '-Infinity';
    } else if (isNaN(value)) {
        return 'NaN';
    } // default values for options
    var notation = 'auto';
    var precision;
    var wordSize;
    if (options) {
        // determine notation from options
        if (options.notation) {
            notation = options.notation;
        } // determine precision from options
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNumber"])(options)) {
            precision = options;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNumber"])(options.precision)) {
            precision = options.precision;
        }
        if (options.wordSize) {
            wordSize = options.wordSize;
            if (typeof wordSize !== 'number') {
                throw new Error('Option "wordSize" must be a number');
            }
        }
    } // handle the various notations
    switch(notation){
        case 'fixed':
            return toFixed(value, precision);
        case 'exponential':
            return toExponential(value, precision);
        case 'engineering':
            return toEngineering(value, precision);
        case 'bin':
            return formatNumberToBase(value, 2, wordSize);
        case 'oct':
            return formatNumberToBase(value, 8, wordSize);
        case 'hex':
            return formatNumberToBase(value, 16, wordSize);
        case 'auto':
            // remove trailing zeros after the decimal point
            return toPrecision(value, precision, options && options).replace(/((\.\d*?)(0+))($|e)/, function() {
                var digits = arguments[2];
                var e = arguments[4];
                return digits !== '.' ? digits + e : e;
            });
        default:
            throw new Error('Unknown notation "' + notation + '". ' + 'Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
    }
}
function splitNumber(value) {
    // parse the input value
    var match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
    if (!match) {
        throw new SyntaxError('Invalid number ' + value);
    }
    var sign = match[1];
    var digits = match[2];
    var exponent = parseFloat(match[4] || '0');
    var dot = digits.indexOf('.');
    exponent += dot !== -1 ? dot - 1 : digits.length - 1;
    var coefficients = digits.replace('.', '') // remove the dot (must be removed before removing leading zeros)
    .replace(/^0*/, function(zeros) {
        // remove leading zeros, add their count to the exponent
        exponent -= zeros.length;
        return '';
    }).replace(/0*$/, '') // remove trailing zeros
    .split('').map(function(d) {
        return parseInt(d);
    });
    if (coefficients.length === 0) {
        coefficients.push(0);
        exponent++;
    }
    return {
        sign,
        coefficients,
        exponent
    };
}
function toEngineering(value, precision) {
    if (isNaN(value) || !isFinite(value)) {
        return String(value);
    }
    var split = splitNumber(value);
    var rounded = roundDigits(split, precision);
    var e = rounded.exponent;
    var c = rounded.coefficients; // find nearest lower multiple of 3 for exponent
    var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNumber"])(precision)) {
        // add zeroes to give correct sig figs
        while(precision > c.length || e - newExp + 1 > c.length){
            c.push(0);
        }
    } else {
        // concatenate coefficients with necessary zeros
        // add zeros if necessary (for example: 1e+8 -> 100e+6)
        var missingZeros = Math.abs(e - newExp) - (c.length - 1);
        for(var i = 0; i < missingZeros; i++){
            c.push(0);
        }
    } // find difference in exponents
    var expDiff = Math.abs(e - newExp);
    var decimalIdx = 1; // push decimal index over by expDiff times
    while(expDiff > 0){
        decimalIdx++;
        expDiff--;
    } // if all coefficient values are zero after the decimal point and precision is unset, don't add a decimal value.
    // otherwise concat with the rest of the coefficients
    var decimals = c.slice(decimalIdx).join('');
    var decimalVal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNumber"])(precision) && decimals.length || decimals.match(/[1-9]/) ? '.' + decimals : '';
    var str = c.slice(0, decimalIdx).join('') + decimalVal + 'e' + (e >= 0 ? '+' : '') + newExp.toString();
    return rounded.sign + str;
}
function toFixed(value, precision) {
    if (isNaN(value) || !isFinite(value)) {
        return String(value);
    }
    var splitValue = splitNumber(value);
    var rounded = typeof precision === 'number' ? roundDigits(splitValue, splitValue.exponent + 1 + precision) : splitValue;
    var c = rounded.coefficients;
    var p = rounded.exponent + 1; // exponent may have changed
    // append zeros if needed
    var pp = p + (precision || 0);
    if (c.length < pp) {
        c = c.concat(zeros(pp - c.length));
    } // prepend zeros if needed
    if (p < 0) {
        c = zeros(-p + 1).concat(c);
        p = 1;
    } // insert a dot if needed
    if (p < c.length) {
        c.splice(p, 0, p === 0 ? '0.' : '.');
    }
    return rounded.sign + c.join('');
}
function toExponential(value, precision) {
    if (isNaN(value) || !isFinite(value)) {
        return String(value);
    } // round if needed, else create a clone
    var split = splitNumber(value);
    var rounded = precision ? roundDigits(split, precision) : split;
    var c = rounded.coefficients;
    var e = rounded.exponent; // append zeros if needed
    if (c.length < precision) {
        c = c.concat(zeros(precision - c.length));
    } // format as `C.CCCe+EEE` or `C.CCCe-EEE`
    var first = c.shift();
    return rounded.sign + first + (c.length > 0 ? '.' + c.join('') : '') + 'e' + (e >= 0 ? '+' : '') + e;
}
function toPrecision(value, precision, options) {
    if (isNaN(value) || !isFinite(value)) {
        return String(value);
    } // determine lower and upper bound for exponential notation.
    var lowerExp = options && options.lowerExp !== undefined ? options.lowerExp : -3;
    var upperExp = options && options.upperExp !== undefined ? options.upperExp : 5;
    var split = splitNumber(value);
    var rounded = precision ? roundDigits(split, precision) : split;
    if (rounded.exponent < lowerExp || rounded.exponent >= upperExp) {
        // exponential notation
        return toExponential(value, precision);
    } else {
        var c = rounded.coefficients;
        var e = rounded.exponent; // append trailing zeros
        if (c.length < precision) {
            c = c.concat(zeros(precision - c.length));
        } // append trailing zeros
        // TODO: simplify the next statement
        c = c.concat(zeros(e - c.length + 1 + (c.length < precision ? precision - c.length : 0))); // prepend zeros
        c = zeros(-e).concat(c);
        var dot = e > 0 ? e : 0;
        if (dot < c.length - 1) {
            c.splice(dot + 1, 0, '.');
        }
        return rounded.sign + c.join('');
    }
}
function roundDigits(split, precision) {
    // create a clone
    var rounded = {
        sign: split.sign,
        coefficients: split.coefficients,
        exponent: split.exponent
    };
    var c = rounded.coefficients; // prepend zeros if needed
    while(precision <= 0){
        c.unshift(0);
        rounded.exponent++;
        precision++;
    }
    if (c.length > precision) {
        var removed = c.splice(precision, c.length - precision);
        if (removed[0] >= 5) {
            var i = precision - 1;
            c[i]++;
            while(c[i] === 10){
                c.pop();
                if (i === 0) {
                    c.unshift(0);
                    rounded.exponent++;
                    i++;
                }
                i--;
                c[i]++;
            }
        }
    }
    return rounded;
}
/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */ function zeros(length) {
    var arr = [];
    for(var i = 0; i < length; i++){
        arr.push(0);
    }
    return arr;
}
function digits(value) {
    return value.toExponential().replace(/e.*$/, '') // remove exponential notation
    .replace(/^0\.?0*|\./, '') // remove decimal point and leading zeros
    .length;
}
var DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;
function nearlyEqual(x, y, epsilon) {
    // if epsilon is null or undefined, test whether x and y are exactly equal
    if (epsilon === null || epsilon === undefined) {
        return x === y;
    }
    if (x === y) {
        return true;
    } // NaN
    if (isNaN(x) || isNaN(y)) {
        return false;
    } // at this point x and y should be finite
    if (isFinite(x) && isFinite(y)) {
        // check numbers are very close, needed when comparing numbers near zero
        var diff = Math.abs(x - y);
        if (diff < DBL_EPSILON) {
            return true;
        } else {
            // use relative error
            return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
        }
    } // Infinite and Number or negative Infinite and positive Infinite cases
    return false;
}
var acosh = Math.acosh || function(x) {
    return Math.log(Math.sqrt(x * x - 1) + x);
};
var asinh = Math.asinh || function(x) {
    return Math.log(Math.sqrt(x * x + 1) + x);
};
var atanh = Math.atanh || function(x) {
    return Math.log((1 + x) / (1 - x)) / 2;
};
var cosh = Math.cosh || function(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
};
var sinh = Math.sinh || function(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
};
var tanh = Math.tanh || function(x) {
    var e = Math.exp(2 * x);
    return (e - 1) / (e + 1);
};
function copysign(x, y) {
    var signx = x > 0 ? true : x < 0 ? false : 1 / x === Infinity;
    var signy = y > 0 ? true : y < 0 ? false : 1 / y === Infinity;
    return signx ^ signy ? -x : x;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/bignumber/formatter.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "format",
    ()=>format,
    "toEngineering",
    ()=>toEngineering,
    "toExponential",
    ()=>toExponential,
    "toFixed",
    ()=>toFixed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
;
/**
 * Formats a BigNumber in a given base
 * @param {BigNumber} n
 * @param {number} base
 * @param {number} size
 * @returns {string}
 */ function formatBigNumberToBase(n, base, size) {
    var BigNumberCtor = n.constructor;
    var big2 = new BigNumberCtor(2);
    var suffix = '';
    if (size) {
        if (size < 1) {
            throw new Error('size must be in greater than 0');
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(size)) {
            throw new Error('size must be an integer');
        }
        if (n.greaterThan(big2.pow(size - 1).sub(1)) || n.lessThan(big2.pow(size - 1).mul(-1))) {
            throw new Error("Value must be in range [-2^".concat(size - 1, ", 2^").concat(size - 1, "-1]"));
        }
        if (!n.isInteger()) {
            throw new Error('Value must be an integer');
        }
        if (n.lessThan(0)) {
            n = n.add(big2.pow(size));
        }
        suffix = "i".concat(size);
    }
    switch(base){
        case 2:
            return "".concat(n.toBinary()).concat(suffix);
        case 8:
            return "".concat(n.toOctal()).concat(suffix);
        case 16:
            return "".concat(n.toHexadecimal()).concat(suffix);
        default:
            throw new Error("Base ".concat(base, " not supported "));
    }
}
function format(value, options) {
    if (typeof options === 'function') {
        // handle format(value, fn)
        return options(value);
    } // handle special cases
    if (!value.isFinite()) {
        return value.isNaN() ? 'NaN' : value.gt(0) ? 'Infinity' : '-Infinity';
    } // default values for options
    var notation = 'auto';
    var precision;
    var wordSize;
    if (options !== undefined) {
        // determine notation from options
        if (options.notation) {
            notation = options.notation;
        } // determine precision from options
        if (typeof options === 'number') {
            precision = options;
        } else if (options.precision) {
            precision = options.precision;
        }
        if (options.wordSize) {
            wordSize = options.wordSize;
            if (typeof wordSize !== 'number') {
                throw new Error('Option "wordSize" must be a number');
            }
        }
    } // handle the various notations
    switch(notation){
        case 'fixed':
            return toFixed(value, precision);
        case 'exponential':
            return toExponential(value, precision);
        case 'engineering':
            return toEngineering(value, precision);
        case 'bin':
            return formatBigNumberToBase(value, 2, wordSize);
        case 'oct':
            return formatBigNumberToBase(value, 8, wordSize);
        case 'hex':
            return formatBigNumberToBase(value, 16, wordSize);
        case 'auto':
            {
                // determine lower and upper bound for exponential notation.
                // TODO: implement support for upper and lower to be BigNumbers themselves
                var lowerExp = options && options.lowerExp !== undefined ? options.lowerExp : -3;
                var upperExp = options && options.upperExp !== undefined ? options.upperExp : 5; // handle special case zero
                if (value.isZero()) return '0'; // determine whether or not to output exponential notation
                var str;
                var rounded = value.toSignificantDigits(precision);
                var exp = rounded.e;
                if (exp >= lowerExp && exp < upperExp) {
                    // normal number notation
                    str = rounded.toFixed();
                } else {
                    // exponential notation
                    str = toExponential(value, precision);
                } // remove trailing zeros after the decimal point
                return str.replace(/((\.\d*?)(0+))($|e)/, function() {
                    var digits = arguments[2];
                    var e = arguments[4];
                    return digits !== '.' ? digits + e : e;
                });
            }
        default:
            throw new Error('Unknown notation "' + notation + '". ' + 'Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
    }
}
function toEngineering(value, precision) {
    // find nearest lower multiple of 3 for exponent
    var e = value.e;
    var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3; // find difference in exponents, and calculate the value without exponent
    var valueWithoutExp = value.mul(Math.pow(10, -newExp));
    var valueStr = valueWithoutExp.toPrecision(precision);
    if (valueStr.indexOf('e') !== -1) {
        valueStr = valueWithoutExp.toString();
    }
    return valueStr + 'e' + (e >= 0 ? '+' : '') + newExp.toString();
}
function toExponential(value, precision) {
    if (precision !== undefined) {
        return value.toExponential(precision - 1); // Note the offset of one
    } else {
        return value.toExponential();
    }
}
function toFixed(value, precision) {
    return value.toFixed(precision);
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/string.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compareText",
    ()=>compareText,
    "endsWith",
    ()=>endsWith,
    "escape",
    ()=>escape,
    "format",
    ()=>format,
    "stringify",
    ()=>stringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$bignumber$2f$formatter$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/bignumber/formatter.js [client] (ecmascript)");
;
;
;
function endsWith(text, search) {
    var start = text.length - search.length;
    var end = text.length;
    return text.substring(start, end) === search;
}
function format(value, options) {
    var result = _format(value, options);
    if (options && typeof options === 'object' && 'truncate' in options && result.length > options.truncate) {
        return result.substring(0, options.truncate - 3) + '...';
    }
    return result;
}
function _format(value, options) {
    if (typeof value === 'number') {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["format"])(value, options);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isBigNumber"])(value)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$bignumber$2f$formatter$2e$js__$5b$client$5d$__$28$ecmascript$29$__["format"])(value, options);
    } // note: we use unsafe duck-typing here to check for Fractions, this is
    // ok here since we're only invoking toString or concatenating its values
    if (looksLikeFraction(value)) {
        if (!options || options.fraction !== 'decimal') {
            // output as ratio, like '1/3'
            return value.s * value.n + '/' + value.d;
        } else {
            // output as decimal, like '0.(3)'
            return value.toString();
        }
    }
    if (Array.isArray(value)) {
        return formatArray(value, options);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isString"])(value)) {
        return '"' + value + '"';
    }
    if (typeof value === 'function') {
        return value.syntax ? String(value.syntax) : 'function';
    }
    if (value && typeof value === 'object') {
        if (typeof value.format === 'function') {
            return value.format(options);
        } else if (value && value.toString(options) !== ({}).toString()) {
            // this object has a non-native toString method, use that one
            return value.toString(options);
        } else {
            var entries = Object.keys(value).map((key)=>{
                return '"' + key + '": ' + format(value[key], options);
            });
            return '{' + entries.join(', ') + '}';
        }
    }
    return String(value);
}
function stringify(value) {
    var text = String(value);
    var escaped = '';
    var i = 0;
    while(i < text.length){
        var c = text.charAt(i);
        if (c === '\\') {
            escaped += c;
            i++;
            c = text.charAt(i);
            if (c === '' || '"\\/bfnrtu'.indexOf(c) === -1) {
                escaped += '\\'; // no valid escape character -> escape it
            }
            escaped += c;
        } else if (c === '"') {
            escaped += '\\"';
        } else {
            escaped += c;
        }
        i++;
    }
    return '"' + escaped + '"';
}
function escape(value) {
    var text = String(value);
    text = text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return text;
}
/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {string} str
 */ function formatArray(array, options) {
    if (Array.isArray(array)) {
        var str = '[';
        var len = array.length;
        for(var i = 0; i < len; i++){
            if (i !== 0) {
                str += ', ';
            }
            str += formatArray(array[i], options);
        }
        str += ']';
        return str;
    } else {
        return format(array, options);
    }
}
/**
 * Check whether a value looks like a Fraction (unsafe duck-type check)
 * @param {*} value
 * @return {boolean}
 */ function looksLikeFraction(value) {
    return value && typeof value === 'object' && typeof value.s === 'number' && typeof value.n === 'number' && typeof value.d === 'number' || false;
}
function compareText(x, y) {
    // we don't want to convert numbers to string, only accept string input
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isString"])(x)) {
        throw new TypeError('Unexpected type of argument in function compareText ' + '(expected: string or Array or Matrix, actual: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["typeOf"])(x) + ', index: 0)');
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isString"])(y)) {
        throw new TypeError('Unexpected type of argument in function compareText ' + '(expected: string or Array or Matrix, actual: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["typeOf"])(y) + ', index: 1)');
    }
    return x === y ? 0 : x > y ? 1 : -1;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/array.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "arraySize",
    ()=>arraySize,
    "contains",
    ()=>contains,
    "filter",
    ()=>filter,
    "filterRegExp",
    ()=>filterRegExp,
    "flatten",
    ()=>flatten,
    "forEach",
    ()=>forEach,
    "generalize",
    ()=>generalize,
    "getArrayDataType",
    ()=>getArrayDataType,
    "identify",
    ()=>identify,
    "initial",
    ()=>initial,
    "join",
    ()=>join,
    "last",
    ()=>last,
    "map",
    ()=>map,
    "processSizesWildcard",
    ()=>processSizesWildcard,
    "reshape",
    ()=>reshape,
    "resize",
    ()=>resize,
    "squeeze",
    ()=>squeeze,
    "unsqueeze",
    ()=>unsqueeze,
    "validate",
    ()=>validate,
    "validateIndex",
    ()=>validateIndex
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$string$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/string.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/error/DimensionError.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$IndexError$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/error/IndexError.js [client] (ecmascript)");
;
;
;
;
;
function arraySize(x) {
    var s = [];
    while(Array.isArray(x)){
        s.push(x.length);
        x = x[0];
    }
    return s;
}
/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @param {number} dim   Current dimension
 * @throws DimensionError
 * @private
 */ function _validate(array, size, dim) {
    var i;
    var len = array.length;
    if (len !== size[dim]) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"](len, size[dim]);
    }
    if (dim < size.length - 1) {
        // recursively validate each child array
        var dimNext = dim + 1;
        for(i = 0; i < len; i++){
            var child = array[i];
            if (!Array.isArray(child)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"](size.length - 1, size.length, '<');
            }
            _validate(array[i], size, dimNext);
        }
    } else {
        // last dimension. none of the childs may be an array
        for(i = 0; i < len; i++){
            if (Array.isArray(array[i])) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"](size.length + 1, size.length, '>');
            }
        }
    }
}
function validate(array, size) {
    var isScalar = size.length === 0;
    if (isScalar) {
        // scalar
        if (Array.isArray(array)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"](array.length, 0);
        }
    } else {
        // array
        _validate(array, size, 0);
    }
}
function validateIndex(index, length) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNumber"])(index) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(index)) {
        throw new TypeError('Index must be an integer (value: ' + index + ')');
    }
    if (index < 0 || typeof length === 'number' && index >= length) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$IndexError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IndexError"](index, length);
    }
}
function resize(array, size, defaultValue) {
    // TODO: add support for scalars, having size=[] ?
    // check the type of the arguments
    if (!Array.isArray(array) || !Array.isArray(size)) {
        throw new TypeError('Array expected');
    }
    if (size.length === 0) {
        throw new Error('Resizing to scalar is not supported');
    } // check whether size contains positive integers
    size.forEach(function(value) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNumber"])(value) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(value) || value < 0) {
            throw new TypeError('Invalid size, must contain positive integers ' + '(size: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$string$2e$js__$5b$client$5d$__$28$ecmascript$29$__["format"])(size) + ')');
        }
    }); // recursively resize the array
    var _defaultValue = defaultValue !== undefined ? defaultValue : 0;
    _resize(array, size, 0, _defaultValue);
    return array;
}
/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {number[]} size       Array with the size of each dimension
 * @param {number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default.
 * @private
 */ function _resize(array, size, dim, defaultValue) {
    var i;
    var elem;
    var oldLen = array.length;
    var newLen = size[dim];
    var minLen = Math.min(oldLen, newLen); // apply new length
    array.length = newLen;
    if (dim < size.length - 1) {
        // non-last dimension
        var dimNext = dim + 1; // resize existing child arrays
        for(i = 0; i < minLen; i++){
            // resize child array
            elem = array[i];
            if (!Array.isArray(elem)) {
                elem = [
                    elem
                ]; // add a dimension
                array[i] = elem;
            }
            _resize(elem, size, dimNext, defaultValue);
        } // create new child arrays
        for(i = minLen; i < newLen; i++){
            // get child array
            elem = [];
            array[i] = elem; // resize new child array
            _resize(elem, size, dimNext, defaultValue);
        }
    } else {
        // last dimension
        // remove dimensions of existing values
        for(i = 0; i < minLen; i++){
            while(Array.isArray(array[i])){
                array[i] = array[i][0];
            }
        } // fill new elements with the default value
        for(i = minLen; i < newLen; i++){
            array[i] = defaultValue;
        }
    }
}
function reshape(array, sizes) {
    var flatArray = flatten(array);
    var currentLength = flatArray.length;
    if (!Array.isArray(array) || !Array.isArray(sizes)) {
        throw new TypeError('Array expected');
    }
    if (sizes.length === 0) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"](0, currentLength, '!=');
    }
    sizes = processSizesWildcard(sizes, currentLength);
    var newLength = product(sizes);
    if (currentLength !== newLength) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"](newLength, currentLength, '!=');
    }
    try {
        return _reshape(flatArray, sizes);
    } catch (e) {
        if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"]) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$DimensionError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["DimensionError"](newLength, currentLength, '!=');
        }
        throw e;
    }
}
function processSizesWildcard(sizes, currentLength) {
    var newLength = product(sizes);
    var processedSizes = sizes.slice();
    var WILDCARD = -1;
    var wildCardIndex = sizes.indexOf(WILDCARD);
    var isMoreThanOneWildcard = sizes.indexOf(WILDCARD, wildCardIndex + 1) >= 0;
    if (isMoreThanOneWildcard) {
        throw new Error('More than one wildcard in sizes');
    }
    var hasWildcard = wildCardIndex >= 0;
    var canReplaceWildcard = currentLength % newLength === 0;
    if (hasWildcard) {
        if (canReplaceWildcard) {
            processedSizes[wildCardIndex] = -currentLength / newLength;
        } else {
            throw new Error('Could not replace wildcard, since ' + currentLength + ' is no multiple of ' + -newLength);
        }
    }
    return processedSizes;
}
/**
 * Computes the product of all array elements.
 * @param {Array<number>} array Array of factors
 * @returns {number}            Product of all elements
 */ function product(array) {
    return array.reduce((prev, curr)=>prev * curr, 1);
}
/**
 * Iteratively re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 */ function _reshape(array, sizes) {
    // testing if there are enough elements for the requested shape
    var tmpArray = array;
    var tmpArray2; // for each dimensions starting by the last one and ignoring the first one
    for(var sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--){
        var size = sizes[sizeIndex];
        tmpArray2 = []; // aggregate the elements of the current tmpArray in elements of the requested size
        var length = tmpArray.length / size;
        for(var i = 0; i < length; i++){
            tmpArray2.push(tmpArray.slice(i * size, (i + 1) * size));
        } // set it as the new tmpArray for the next loop turn or for return
        tmpArray = tmpArray2;
    }
    return tmpArray;
}
function squeeze(array, size) {
    var s = size || arraySize(array); // squeeze outer dimensions
    while(Array.isArray(array) && array.length === 1){
        array = array[0];
        s.shift();
    } // find the first dimension to be squeezed
    var dims = s.length;
    while(s[dims - 1] === 1){
        dims--;
    } // squeeze inner dimensions
    if (dims < s.length) {
        array = _squeeze(array, dims, 0);
        s.length = dims;
    }
    return array;
}
/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */ function _squeeze(array, dims, dim) {
    var i, ii;
    if (dim < dims) {
        var next = dim + 1;
        for(i = 0, ii = array.length; i < ii; i++){
            array[i] = _squeeze(array[i], dims, next);
        }
    } else {
        while(Array.isArray(array)){
            array = array[0];
        }
    }
    return array;
}
function unsqueeze(array, dims, outer, size) {
    var s = size || arraySize(array); // unsqueeze outer dimensions
    if (outer) {
        for(var i = 0; i < outer; i++){
            array = [
                array
            ];
            s.unshift(1);
        }
    } // unsqueeze inner dimensions
    array = _unsqueeze(array, dims, 0);
    while(s.length < dims){
        s.push(1);
    }
    return array;
}
/**
 * Recursively unsqueeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */ function _unsqueeze(array, dims, dim) {
    var i, ii;
    if (Array.isArray(array)) {
        var next = dim + 1;
        for(i = 0, ii = array.length; i < ii; i++){
            array[i] = _unsqueeze(array[i], dims, next);
        }
    } else {
        for(var d = dim; d < dims; d++){
            array = [
                array
            ];
        }
    }
    return array;
}
function flatten(array) {
    if (!Array.isArray(array)) {
        // if not an array, return as is
        return array;
    }
    var flat = [];
    array.forEach(function callback(value) {
        if (Array.isArray(value)) {
            value.forEach(callback); // traverse through sub-arrays recursively
        } else {
            flat.push(value);
        }
    });
    return flat;
}
function map(array, callback) {
    return Array.prototype.map.call(array, callback);
}
function forEach(array, callback) {
    Array.prototype.forEach.call(array, callback);
}
function filter(array, callback) {
    if (arraySize(array).length !== 1) {
        throw new Error('Only one dimensional matrices supported');
    }
    return Array.prototype.filter.call(array, callback);
}
function filterRegExp(array, regexp) {
    if (arraySize(array).length !== 1) {
        throw new Error('Only one dimensional matrices supported');
    }
    return Array.prototype.filter.call(array, (entry)=>regexp.test(entry));
}
function join(array, separator) {
    return Array.prototype.join.call(array, separator);
}
function identify(a) {
    if (!Array.isArray(a)) {
        throw new TypeError('Array input expected');
    }
    if (a.length === 0) {
        return a;
    }
    var b = [];
    var count = 0;
    b[0] = {
        value: a[0],
        identifier: 0
    };
    for(var i = 1; i < a.length; i++){
        if (a[i] === a[i - 1]) {
            count++;
        } else {
            count = 0;
        }
        b.push({
            value: a[i],
            identifier: count
        });
    }
    return b;
}
function generalize(a) {
    if (!Array.isArray(a)) {
        throw new TypeError('Array input expected');
    }
    if (a.length === 0) {
        return a;
    }
    var b = [];
    for(var i = 0; i < a.length; i++){
        b.push(a[i].value);
    }
    return b;
}
function getArrayDataType(array, typeOf) {
    var type; // to hold type info
    var length = 0; // to hold length value to ensure it has consistent sizes
    for(var i = 0; i < array.length; i++){
        var item = array[i];
        var isArray = Array.isArray(item); // Saving the target matrix row size
        if (i === 0 && isArray) {
            length = item.length;
        } // If the current item is an array but the length does not equal the targetVectorSize
        if (isArray && item.length !== length) {
            return undefined;
        }
        var itemType = isArray ? getArrayDataType(item, typeOf) // recurse into a nested array
         : typeOf(item);
        if (type === undefined) {
            type = itemType; // first item
        } else if (type !== itemType) {
            return 'mixed';
        } else {}
    }
    return type;
}
function last(array) {
    return array[array.length - 1];
}
function initial(array) {
    return array.slice(0, array.length - 1);
}
function contains(array, item) {
    return array.indexOf(item) !== -1;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/factory.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertDependencies",
    ()=>assertDependencies,
    "create",
    ()=>create,
    "factory",
    ()=>factory,
    "isFactory",
    ()=>isFactory,
    "isOptionalDependency",
    ()=>isOptionalDependency,
    "sortFactories",
    ()=>sortFactories,
    "stripOptionalNotation",
    ()=>stripOptionalNotation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/object.js [client] (ecmascript)");
;
;
function factory(name, dependencies, create, meta) {
    function assertAndCreate(scope) {
        // we only pass the requested dependencies to the factory function
        // to prevent functions to rely on dependencies that are not explicitly
        // requested.
        var deps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["pickShallow"])(scope, dependencies.map(stripOptionalNotation));
        assertDependencies(name, dependencies, scope);
        return create(deps);
    }
    assertAndCreate.isFactory = true;
    assertAndCreate.fn = name;
    assertAndCreate.dependencies = dependencies.slice().sort();
    if (meta) {
        assertAndCreate.meta = meta;
    }
    return assertAndCreate;
}
function sortFactories(factories) {
    var factoriesByName = {};
    factories.forEach((factory)=>{
        factoriesByName[factory.fn] = factory;
    });
    function containsDependency(factory, dependency) {
        // TODO: detect circular references
        if (isFactory(factory)) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["contains"])(factory.dependencies, dependency.fn || dependency.name)) {
                return true;
            }
            if (factory.dependencies.some((d)=>containsDependency(factoriesByName[d], dependency))) {
                return true;
            }
        }
        return false;
    }
    var sorted = [];
    function addFactory(factory) {
        var index = 0;
        while(index < sorted.length && !containsDependency(sorted[index], factory)){
            index++;
        }
        sorted.splice(index, 0, factory);
    } // sort regular factory functions
    factories.filter(isFactory).forEach(addFactory); // sort legacy factory functions AFTER the regular factory functions
    factories.filter((factory)=>!isFactory(factory)).forEach(addFactory);
    return sorted;
} // TODO: comment or cleanup if unused in the end
function create(factories) {
    var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    sortFactories(factories).forEach((factory)=>factory(scope));
    return scope;
}
function isFactory(obj) {
    return typeof obj === 'function' && typeof obj.fn === 'string' && Array.isArray(obj.dependencies);
}
function assertDependencies(name, dependencies, scope) {
    var allDefined = dependencies.filter((dependency)=>!isOptionalDependency(dependency)) // filter optionals
    .every((dependency)=>scope[dependency] !== undefined);
    if (!allDefined) {
        var missingDependencies = dependencies.filter((dependency)=>scope[dependency] === undefined); // TODO: create a custom error class for this, a MathjsError or something like that
        throw new Error("Cannot create function \"".concat(name, "\", ") + "some dependencies are missing: ".concat(missingDependencies.map((d)=>"\"".concat(d, "\"")).join(', '), "."));
    }
}
function isOptionalDependency(dependency) {
    return dependency && dependency[0] === '?';
}
function stripOptionalNotation(dependency) {
    return dependency && dependency[0] === '?' ? dependency.slice(1) : dependency;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/lruQueue.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// (c) 2018, Mariusz Nowak
// SPDX-License-Identifier: ISC
// Derived from https://github.com/medikoo/lru-queue
__turbopack_context__.s([
    "lruQueue",
    ()=>lruQueue
]);
function lruQueue(limit) {
    var size = 0;
    var base = 1;
    var queue = Object.create(null);
    var map = Object.create(null);
    var index = 0;
    var del = function del(id) {
        var oldIndex = map[id];
        if (!oldIndex) return;
        delete queue[oldIndex];
        delete map[id];
        --size;
        if (base !== oldIndex) return;
        if (!size) {
            index = 0;
            base = 1;
            return;
        }
        while(!hasOwnProperty.call(queue, ++base)){
            continue;
        }
    };
    limit = Math.abs(limit);
    return {
        hit: function hit(id) {
            var oldIndex = map[id];
            var nuIndex = ++index;
            queue[nuIndex] = id;
            map[id] = nuIndex;
            if (!oldIndex) {
                ++size;
                if (size <= limit) return undefined;
                id = queue[base];
                del(id);
                return id;
            }
            delete queue[oldIndex];
            if (base !== oldIndex) return undefined;
            while(!hasOwnProperty.call(queue, ++base)){
                continue;
            }
            return undefined;
        },
        delete: del,
        clear: function clear() {
            size = index = 0;
            base = 1;
            queue = Object.create(null);
            map = Object.create(null);
        }
    };
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/function.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// function utils
__turbopack_context__.s([
    "maxArgumentCount",
    ()=>maxArgumentCount,
    "memoize",
    ()=>memoize,
    "memoizeCompare",
    ()=>memoizeCompare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$lruQueue$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/lruQueue.js [client] (ecmascript)");
;
function memoize(fn) {
    var { hasher, limit } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    limit = limit == null ? Number.POSITIVE_INFINITY : limit;
    hasher = hasher == null ? JSON.stringify : hasher;
    return function memoize() {
        if (typeof memoize.cache !== 'object') {
            memoize.cache = {
                values: new Map(),
                lru: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$lruQueue$2e$js__$5b$client$5d$__$28$ecmascript$29$__["lruQueue"])(limit || Number.POSITIVE_INFINITY)
            };
        }
        var args = [];
        for(var i = 0; i < arguments.length; i++){
            args[i] = arguments[i];
        }
        var hash = hasher(args);
        if (memoize.cache.values.has(hash)) {
            memoize.cache.lru.hit(hash);
            return memoize.cache.values.get(hash);
        }
        var newVal = fn.apply(fn, args);
        memoize.cache.values.set(hash, newVal);
        memoize.cache.values.delete(memoize.cache.lru.hit(hash));
        return newVal;
    };
}
function memoizeCompare(fn, isEqual) {
    var memoize = function memoize() {
        var args = [];
        for(var i = 0; i < arguments.length; i++){
            args[i] = arguments[i];
        }
        for(var c = 0; c < memoize.cache.length; c++){
            var cached = memoize.cache[c];
            if (isEqual(args, cached.args)) {
                // TODO: move this cache entry to the top so recently used entries move up?
                return cached.res;
            }
        }
        var res = fn.apply(fn, args);
        memoize.cache.unshift({
            args,
            res
        });
        return res;
    };
    memoize.cache = [];
    return memoize;
}
function maxArgumentCount(fn) {
    return Object.keys(fn.signatures || {}).reduce(function(args, signature) {
        var count = (signature.match(/,/g) || []).length + 1;
        return Math.max(args, count);
    }, -1);
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/bignumber/constants.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createBigNumberE",
    ()=>createBigNumberE,
    "createBigNumberPhi",
    ()=>createBigNumberPhi,
    "createBigNumberPi",
    ()=>createBigNumberPi,
    "createBigNumberTau",
    ()=>createBigNumberTau
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/function.js [client] (ecmascript)");
;
var createBigNumberE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memoize"])(function(BigNumber) {
    return new BigNumber(1).exp();
}, {
    hasher
});
var createBigNumberPhi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memoize"])(function(BigNumber) {
    return new BigNumber(1).plus(new BigNumber(5).sqrt()).div(2);
}, {
    hasher
});
var createBigNumberPi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memoize"])(function(BigNumber) {
    return BigNumber.acos(-1);
}, {
    hasher
});
var createBigNumberTau = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$function$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memoize"])(function(BigNumber) {
    return createBigNumberPi(BigNumber).times(2);
}, {
    hasher
});
/**
 * Create a hash for a BigNumber constructor function. The created has is
 * the configured precision
 * @param {Array} args         Supposed to contain a single entry with
 *                             a BigNumber constructor
 * @return {number} precision
 * @private
 */ function hasher(args) {
    return args[0].precision;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/customs.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSafeProperties",
    ()=>getSafeProperties,
    "getSafeProperty",
    ()=>getSafeProperty,
    "hasSafeProperty",
    ()=>hasSafeProperty,
    "isPlainObject",
    ()=>isPlainObject,
    "isSafeMethod",
    ()=>isSafeMethod,
    "isSafeProperty",
    ()=>isSafeProperty,
    "setSafeProperty",
    ()=>setSafeProperty,
    "validateSafeMethod",
    ()=>validateSafeMethod
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/object.js [client] (ecmascript)");
;
/**
 * Get a property of a plain object
 * Throws an error in case the object is not a plain object or the
 * property is not defined on the object itself
 * @param {Object} object
 * @param {string} prop
 * @return {*} Returns the property value when safe
 */ function getSafeProperty(object, prop) {
    // only allow getting safe properties of a plain object
    if (isPlainObject(object) && isSafeProperty(object, prop)) {
        return object[prop];
    }
    if (typeof object[prop] === 'function' && isSafeMethod(object, prop)) {
        throw new Error('Cannot access method "' + prop + '" as a property');
    }
    throw new Error('No access to property "' + prop + '"');
}
/**
 * Set a property on a plain object.
 * Throws an error in case the object is not a plain object or the
 * property would override an inherited property like .constructor or .toString
 * @param {Object} object
 * @param {string} prop
 * @param {*} value
 * @return {*} Returns the value
 */ // TODO: merge this function into access.js?
function setSafeProperty(object, prop, value) {
    // only allow setting safe properties of a plain object
    if (isPlainObject(object) && isSafeProperty(object, prop)) {
        object[prop] = value;
        return value;
    }
    throw new Error('No access to property "' + prop + '"');
}
function getSafeProperties(object) {
    return Object.keys(object).filter((prop)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["hasOwnProperty"])(object, prop));
}
function hasSafeProperty(object, prop) {
    return prop in object;
}
/**
 * Test whether a property is safe to use for an object.
 * For example .toString and .constructor are not safe
 * @param {string} prop
 * @return {boolean} Returns true when safe
 */ function isSafeProperty(object, prop) {
    if (!object || typeof object !== 'object') {
        return false;
    } // SAFE: whitelisted
    // e.g length
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["hasOwnProperty"])(safeNativeProperties, prop)) {
        return true;
    } // UNSAFE: inherited from Object prototype
    // e.g constructor
    if (prop in Object.prototype) {
        // 'in' is used instead of hasOwnProperty for nodejs v0.10
        // which is inconsistent on root prototypes. It is safe
        // here because Object.prototype is a root object
        return false;
    } // UNSAFE: inherited from Function prototype
    // e.g call, apply
    if (prop in Function.prototype) {
        // 'in' is used instead of hasOwnProperty for nodejs v0.10
        // which is inconsistent on root prototypes. It is safe
        // here because Function.prototype is a root object
        return false;
    }
    return true;
}
/**
 * Validate whether a method is safe.
 * Throws an error when that's not the case.
 * @param {Object} object
 * @param {string} method
 */ // TODO: merge this function into assign.js?
function validateSafeMethod(object, method) {
    if (!isSafeMethod(object, method)) {
        throw new Error('No access to method "' + method + '"');
    }
}
/**
 * Check whether a method is safe.
 * Throws an error when that's not the case (for example for `constructor`).
 * @param {Object} object
 * @param {string} method
 * @return {boolean} Returns true when safe, false otherwise
 */ function isSafeMethod(object, method) {
    if (object === null || object === undefined || typeof object[method] !== 'function') {
        return false;
    } // UNSAFE: ghosted
    // e.g overridden toString
    // Note that IE10 doesn't support __proto__ and we can't do this check there.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["hasOwnProperty"])(object, method) && Object.getPrototypeOf && method in Object.getPrototypeOf(object)) {
        return false;
    } // SAFE: whitelisted
    // e.g toString
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__["hasOwnProperty"])(safeNativeMethods, method)) {
        return true;
    } // UNSAFE: inherited from Object prototype
    // e.g constructor
    if (method in Object.prototype) {
        // 'in' is used instead of hasOwnProperty for nodejs v0.10
        // which is inconsistent on root prototypes. It is safe
        // here because Object.prototype is a root object
        return false;
    } // UNSAFE: inherited from Function prototype
    // e.g call, apply
    if (method in Function.prototype) {
        // 'in' is used instead of hasOwnProperty for nodejs v0.10
        // which is inconsistent on root prototypes. It is safe
        // here because Function.prototype is a root object
        return false;
    }
    return true;
}
function isPlainObject(object) {
    return typeof object === 'object' && object && object.constructor === Object;
}
var safeNativeProperties = {
    length: true,
    name: true
};
var safeNativeMethods = {
    toString: true,
    valueOf: true,
    toLocaleString: true
};
;
;
;
;
;
;
;
;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/map.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ObjectWrappingMap",
    ()=>ObjectWrappingMap,
    "assign",
    ()=>assign,
    "createEmptyMap",
    ()=>createEmptyMap,
    "createMap",
    ()=>createMap,
    "isMap",
    ()=>isMap,
    "toObject",
    ()=>toObject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$customs$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/customs.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)");
;
;
class ObjectWrappingMap {
    keys() {
        return Object.keys(this.wrappedObject);
    }
    get(key) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$customs$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getSafeProperty"])(this.wrappedObject, key);
    }
    set(key, value) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$customs$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setSafeProperty"])(this.wrappedObject, key, value);
        return this;
    }
    has(key) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$customs$2e$js__$5b$client$5d$__$28$ecmascript$29$__["hasSafeProperty"])(this.wrappedObject, key);
    }
    constructor(object){
        this.wrappedObject = object;
    }
}
function createEmptyMap() {
    return new Map();
}
function createMap(mapOrObject) {
    if (!mapOrObject) {
        return createEmptyMap();
    }
    if (isMap(mapOrObject)) {
        return mapOrObject;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isObject"])(mapOrObject)) {
        return new ObjectWrappingMap(mapOrObject);
    }
    throw new Error('createMap can create maps from objects or Maps');
}
function toObject(map) {
    if (map instanceof ObjectWrappingMap) {
        return map.wrappedObject;
    }
    var object = {};
    for (var key of map.keys()){
        var value = map.get(key);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$customs$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setSafeProperty"])(object, key, value);
    }
    return object;
}
function isMap(object) {
    // We can use the fast instanceof, or a slower duck typing check.
    // The duck typing method needs to cover enough methods to not be confused with DenseMatrix.
    if (!object) {
        return false;
    }
    return object instanceof Map || object instanceof ObjectWrappingMap || typeof object.set === 'function' && typeof object.get === 'function' && typeof object.keys === 'function' && typeof object.has === 'function';
}
function assign(map) {
    for(var _len = arguments.length, objects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        objects[_key - 1] = arguments[_key];
    }
    for (var args of objects){
        if (!args) {
            continue;
        }
        if (isMap(args)) {
            for (var key of args.keys()){
                map.set(key, args.get(key));
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isObject"])(args)) {
            for (var _key2 of Object.keys(args)){
                map.set(_key2, args[_key2]);
            }
        }
    }
    return map;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/switch.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Transpose a matrix
 * @param {Array} mat
 * @returns {Array} ret
 * @private
 */ __turbopack_context__.s([
    "_switch",
    ()=>_switch
]);
function _switch(mat) {
    var I = mat.length;
    var J = mat[0].length;
    var i, j;
    var ret = [];
    for(j = 0; j < J; j++){
        var tmp = [];
        for(i = 0; i < I; i++){
            tmp.push(mat[i][j]);
        }
        ret.push(tmp);
    }
    return ret;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/collection.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "containsCollections",
    ()=>containsCollections,
    "deepForEach",
    ()=>deepForEach,
    "deepMap",
    ()=>deepMap,
    "reduce",
    ()=>reduce,
    "scatter",
    ()=>scatter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/is.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$IndexError$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/error/IndexError.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$switch$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/switch.js [client] (ecmascript)");
;
;
;
;
function containsCollections(array) {
    for(var i = 0; i < array.length; i++){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isCollection"])(array[i])) {
            return true;
        }
    }
    return false;
}
function deepForEach(array, callback) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isMatrix"])(array)) {
        array = array.valueOf();
    }
    for(var i = 0, ii = array.length; i < ii; i++){
        var value = array[i];
        if (Array.isArray(value)) {
            deepForEach(value, callback);
        } else {
            callback(value);
        }
    }
}
function deepMap(array, callback, skipZeros) {
    if (array && typeof array.map === 'function') {
        // TODO: replace array.map with a for loop to improve performance
        return array.map(function(x) {
            return deepMap(x, callback, skipZeros);
        });
    } else {
        return callback(array);
    }
}
function reduce(mat, dim, callback) {
    var size = Array.isArray(mat) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["arraySize"])(mat) : mat.size();
    if (dim < 0 || dim >= size.length) {
        // TODO: would be more clear when throwing a DimensionError here
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$error$2f$IndexError$2e$js__$5b$client$5d$__$28$ecmascript$29$__["IndexError"](dim, size.length);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$is$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isMatrix"])(mat)) {
        return mat.create(_reduce(mat.valueOf(), dim, callback));
    } else {
        return _reduce(mat, dim, callback);
    }
}
/**
 * Recursively reduce a matrix
 * @param {Array} mat
 * @param {number} dim
 * @param {Function} callback
 * @returns {Array} ret
 * @private
 */ function _reduce(mat, dim, callback) {
    var i, ret, val, tran;
    if (dim <= 0) {
        if (!Array.isArray(mat[0])) {
            val = mat[0];
            for(i = 1; i < mat.length; i++){
                val = callback(val, mat[i]);
            }
            return val;
        } else {
            tran = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$switch$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_switch"])(mat);
            ret = [];
            for(i = 0; i < tran.length; i++){
                ret[i] = _reduce(tran[i], dim - 1, callback);
            }
            return ret;
        }
    } else {
        ret = [];
        for(i = 0; i < mat.length; i++){
            ret[i] = _reduce(mat[i], dim - 1, callback);
        }
        return ret;
    }
} // TODO: document function scatter
function scatter(a, j, w, x, u, mark, cindex, f, inverse, update, value) {
    // a arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr; // vars
    var k, k0, k1, i; // check we need to process values (pattern matrix)
    if (x) {
        // values in j
        for(k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++){
            // row
            i = aindex[k]; // check value exists in current j
            if (w[i] !== mark) {
                // i is new entry in j
                w[i] = mark; // add i to pattern of C
                cindex.push(i); // x(i) = A, check we need to call function this time
                if (update) {
                    // copy value to workspace calling callback function
                    x[i] = inverse ? f(avalues[k], value) : f(value, avalues[k]); // function was called on current row
                    u[i] = mark;
                } else {
                    // copy value to workspace
                    x[i] = avalues[k];
                }
            } else {
                // i exists in C already
                x[i] = inverse ? f(avalues[k], x[i]) : f(x[i], avalues[k]); // function was called on current row
                u[i] = mark;
            }
        }
    } else {
        // values in j
        for(k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++){
            // row
            i = aindex[k]; // check value exists in current j
            if (w[i] !== mark) {
                // i is new entry in j
                w[i] = mark; // add i to pattern of C
                cindex.push(i);
            } else {
                // indicate function was called on current row
                u[i] = mark;
            }
        }
    }
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/bignumber/bitwise.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Bitwise and for Bignumbers
 *
 * Special Cases:
 *   N &  n =  N
 *   n &  0 =  0
 *   n & -1 =  n
 *   n &  n =  n
 *   I &  I =  I
 *  -I & -I = -I
 *   I & -I =  0
 *   I &  n =  n
 *   I & -n =  I
 *  -I &  n =  0
 *  -I & -n = -I
 *
 * @param {BigNumber} x
 * @param {BigNumber} y
 * @return {BigNumber} Result of `x` & `y`, is fully precise
 * @private
 */ __turbopack_context__.s([
    "bitAndBigNumber",
    ()=>bitAndBigNumber,
    "bitNotBigNumber",
    ()=>bitNotBigNumber,
    "bitOrBigNumber",
    ()=>bitOrBigNumber,
    "bitXor",
    ()=>bitXor,
    "bitwise",
    ()=>bitwise,
    "leftShiftBigNumber",
    ()=>leftShiftBigNumber,
    "rightArithShiftBigNumber",
    ()=>rightArithShiftBigNumber
]);
function bitAndBigNumber(x, y) {
    if (x.isFinite() && !x.isInteger() || y.isFinite() && !y.isInteger()) {
        throw new Error('Integers expected in function bitAnd');
    }
    var BigNumber = x.constructor;
    if (x.isNaN() || y.isNaN()) {
        return new BigNumber(NaN);
    }
    if (x.isZero() || y.eq(-1) || x.eq(y)) {
        return x;
    }
    if (y.isZero() || x.eq(-1)) {
        return y;
    }
    if (!x.isFinite() || !y.isFinite()) {
        if (!x.isFinite() && !y.isFinite()) {
            if (x.isNegative() === y.isNegative()) {
                return x;
            }
            return new BigNumber(0);
        }
        if (!x.isFinite()) {
            if (y.isNegative()) {
                return x;
            }
            if (x.isNegative()) {
                return new BigNumber(0);
            }
            return y;
        }
        if (!y.isFinite()) {
            if (x.isNegative()) {
                return y;
            }
            if (y.isNegative()) {
                return new BigNumber(0);
            }
            return x;
        }
    }
    return bitwise(x, y, function(a, b) {
        return a & b;
    });
}
function bitNotBigNumber(x) {
    if (x.isFinite() && !x.isInteger()) {
        throw new Error('Integer expected in function bitNot');
    }
    var BigNumber = x.constructor;
    var prevPrec = BigNumber.precision;
    BigNumber.config({
        precision: 1E9
    });
    var result = x.plus(new BigNumber(1));
    result.s = -result.s || null;
    BigNumber.config({
        precision: prevPrec
    });
    return result;
}
function bitOrBigNumber(x, y) {
    if (x.isFinite() && !x.isInteger() || y.isFinite() && !y.isInteger()) {
        throw new Error('Integers expected in function bitOr');
    }
    var BigNumber = x.constructor;
    if (x.isNaN() || y.isNaN()) {
        return new BigNumber(NaN);
    }
    var negOne = new BigNumber(-1);
    if (x.isZero() || y.eq(negOne) || x.eq(y)) {
        return y;
    }
    if (y.isZero() || x.eq(negOne)) {
        return x;
    }
    if (!x.isFinite() || !y.isFinite()) {
        if (!x.isFinite() && !x.isNegative() && y.isNegative() || x.isNegative() && !y.isNegative() && !y.isFinite()) {
            return negOne;
        }
        if (x.isNegative() && y.isNegative()) {
            return x.isFinite() ? x : y;
        }
        return x.isFinite() ? y : x;
    }
    return bitwise(x, y, function(a, b) {
        return a | b;
    });
}
function bitwise(x, y, func) {
    var BigNumber = x.constructor;
    var xBits, yBits;
    var xSign = +(x.s < 0);
    var ySign = +(y.s < 0);
    if (xSign) {
        xBits = decCoefficientToBinaryString(bitNotBigNumber(x));
        for(var i = 0; i < xBits.length; ++i){
            xBits[i] ^= 1;
        }
    } else {
        xBits = decCoefficientToBinaryString(x);
    }
    if (ySign) {
        yBits = decCoefficientToBinaryString(bitNotBigNumber(y));
        for(var _i = 0; _i < yBits.length; ++_i){
            yBits[_i] ^= 1;
        }
    } else {
        yBits = decCoefficientToBinaryString(y);
    }
    var minBits, maxBits, minSign;
    if (xBits.length <= yBits.length) {
        minBits = xBits;
        maxBits = yBits;
        minSign = xSign;
    } else {
        minBits = yBits;
        maxBits = xBits;
        minSign = ySign;
    }
    var shortLen = minBits.length;
    var longLen = maxBits.length;
    var expFuncVal = func(xSign, ySign) ^ 1;
    var outVal = new BigNumber(expFuncVal ^ 1);
    var twoPower = new BigNumber(1);
    var two = new BigNumber(2);
    var prevPrec = BigNumber.precision;
    BigNumber.config({
        precision: 1E9
    });
    while(shortLen > 0){
        if (func(minBits[--shortLen], maxBits[--longLen]) === expFuncVal) {
            outVal = outVal.plus(twoPower);
        }
        twoPower = twoPower.times(two);
    }
    while(longLen > 0){
        if (func(minSign, maxBits[--longLen]) === expFuncVal) {
            outVal = outVal.plus(twoPower);
        }
        twoPower = twoPower.times(two);
    }
    BigNumber.config({
        precision: prevPrec
    });
    if (expFuncVal === 0) {
        outVal.s = -outVal.s;
    }
    return outVal;
}
/* Extracted from decimal.js, and edited to specialize. */ function decCoefficientToBinaryString(x) {
    // Convert to string
    var a = x.d; // array with digits
    var r = a[0] + '';
    for(var i = 1; i < a.length; ++i){
        var s = a[i] + '';
        for(var z = 7 - s.length; z--;){
            s = '0' + s;
        }
        r += s;
    }
    var j = r.length;
    while(r.charAt(j) === '0'){
        j--;
    }
    var xe = x.e;
    var str = r.slice(0, j + 1 || 1);
    var strL = str.length;
    if (xe > 0) {
        if (++xe > strL) {
            // Append zeros.
            xe -= strL;
            while(xe--){
                str += '0';
            }
        } else if (xe < strL) {
            str = str.slice(0, xe) + '.' + str.slice(xe);
        }
    } // Convert from base 10 (decimal) to base 2
    var arr = [
        0
    ];
    for(var _i2 = 0; _i2 < str.length;){
        var arrL = arr.length;
        while(arrL--){
            arr[arrL] *= 10;
        }
        arr[0] += parseInt(str.charAt(_i2++)); // convert to int
        for(var _j = 0; _j < arr.length; ++_j){
            if (arr[_j] > 1) {
                if (arr[_j + 1] === null || arr[_j + 1] === undefined) {
                    arr[_j + 1] = 0;
                }
                arr[_j + 1] += arr[_j] >> 1;
                arr[_j] &= 1;
            }
        }
    }
    return arr.reverse();
}
function bitXor(x, y) {
    if (x.isFinite() && !x.isInteger() || y.isFinite() && !y.isInteger()) {
        throw new Error('Integers expected in function bitXor');
    }
    var BigNumber = x.constructor;
    if (x.isNaN() || y.isNaN()) {
        return new BigNumber(NaN);
    }
    if (x.isZero()) {
        return y;
    }
    if (y.isZero()) {
        return x;
    }
    if (x.eq(y)) {
        return new BigNumber(0);
    }
    var negOne = new BigNumber(-1);
    if (x.eq(negOne)) {
        return bitNotBigNumber(y);
    }
    if (y.eq(negOne)) {
        return bitNotBigNumber(x);
    }
    if (!x.isFinite() || !y.isFinite()) {
        if (!x.isFinite() && !y.isFinite()) {
            return negOne;
        }
        return new BigNumber(x.isNegative() === y.isNegative() ? Infinity : -Infinity);
    }
    return bitwise(x, y, function(a, b) {
        return a ^ b;
    });
}
function leftShiftBigNumber(x, y) {
    if (x.isFinite() && !x.isInteger() || y.isFinite() && !y.isInteger()) {
        throw new Error('Integers expected in function leftShift');
    }
    var BigNumber = x.constructor;
    if (x.isNaN() || y.isNaN() || y.isNegative() && !y.isZero()) {
        return new BigNumber(NaN);
    }
    if (x.isZero() || y.isZero()) {
        return x;
    }
    if (!x.isFinite() && !y.isFinite()) {
        return new BigNumber(NaN);
    } // Math.pow(2, y) is fully precise for y < 55, and fast
    if (y.lt(55)) {
        return x.times(Math.pow(2, y.toNumber()) + '');
    }
    return x.times(new BigNumber(2).pow(y));
}
function rightArithShiftBigNumber(x, y) {
    if (x.isFinite() && !x.isInteger() || y.isFinite() && !y.isInteger()) {
        throw new Error('Integers expected in function rightArithShift');
    }
    var BigNumber = x.constructor;
    if (x.isNaN() || y.isNaN() || y.isNegative() && !y.isZero()) {
        return new BigNumber(NaN);
    }
    if (x.isZero() || y.isZero()) {
        return x;
    }
    if (!y.isFinite()) {
        if (x.isNegative()) {
            return new BigNumber(-1);
        }
        if (!x.isFinite()) {
            return new BigNumber(NaN);
        }
        return new BigNumber(0);
    } // Math.pow(2, y) is fully precise for y < 55, and fast
    if (y.lt(55)) {
        return x.div(Math.pow(2, y.toNumber()) + '').floor();
    }
    return x.div(new BigNumber(2).pow(y)).floor();
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/product.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** @param {number} i
 *  @param {number} n
 *  @returns {number} product of i to n
 */ __turbopack_context__.s([
    "product",
    ()=>product
]);
function product(i, n) {
    if (n < i) {
        return 1;
    }
    if (n === i) {
        return n;
    }
    var half = n + i >> 1; // divide (n + i) by 2 and truncate to integer
    return product(i, half) * product(half + 1, n);
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/bignumber/nearlyEqual.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Compares two BigNumbers.
 * @param {BigNumber} x       First value to compare
 * @param {BigNumber} y       Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
 */ __turbopack_context__.s([
    "nearlyEqual",
    ()=>nearlyEqual
]);
function nearlyEqual(x, y, epsilon) {
    // if epsilon is null or undefined, test whether x and y are exactly equal
    if (epsilon === null || epsilon === undefined) {
        return x.eq(y);
    } // use "==" operator, handles infinities
    if (x.eq(y)) {
        return true;
    } // NaN
    if (x.isNaN() || y.isNaN()) {
        return false;
    } // at this point x and y should be finite
    if (x.isFinite() && y.isFinite()) {
        // check numbers are very close, needed when comparing numbers near zero
        var diff = x.minus(y).abs();
        if (diff.isZero()) {
            return true;
        } else {
            // use relative error
            var max = x.constructor.max(x.abs(), y.abs());
            return diff.lte(max.times(epsilon));
        }
    } // Infinite and Number or negative Infinite and positive Infinite cases
    return false;
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/complex.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "complexEquals",
    ()=>complexEquals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
;
function complexEquals(x, y, epsilon) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["nearlyEqual"])(x.re, y.re, epsilon) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["nearlyEqual"])(x.im, y.im, epsilon);
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/utils/noop.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "noBignumber",
    ()=>noBignumber,
    "noFraction",
    ()=>noFraction,
    "noIndex",
    ()=>noIndex,
    "noMatrix",
    ()=>noMatrix,
    "noSubset",
    ()=>noSubset
]);
function noBignumber() {
    throw new Error('No "bignumber" implementation available');
}
function noFraction() {
    throw new Error('No "fraction" implementation available');
}
function noMatrix() {
    throw new Error('No "matrix" implementation available');
}
function noIndex() {
    throw new Error('No "index" implementation available');
}
function noSubset() {
    throw new Error('No "matrix" implementation available');
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/error/DimensionError.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Create a range error with the message:
 *     'Dimension mismatch (<actual size> != <expected size>)'
 * @param {number | number[]} actual        The actual size
 * @param {number | number[]} expected      The expected size
 * @param {string} [relation='!=']          Optional relation between actual
 *                                          and expected size: '!=', '<', etc.
 * @extends RangeError
 */ __turbopack_context__.s([
    "DimensionError",
    ()=>DimensionError
]);
function DimensionError(actual, expected, relation) {
    if (!(this instanceof DimensionError)) {
        throw new SyntaxError('Constructor must be called with the new operator');
    }
    this.actual = actual;
    this.expected = expected;
    this.relation = relation;
    this.message = 'Dimension mismatch (' + (Array.isArray(actual) ? '[' + actual.join(', ') + ']' : actual) + ' ' + (this.relation || '!=') + ' ' + (Array.isArray(expected) ? '[' + expected.join(', ') + ']' : expected) + ')';
    this.stack = new Error().stack;
}
DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = 'DimensionError';
DimensionError.prototype.isDimensionError = true;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/error/IndexError.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Create a range error with the message:
 *     'Index out of range (index < min)'
 *     'Index out of range (index < max)'
 *
 * @param {number} index     The actual index
 * @param {number} [min=0]   Minimum index (included)
 * @param {number} [max]     Maximum index (excluded)
 * @extends RangeError
 */ __turbopack_context__.s([
    "IndexError",
    ()=>IndexError
]);
function IndexError(index, min, max) {
    if (!(this instanceof IndexError)) {
        throw new SyntaxError('Constructor must be called with the new operator');
    }
    this.index = index;
    if (arguments.length < 3) {
        this.min = 0;
        this.max = min;
    } else {
        this.min = min;
        this.max = max;
    }
    if (this.min !== undefined && this.index < this.min) {
        this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
    } else if (this.max !== undefined && this.index >= this.max) {
        this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
    } else {
        this.message = 'Index out of range (' + this.index + ')';
    }
    this.stack = new Error().stack;
}
IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = 'IndexError';
IndexError.prototype.isIndexError = true;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/error/ArgumentsError.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {string} fn     Function name
 * @param {number} count  Actual argument count
 * @param {number} min    Minimum required argument count
 * @param {number} [max]  Maximum required argument count
 * @extends Error
 */ __turbopack_context__.s([
    "ArgumentsError",
    ()=>ArgumentsError
]);
function ArgumentsError(fn, count, min, max) {
    if (!(this instanceof ArgumentsError)) {
        throw new SyntaxError('Constructor must be called with the new operator');
    }
    this.fn = fn;
    this.count = count;
    this.min = min;
    this.max = max;
    this.message = 'Wrong number of arguments in function ' + fn + ' (' + count + ' provided, ' + min + (max !== undefined && max !== null ? '-' + max : '') + ' expected)';
    this.stack = new Error().stack;
}
ArgumentsError.prototype = new Error();
ArgumentsError.prototype.constructor = Error;
ArgumentsError.prototype.name = 'ArgumentsError';
ArgumentsError.prototype.isArgumentsError = true;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/version.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "version",
    ()=>version
]);
var version = '10.6.4'; // Note: This file is automatically generated when building math.js.
 // Changes made in this file will be overwritten.
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/constants.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "e",
    ()=>e,
    "phi",
    ()=>phi,
    "pi",
    ()=>pi,
    "tau",
    ()=>tau
]);
var pi = Math.PI;
var tau = 2 * Math.PI;
var e = Math.E;
var phi = 1.6180339887498948; // eslint-disable-line no-loss-of-precision
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/arithmetic.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "absNumber",
    ()=>absNumber,
    "addNumber",
    ()=>addNumber,
    "cbrtNumber",
    ()=>cbrtNumber,
    "cubeNumber",
    ()=>cubeNumber,
    "divideNumber",
    ()=>divideNumber,
    "expNumber",
    ()=>expNumber,
    "expm1Number",
    ()=>expm1Number,
    "gcdNumber",
    ()=>gcdNumber,
    "lcmNumber",
    ()=>lcmNumber,
    "log10Number",
    ()=>log10Number,
    "log1pNumber",
    ()=>log1pNumber,
    "log2Number",
    ()=>log2Number,
    "logNumber",
    ()=>logNumber,
    "modNumber",
    ()=>modNumber,
    "multiplyNumber",
    ()=>multiplyNumber,
    "normNumber",
    ()=>normNumber,
    "nthRootNumber",
    ()=>nthRootNumber,
    "powNumber",
    ()=>powNumber,
    "roundNumber",
    ()=>roundNumber,
    "signNumber",
    ()=>signNumber,
    "sqrtNumber",
    ()=>sqrtNumber,
    "squareNumber",
    ()=>squareNumber,
    "subtractNumber",
    ()=>subtractNumber,
    "unaryMinusNumber",
    ()=>unaryMinusNumber,
    "unaryPlusNumber",
    ()=>unaryPlusNumber,
    "xgcdNumber",
    ()=>xgcdNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
;
var n1 = 'number';
var n2 = 'number, number';
function absNumber(a) {
    return Math.abs(a);
}
absNumber.signature = n1;
function addNumber(a, b) {
    return a + b;
}
addNumber.signature = n2;
function subtractNumber(a, b) {
    return a - b;
}
subtractNumber.signature = n2;
function multiplyNumber(a, b) {
    return a * b;
}
multiplyNumber.signature = n2;
function divideNumber(a, b) {
    return a / b;
}
divideNumber.signature = n2;
function unaryMinusNumber(x) {
    return -x;
}
unaryMinusNumber.signature = n1;
function unaryPlusNumber(x) {
    return x;
}
unaryPlusNumber.signature = n1;
function cbrtNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["cbrt"])(x);
}
cbrtNumber.signature = n1;
function cubeNumber(x) {
    return x * x * x;
}
cubeNumber.signature = n1;
function expNumber(x) {
    return Math.exp(x);
}
expNumber.signature = n1;
function expm1Number(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["expm1"])(x);
}
expm1Number.signature = n1;
function gcdNumber(a, b) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(a) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(b)) {
        throw new Error('Parameters in function gcd must be integer numbers');
    } // https://en.wikipedia.org/wiki/Euclidean_algorithm
    var r;
    while(b !== 0){
        r = a % b;
        a = b;
        b = r;
    }
    return a < 0 ? -a : a;
}
gcdNumber.signature = n2;
function lcmNumber(a, b) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(a) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(b)) {
        throw new Error('Parameters in function lcm must be integer numbers');
    }
    if (a === 0 || b === 0) {
        return 0;
    } // https://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    var t;
    var prod = a * b;
    while(b !== 0){
        t = b;
        b = a % t;
        a = t;
    }
    return Math.abs(prod / a);
}
lcmNumber.signature = n2;
function logNumber(x, y) {
    if (y) {
        return Math.log(x) / Math.log(y);
    }
    return Math.log(x);
}
function log10Number(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["log10"])(x);
}
log10Number.signature = n1;
function log2Number(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["log2"])(x);
}
log2Number.signature = n1;
function log1pNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["log1p"])(x);
}
log1pNumber.signature = n1;
function modNumber(x, y) {
    if (y > 0) {
        // We don't use JavaScript's % operator here as this doesn't work
        // correctly for x < 0 and x === 0
        // see https://en.wikipedia.org/wiki/Modulo_operation
        return x - y * Math.floor(x / y);
    } else if (y === 0) {
        return x;
    } else {
        // y < 0
        // TODO: implement mod for a negative divisor
        throw new Error('Cannot calculate mod for a negative divisor');
    }
}
modNumber.signature = n2;
function nthRootNumber(a) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var inv = root < 0;
    if (inv) {
        root = -root;
    }
    if (root === 0) {
        throw new Error('Root must be non-zero');
    }
    if (a < 0 && Math.abs(root) % 2 !== 1) {
        throw new Error('Root must be odd when a is negative.');
    } // edge cases zero and infinity
    if (a === 0) {
        return inv ? Infinity : 0;
    }
    if (!isFinite(a)) {
        return inv ? 0 : a;
    }
    var x = Math.pow(Math.abs(a), 1 / root); // If a < 0, we require that root is an odd integer,
    // so (-1) ^ (1/root) = -1
    x = a < 0 ? -x : x;
    return inv ? 1 / x : x; // Very nice algorithm, but fails with nthRoot(-2, 3).
// Newton's method has some well-known problems at times:
// https://en.wikipedia.org/wiki/Newton%27s_method#Failure_analysis
/*
  let x = 1 // Initial guess
  let xPrev = 1
  let i = 0
  const iMax = 10000
  do {
    const delta = (a / Math.pow(x, root - 1) - x) / root
    xPrev = x
    x = x + delta
    i++
  }
  while (xPrev !== x && i < iMax)
   if (xPrev !== x) {
    throw new Error('Function nthRoot failed to converge')
  }
   return inv ? 1 / x : x
  */ }
function signNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["sign"])(x);
}
signNumber.signature = n1;
function sqrtNumber(x) {
    return Math.sqrt(x);
}
sqrtNumber.signature = n1;
function squareNumber(x) {
    return x * x;
}
squareNumber.signature = n1;
function xgcdNumber(a, b) {
    // source: https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t; // used to swap two variables
    var q; // quotient
    var r; // remainder
    var x = 0;
    var lastx = 1;
    var y = 1;
    var lasty = 0;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(a) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(b)) {
        throw new Error('Parameters in function xgcd must be integer numbers');
    }
    while(b){
        q = Math.floor(a / b);
        r = a - q * b;
        t = x;
        x = lastx - q * x;
        lastx = t;
        t = y;
        y = lasty - q * y;
        lasty = t;
        a = b;
        b = r;
    }
    var res;
    if (a < 0) {
        res = [
            -a,
            -lastx,
            -lasty
        ];
    } else {
        res = [
            a,
            a ? lastx : 0,
            lasty
        ];
    }
    return res;
}
xgcdNumber.signature = n2;
function powNumber(x, y) {
    // x^Infinity === 0 if -1 < x < 1
    // A real number 0 is returned instead of complex(0)
    if (x * x < 1 && y === Infinity || x * x > 1 && y === -Infinity) {
        return 0;
    }
    return Math.pow(x, y);
}
powNumber.signature = n2;
function roundNumber(value) {
    var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(decimals) || decimals < 0 || decimals > 15) {
        throw new Error('Number of decimals in function round must be an integer from 0 to 15 inclusive');
    }
    return parseFloat((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["toFixed"])(value, decimals));
}
function normNumber(x) {
    return Math.abs(x);
}
normNumber.signature = n1;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/trigonometry.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acosNumber",
    ()=>acosNumber,
    "acoshNumber",
    ()=>acoshNumber,
    "acotNumber",
    ()=>acotNumber,
    "acothNumber",
    ()=>acothNumber,
    "acscNumber",
    ()=>acscNumber,
    "acschNumber",
    ()=>acschNumber,
    "asecNumber",
    ()=>asecNumber,
    "asechNumber",
    ()=>asechNumber,
    "asinNumber",
    ()=>asinNumber,
    "asinhNumber",
    ()=>asinhNumber,
    "atan2Number",
    ()=>atan2Number,
    "atanNumber",
    ()=>atanNumber,
    "atanhNumber",
    ()=>atanhNumber,
    "cosNumber",
    ()=>cosNumber,
    "coshNumber",
    ()=>coshNumber,
    "cotNumber",
    ()=>cotNumber,
    "cothNumber",
    ()=>cothNumber,
    "cscNumber",
    ()=>cscNumber,
    "cschNumber",
    ()=>cschNumber,
    "secNumber",
    ()=>secNumber,
    "sechNumber",
    ()=>sechNumber,
    "sinNumber",
    ()=>sinNumber,
    "sinhNumber",
    ()=>sinhNumber,
    "tanNumber",
    ()=>tanNumber,
    "tanhNumber",
    ()=>tanhNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
;
var n1 = 'number';
var n2 = 'number, number';
function acosNumber(x) {
    return Math.acos(x);
}
acosNumber.signature = n1;
function acoshNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["acosh"])(x);
}
acoshNumber.signature = n1;
function acotNumber(x) {
    return Math.atan(1 / x);
}
acotNumber.signature = n1;
function acothNumber(x) {
    return isFinite(x) ? (Math.log((x + 1) / x) + Math.log(x / (x - 1))) / 2 : 0;
}
acothNumber.signature = n1;
function acscNumber(x) {
    return Math.asin(1 / x);
}
acscNumber.signature = n1;
function acschNumber(x) {
    var xInv = 1 / x;
    return Math.log(xInv + Math.sqrt(xInv * xInv + 1));
}
acschNumber.signature = n1;
function asecNumber(x) {
    return Math.acos(1 / x);
}
asecNumber.signature = n1;
function asechNumber(x) {
    var xInv = 1 / x;
    var ret = Math.sqrt(xInv * xInv - 1);
    return Math.log(ret + xInv);
}
asechNumber.signature = n1;
function asinNumber(x) {
    return Math.asin(x);
}
asinNumber.signature = n1;
function asinhNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["asinh"])(x);
}
asinhNumber.signature = n1;
function atanNumber(x) {
    return Math.atan(x);
}
atanNumber.signature = n1;
function atan2Number(y, x) {
    return Math.atan2(y, x);
}
atan2Number.signature = n2;
function atanhNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["atanh"])(x);
}
atanhNumber.signature = n1;
function cosNumber(x) {
    return Math.cos(x);
}
cosNumber.signature = n1;
function coshNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["cosh"])(x);
}
coshNumber.signature = n1;
function cotNumber(x) {
    return 1 / Math.tan(x);
}
cotNumber.signature = n1;
function cothNumber(x) {
    var e = Math.exp(2 * x);
    return (e + 1) / (e - 1);
}
cothNumber.signature = n1;
function cscNumber(x) {
    return 1 / Math.sin(x);
}
cscNumber.signature = n1;
function cschNumber(x) {
    // consider values close to zero (+/-)
    if (x === 0) {
        return Number.POSITIVE_INFINITY;
    } else {
        return Math.abs(2 / (Math.exp(x) - Math.exp(-x))) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["sign"])(x);
    }
}
cschNumber.signature = n1;
function secNumber(x) {
    return 1 / Math.cos(x);
}
secNumber.signature = n1;
function sechNumber(x) {
    return 2 / (Math.exp(x) + Math.exp(-x));
}
sechNumber.signature = n1;
function sinNumber(x) {
    return Math.sin(x);
}
sinNumber.signature = n1;
function sinhNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["sinh"])(x);
}
sinhNumber.signature = n1;
function tanNumber(x) {
    return Math.tan(x);
}
tanNumber.signature = n1;
function tanhNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["tanh"])(x);
}
tanhNumber.signature = n1;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/bitwise.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bitAndNumber",
    ()=>bitAndNumber,
    "bitNotNumber",
    ()=>bitNotNumber,
    "bitOrNumber",
    ()=>bitOrNumber,
    "bitXorNumber",
    ()=>bitXorNumber,
    "leftShiftNumber",
    ()=>leftShiftNumber,
    "rightArithShiftNumber",
    ()=>rightArithShiftNumber,
    "rightLogShiftNumber",
    ()=>rightLogShiftNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
;
var n1 = 'number';
var n2 = 'number, number';
function bitAndNumber(x, y) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(y)) {
        throw new Error('Integers expected in function bitAnd');
    }
    return x & y;
}
bitAndNumber.signature = n2;
function bitNotNumber(x) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x)) {
        throw new Error('Integer expected in function bitNot');
    }
    return ~x;
}
bitNotNumber.signature = n1;
function bitOrNumber(x, y) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(y)) {
        throw new Error('Integers expected in function bitOr');
    }
    return x | y;
}
bitOrNumber.signature = n2;
function bitXorNumber(x, y) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(y)) {
        throw new Error('Integers expected in function bitXor');
    }
    return x ^ y;
}
bitXorNumber.signature = n2;
function leftShiftNumber(x, y) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(y)) {
        throw new Error('Integers expected in function leftShift');
    }
    return x << y;
}
leftShiftNumber.signature = n2;
function rightArithShiftNumber(x, y) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(y)) {
        throw new Error('Integers expected in function rightArithShift');
    }
    return x >> y;
}
rightArithShiftNumber.signature = n2;
function rightLogShiftNumber(x, y) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(y)) {
        throw new Error('Integers expected in function rightLogShift');
    }
    return x >>> y;
}
rightLogShiftNumber.signature = n2;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/combinations.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "combinationsNumber",
    ()=>combinationsNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$product$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/product.js [client] (ecmascript)");
;
;
function combinationsNumber(n, k) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(n) || n < 0) {
        throw new TypeError('Positive integer value expected in function combinations');
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(k) || k < 0) {
        throw new TypeError('Positive integer value expected in function combinations');
    }
    if (k > n) {
        throw new TypeError('k must be less than or equal to n');
    }
    var nMinusk = n - k;
    var answer = 1;
    var firstnumerator = k < nMinusk ? nMinusk + 1 : k + 1;
    var nextdivisor = 2;
    var lastdivisor = k < nMinusk ? k : nMinusk; // balance multiplications and divisions to try to keep intermediate values
    // in exact-integer range as long as possible
    for(var nextnumerator = firstnumerator; nextnumerator <= n; ++nextnumerator){
        answer *= nextnumerator;
        while(nextdivisor <= lastdivisor && answer % nextdivisor === 0){
            answer /= nextdivisor;
            ++nextdivisor;
        }
    } // for big n, k, floating point may have caused weirdness in remainder
    if (nextdivisor <= lastdivisor) {
        answer /= (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$product$2e$js__$5b$client$5d$__$28$ecmascript$29$__["product"])(nextdivisor, lastdivisor);
    }
    return answer;
}
combinationsNumber.signature = 'number, number';
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/utils.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isIntegerNumber",
    ()=>isIntegerNumber,
    "isNaNNumber",
    ()=>isNaNNumber,
    "isNegativeNumber",
    ()=>isNegativeNumber,
    "isPositiveNumber",
    ()=>isPositiveNumber,
    "isZeroNumber",
    ()=>isZeroNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
;
var n1 = 'number';
function isIntegerNumber(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(x);
}
isIntegerNumber.signature = n1;
function isNegativeNumber(x) {
    return x < 0;
}
isNegativeNumber.signature = n1;
function isPositiveNumber(x) {
    return x > 0;
}
isPositiveNumber.signature = n1;
function isZeroNumber(x) {
    return x === 0;
}
isZeroNumber.signature = n1;
function isNaNNumber(x) {
    return Number.isNaN(x);
}
isNaNNumber.signature = n1;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/probability.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable no-loss-of-precision */ __turbopack_context__.s([
    "gammaG",
    ()=>gammaG,
    "gammaNumber",
    ()=>gammaNumber,
    "gammaP",
    ()=>gammaP,
    "lgammaG",
    ()=>lgammaG,
    "lgammaN",
    ()=>lgammaN,
    "lgammaNumber",
    ()=>lgammaNumber,
    "lgammaSeries",
    ()=>lgammaSeries,
    "lnSqrt2PI",
    ()=>lnSqrt2PI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/number.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$product$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/product.js [client] (ecmascript)");
;
;
function gammaNumber(n) {
    var x;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$number$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isInteger"])(n)) {
        if (n <= 0) {
            return isFinite(n) ? Infinity : NaN;
        }
        if (n > 171) {
            return Infinity; // Will overflow
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$product$2e$js__$5b$client$5d$__$28$ecmascript$29$__["product"])(1, n - 1);
    }
    if (n < 0.5) {
        return Math.PI / (Math.sin(Math.PI * n) * gammaNumber(1 - n));
    }
    if (n >= 171.35) {
        return Infinity; // will overflow
    }
    if (n > 85.0) {
        // Extended Stirling Approx
        var twoN = n * n;
        var threeN = twoN * n;
        var fourN = threeN * n;
        var fiveN = fourN * n;
        return Math.sqrt(2 * Math.PI / n) * Math.pow(n / Math.E, n) * (1 + 1 / (12 * n) + 1 / (288 * twoN) - 139 / (51840 * threeN) - 571 / (2488320 * fourN) + 163879 / (209018880 * fiveN) + 5246819 / (75246796800 * fiveN * n));
    }
    --n;
    x = gammaP[0];
    for(var i = 1; i < gammaP.length; ++i){
        x += gammaP[i] / (n + i);
    }
    var t = n + gammaG + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}
gammaNumber.signature = 'number'; // TODO: comment on the variables g and p
var gammaG = 4.7421875;
var gammaP = [
    0.99999999999999709182,
    57.156235665862923517,
    -59.597960355475491248,
    14.136097974741747174,
    -0.49191381609762019978,
    0.33994649984811888699e-4,
    0.46523628927048575665e-4,
    -0.98374475304879564677e-4,
    0.15808870322491248884e-3,
    -0.21026444172410488319e-3,
    0.21743961811521264320e-3,
    -0.16431810653676389022e-3,
    0.84418223983852743293e-4,
    -0.26190838401581408670e-4,
    0.36899182659531622704e-5
]; // lgamma implementation ref: https://mrob.com/pub/ries/lanczos-gamma.html#code
var lnSqrt2PI = 0.91893853320467274178;
var lgammaG = 5; // Lanczos parameter "g"
var lgammaN = 7; // Range of coefficients "n"
var lgammaSeries = [
    1.000000000190015,
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.1208650973866179e-2,
    -0.5395239384953e-5
];
function lgammaNumber(n) {
    if (n < 0) return NaN;
    if (n === 0) return Infinity;
    if (!isFinite(n)) return n;
    if (n < 0.5) {
        // Use Euler's reflection formula:
        // gamma(z) = PI / (sin(PI * z) * gamma(1 - z))
        return Math.log(Math.PI / Math.sin(Math.PI * n)) - lgammaNumber(1 - n);
    } // Compute the logarithm of the Gamma function using the Lanczos method
    n = n - 1;
    var base = n + lgammaG + 0.5; // Base of the Lanczos exponential
    var sum = lgammaSeries[0]; // We start with the terms that have the smallest coefficients and largest denominator
    for(var i = lgammaN - 1; i >= 1; i--){
        sum += lgammaSeries[i] / (n + i);
    }
    return lnSqrt2PI + (n + 0.5) * Math.log(base) - base + Math.log(sum);
}
lgammaNumber.signature = 'number';
}),
"[project]/frontend/node_modules/mathjs/lib/esm/plain/number/logical.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "andNumber",
    ()=>andNumber,
    "notNumber",
    ()=>notNumber,
    "orNumber",
    ()=>orNumber,
    "xorNumber",
    ()=>xorNumber
]);
var n1 = 'number';
var n2 = 'number, number';
function notNumber(x) {
    return !x;
}
notNumber.signature = n1;
function orNumber(x, y) {
    return !!(x || y);
}
orNumber.signature = n2;
function xorNumber(x, y) {
    return !!x !== !!y;
}
xorNumber.signature = n2;
function andNumber(x, y) {
    return !!(x && y);
}
andNumber.signature = n2;
}),
"[project]/frontend/node_modules/mathjs/lib/esm/constants.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createE",
    ()=>createE,
    "createFalse",
    ()=>createFalse,
    "createI",
    ()=>createI,
    "createInfinity",
    ()=>createInfinity,
    "createLN10",
    ()=>createLN10,
    "createLN2",
    ()=>createLN2,
    "createLOG10E",
    ()=>createLOG10E,
    "createLOG2E",
    ()=>createLOG2E,
    "createNaN",
    ()=>createNaN,
    "createNull",
    ()=>createNull,
    "createPhi",
    ()=>createPhi,
    "createPi",
    ()=>createPi,
    "createSQRT1_2",
    ()=>createSQRT1_2,
    "createSQRT2",
    ()=>createSQRT2,
    "createTau",
    ()=>createTau,
    "createTrue",
    ()=>createTrue,
    "createUppercaseE",
    ()=>createUppercaseE,
    "createUppercasePi",
    ()=>createUppercasePi,
    "createVersion",
    ()=>createVersion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/factory.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$version$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/version.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$bignumber$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/bignumber/constants.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$plain$2f$number$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/plain/number/constants.js [client] (ecmascript)");
;
;
;
;
var createTrue = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])('true', [], ()=>true);
var createFalse = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])('false', [], ()=>false);
var createNull = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])('null', [], ()=>null);
var createInfinity = /* #__PURE__ */ recreateFactory('Infinity', [
    'config',
    '?BigNumber'
], (_ref)=>{
    var { config, BigNumber } = _ref;
    return config.number === 'BigNumber' ? new BigNumber(Infinity) : Infinity;
});
var createNaN = /* #__PURE__ */ recreateFactory('NaN', [
    'config',
    '?BigNumber'
], (_ref2)=>{
    var { config, BigNumber } = _ref2;
    return config.number === 'BigNumber' ? new BigNumber(NaN) : NaN;
});
var createPi = /* #__PURE__ */ recreateFactory('pi', [
    'config',
    '?BigNumber'
], (_ref3)=>{
    var { config, BigNumber } = _ref3;
    return config.number === 'BigNumber' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$bignumber$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createBigNumberPi"])(BigNumber) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$plain$2f$number$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["pi"];
});
var createTau = /* #__PURE__ */ recreateFactory('tau', [
    'config',
    '?BigNumber'
], (_ref4)=>{
    var { config, BigNumber } = _ref4;
    return config.number === 'BigNumber' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$bignumber$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createBigNumberTau"])(BigNumber) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$plain$2f$number$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["tau"];
});
var createE = /* #__PURE__ */ recreateFactory('e', [
    'config',
    '?BigNumber'
], (_ref5)=>{
    var { config, BigNumber } = _ref5;
    return config.number === 'BigNumber' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$bignumber$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createBigNumberE"])(BigNumber) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$plain$2f$number$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["e"];
}); // golden ratio, (1+sqrt(5))/2
var createPhi = /* #__PURE__ */ recreateFactory('phi', [
    'config',
    '?BigNumber'
], (_ref6)=>{
    var { config, BigNumber } = _ref6;
    return config.number === 'BigNumber' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$bignumber$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createBigNumberPhi"])(BigNumber) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$plain$2f$number$2f$constants$2e$js__$5b$client$5d$__$28$ecmascript$29$__["phi"];
});
var createLN2 = /* #__PURE__ */ recreateFactory('LN2', [
    'config',
    '?BigNumber'
], (_ref7)=>{
    var { config, BigNumber } = _ref7;
    return config.number === 'BigNumber' ? new BigNumber(2).ln() : Math.LN2;
});
var createLN10 = /* #__PURE__ */ recreateFactory('LN10', [
    'config',
    '?BigNumber'
], (_ref8)=>{
    var { config, BigNumber } = _ref8;
    return config.number === 'BigNumber' ? new BigNumber(10).ln() : Math.LN10;
});
var createLOG2E = /* #__PURE__ */ recreateFactory('LOG2E', [
    'config',
    '?BigNumber'
], (_ref9)=>{
    var { config, BigNumber } = _ref9;
    return config.number === 'BigNumber' ? new BigNumber(1).div(new BigNumber(2).ln()) : Math.LOG2E;
});
var createLOG10E = /* #__PURE__ */ recreateFactory('LOG10E', [
    'config',
    '?BigNumber'
], (_ref10)=>{
    var { config, BigNumber } = _ref10;
    return config.number === 'BigNumber' ? new BigNumber(1).div(new BigNumber(10).ln()) : Math.LOG10E;
});
var createSQRT1_2 = /* #__PURE__ */ recreateFactory('SQRT1_2', [
    'config',
    '?BigNumber'
], (_ref11)=>{
    var { config, BigNumber } = _ref11;
    return config.number === 'BigNumber' ? new BigNumber('0.5').sqrt() : Math.SQRT1_2;
});
var createSQRT2 = /* #__PURE__ */ recreateFactory('SQRT2', [
    'config',
    '?BigNumber'
], (_ref12)=>{
    var { config, BigNumber } = _ref12;
    return config.number === 'BigNumber' ? new BigNumber(2).sqrt() : Math.SQRT2;
});
var createI = /* #__PURE__ */ recreateFactory('i', [
    'Complex'
], (_ref13)=>{
    var { Complex } = _ref13;
    return Complex.I;
}); // for backward compatibility with v5
var createUppercasePi = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])('PI', [
    'pi'
], (_ref14)=>{
    var { pi } = _ref14;
    return pi;
});
var createUppercaseE = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])('E', [
    'e'
], (_ref15)=>{
    var { e } = _ref15;
    return e;
});
var createVersion = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])('version', [], ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$version$2e$js__$5b$client$5d$__$28$ecmascript$29$__["version"]); // helper function to create a factory with a flag recreateOnConfigChange
// idea: allow passing optional properties to be attached to the factory function as 4th argument?
function recreateFactory(name, dependencies, create) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])(name, dependencies, create, {
        recreateOnConfigChange: true
    });
}
}),
"[project]/frontend/node_modules/mathjs/lib/esm/json/replacer.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createReplacer",
    ()=>createReplacer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mathjs/lib/esm/utils/factory.js [client] (ecmascript)");
;
var name = 'replacer';
var dependencies = [];
var createReplacer = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mathjs$2f$lib$2f$esm$2f$utils$2f$factory$2e$js__$5b$client$5d$__$28$ecmascript$29$__["factory"])(name, dependencies, ()=>{
    /**
   * Stringify data types into their JSON representation.
   * Most data types can be serialized using their `.toJSON` method,
   * but not all, for example the number `Infinity`. For these cases you have
   * to use the replacer. Example usage:
   *
   *     JSON.stringify([2, Infinity], math.replacer)
   *
   * @param {string} key
   * @param {*} value
   * @returns {*} Returns the replaced object
   */ return function replacer(key, value) {
        // the numeric values Infinitiy, -Infinity, and NaN cannot be serialized to JSON
        if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) {
            return {
                mathjs: 'number',
                value: String(value)
            };
        }
        return value;
    };
});
}),
]);

//# sourceMappingURL=9e883_mathjs_lib_esm_e0b5ae18._.js.map