/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Collection.ts":
/*!***************************!*\
  !*** ./src/Collection.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PaiCollection = exports.PaiPairCollection = void 0;\nconst Extractor_1 = __webpack_require__(/*! ./Extractor */ \"./src/Extractor.ts\");\nconst PaiGenerator_1 = __webpack_require__(/*! ./PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass PaiPairCollection {\n    constructor(paiPairs) {\n        this.paiPairs = [];\n        this.paiPairs = paiPairs;\n    }\n    // TODO: Not implemented yet\n    get isChiitoitsu() {\n        return false;\n    }\n    // TODO: Not implemented yet\n    get isKokushiMusou() {\n        return false;\n    }\n    get hasJantou() {\n        return this.count('isJantou') > 0;\n    }\n    get hasFuro() {\n        return this.count('isFuro') > 0;\n    }\n    get hasToitsu() {\n        return this.count('isToitsu') > 0;\n    }\n    get hasKan() {\n        return this.count('isKan') > 0;\n    }\n    get hasShuntsu() {\n        return this.count('isShuntsu') > 0;\n    }\n    get hasKoutsu() {\n        return this.count('isKoutsu') > 0;\n    }\n    get countJantou() {\n        return this.count('isJantou');\n    }\n    get countFuro() {\n        return this.count('isFuro');\n    }\n    get countToitsu() {\n        return this.count('isToitsu');\n    }\n    get countKan() {\n        return this.count('isKan');\n    }\n    get countShuntsu() {\n        return this.count('isShuntsu');\n    }\n    get countKoutsu() {\n        return this.count('isKoutsu');\n    }\n    countYaoChuHai(option = {}) {\n        const mergedOption = Object.assign({\n            isKan: false,\n            isFuro: false,\n        }, option);\n        return this.paiPairs.reduce((sum, paiPair) => sum + (paiPair.isKoutsu && paiPair.isFuro === mergedOption.isFuro && paiPair.isKan === mergedOption.isKan && paiPair.pattern.includesWithMatrix(PaiGenerator_1.PaiGenerator.generateYaoChuHai()) ? 1 : 0), 0);\n    }\n    countChunChanPai(option = {}) {\n        const mergedOption = Object.assign({\n            isKan: false,\n            isFuro: false,\n        }, option);\n        return this.paiPairs.reduce((sum, paiPair) => sum + (paiPair.isKoutsu && paiPair.isFuro === mergedOption.isFuro && paiPair.isKan === mergedOption.isKan && paiPair.pattern.includesWithMatrix(PaiGenerator_1.PaiGenerator.generateChunChanPai()) ? 1 : 0), 0);\n    }\n    count(by) {\n        if (by === 'pattern') {\n            throw Error('Specified parameter is not allowed');\n        }\n        let counter = 0;\n        for (const paiPair of this.paiPairs) {\n            if (paiPair[by]) {\n                counter++;\n            }\n        }\n        return counter;\n    }\n    get jantou() {\n        const jantou = this.paiPairs.find((paiPair) => paiPair.isJantou);\n        if (!jantou) {\n            throw Error('The Jantou is not found');\n        }\n        return jantou;\n    }\n}\nexports.PaiPairCollection = PaiPairCollection;\nclass PaiCollection {\n    constructor(paiList) {\n        this.paiList = [];\n        this.paiPairList = [];\n        this.length = 0;\n        this.paiNumberName = { \"1\": \"一\", \"2\": \"二\", \"3\": \"三\", \"4\": \"四\", \"5\": \"五\", \"6\": \"六\", \"7\": \"七\", \"8\": \"八\", \"9\": \"九\" };\n        this.paiGroupNamePatterns = {\n            \"m\": { name: \"萬子\" },\n            \"p\": { name: \"筒子\" },\n            \"s\": { name: \"索子\" },\n            \"z\": { name: \"字牌・三元牌\", patterns: { \"1z\": \"東\", \"2z\": \"南\", \"3z\": \"西\", \"4z\": \"北\", \"5z\": \"白\", \"6z\": \"発\", \"7z\": \"中\" } },\n        };\n        this.paiList = paiList;\n        this.validatePaiList();\n        this.length = this.paiList.length;\n    }\n    isAvailablePai(name) {\n        const [extractedName, extractedGroup] = Extractor_1.PaiPatternExtractor.extractPaiPair(name);\n        return ([\"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\"].includes(extractedName) && [\"z\"].includes(extractedGroup)) || ([\"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"8\", \"9\"].includes(extractedName) && [\"m\", \"p\", \"s\"].includes(extractedGroup));\n    }\n    lookUpPredictionJantouList() {\n        const jantouList = [];\n        for (let i = 0; i < 14; i++) {\n            const paiList = this.paiList.slice(i, i + 2);\n            if (paiList.length !== 2) {\n                continue;\n            }\n            if (paiList[0] !== paiList[1]) {\n                continue;\n            }\n            jantouList.push({\n                isKokushi: false,\n                isJantou: true,\n                isToitsu: true,\n                isShuntsu: false,\n                isKoutsu: false,\n                isKan: false,\n                isFuro: false,\n                includeAkaDora: false,\n                pattern: [paiList[0], paiList[1]],\n            });\n        }\n        return jantouList;\n    }\n    extract() {\n        const predictionJantouList = this.lookUpPredictionJantouList();\n        let paiPairs = [];\n        if (predictionJantouList.length === 0) {\n            return [\n                new PaiPairCollection(this.paiPairList),\n            ];\n        }\n        for (const jantou of predictionJantouList) {\n            const extractor = new Extractor_1.PaiPatternExtractor(new PaiCollection(this.diff(jantou)));\n            for (const extractedPatterns of extractor.extract()) {\n                paiPairs.push(new PaiPairCollection([...extractedPatterns, jantou]));\n            }\n        }\n        return paiPairs;\n    }\n    diff(removePaiList) {\n        const targetRemovePaiList = [...removePaiList.pattern];\n        const newPaiName = [];\n        for (let i = 0, j = 0; i < targetRemovePaiList.length; i++) {\n            for (; j < this.paiList.length; j++) {\n                if (targetRemovePaiList[i] === this.paiList[j]) {\n                    continue;\n                }\n                newPaiName.push(this.paiList[j]);\n            }\n        }\n        return newPaiName;\n    }\n    validatePaiList() {\n        for (let i = 0; i < this.paiList.length; i++) {\n            if (!this.isAvailablePai(this.paiList[i])) {\n                throw Error(`The pai format is invalid: ${this.paiList[i]} (index#${i})`);\n            }\n        }\n    }\n}\nexports.PaiCollection = PaiCollection;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Collection.ts?");

/***/ }),

/***/ "./src/Extractor.ts":
/*!**************************!*\
  !*** ./src/Extractor.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PaiPatternExtractor = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ./PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass PaiPatternExtractor {\n    constructor(paiCollection) {\n        this.paiCollection = paiCollection;\n    }\n    static splitByGroup(paiList) {\n        return paiList.reduce((carry, item) => {\n            const [number, group] = PaiPatternExtractor.extractPaiPair(item);\n            return {\n                m: [...carry.m, ...(group === 'm' ? [item] : [])],\n                p: [...carry.p, ...(group === 'p' ? [item] : [])],\n                s: [...carry.s, ...(group === 's' ? [item] : [])],\n                z: [...carry.z, ...(group === 'z' ? [item] : [])],\n            };\n        }, { m: [], p: [], s: [], z: [] });\n    }\n    static sortByPaiName(paiList, shuntsuFriendly) {\n        const result = paiList.sort((a, b) => {\n            const [aNumber, aGroup] = PaiPatternExtractor.extractPaiPair(a);\n            const [bNumber, bGroup] = PaiPatternExtractor.extractPaiPair(b);\n            const order = { 'm': 0, 'p': 10, 's': 20, 'z': 30 };\n            return (order[aGroup] + Number(aNumber)) - (order[bGroup] + Number(bNumber));\n        });\n        if (!shuntsuFriendly) {\n            return result;\n        }\n        // Split by groups\n        const newResult = PaiPatternExtractor.splitByGroup(result);\n        Object.keys(newResult).forEach(keyName => {\n            const groupName = keyName;\n            // NOTE: You should to decide length before process a loop because it will change orders based an array\n            let len = 0;\n            // NOTE: Here is definition a start pos\n            let i = 0;\n            do {\n                len = newResult[groupName].length;\n                const appeared = [];\n                for (; i < len; i++) {\n                    const paiName = newResult[groupName][i];\n                    if (paiName === null) {\n                        continue;\n                    }\n                    if (appeared.includes(paiName)) {\n                        newResult[groupName].push(newResult[groupName][i]);\n                        newResult[groupName][i] = null;\n                        continue;\n                    }\n                    appeared.push(paiName);\n                }\n            } while (len !== newResult[groupName].length);\n        });\n        return [...newResult.m, ...newResult.p, ...newResult.s, ...newResult.z]\n            .filter((v) => v != null);\n    }\n    extractShuntsu(paiList) {\n        const extractedPattern = [];\n        const remainingPaiList = PaiPatternExtractor.sortByPaiName(paiList, true);\n        const solvedPositions = [];\n        for (let i = 0; i < remainingPaiList.length; i++) {\n            const pattern = remainingPaiList.slice(i, i + 3);\n            if (PaiPatternExtractor.shouldShuntsu(pattern)) {\n                extractedPattern.push({\n                    isKokushi: false,\n                    isJantou: false,\n                    isToitsu: false,\n                    isShuntsu: true,\n                    isKoutsu: false,\n                    isKan: false,\n                    isFuro: false,\n                    includeAkaDora: false,\n                    pattern,\n                });\n                solvedPositions.push(i, i + 1, i + 2);\n                i += 2;\n            }\n        }\n        return [extractedPattern, solvedPositions];\n    }\n    extractKoutsu(paiList) {\n        const extractedPattern = [];\n        const remainingPaiList = PaiPatternExtractor.sortByPaiName(paiList, false);\n        const solvedPositions = [];\n        for (let i = 0; i < remainingPaiList.length; i++) {\n            const pattern = remainingPaiList.slice(i, i + 3);\n            if (PaiPatternExtractor.shouldKan(remainingPaiList.slice(i, i + 4))) {\n                extractedPattern.push({\n                    isKokushi: false,\n                    isJantou: false,\n                    isToitsu: false,\n                    isShuntsu: false,\n                    isKoutsu: false,\n                    isKan: true,\n                    isFuro: false,\n                    includeAkaDora: false,\n                    pattern: [remainingPaiList[i], remainingPaiList[i + 1], remainingPaiList[i + 2], remainingPaiList[i + 3]],\n                });\n                solvedPositions.push(i, i + 1, i + 2, i + 3);\n                i += 3;\n            }\n            else if (PaiPatternExtractor.shouldKoutsu(pattern)) {\n                extractedPattern.push({\n                    isKokushi: false,\n                    isJantou: false,\n                    isToitsu: false,\n                    isShuntsu: false,\n                    isKoutsu: true,\n                    isKan: false,\n                    isFuro: false,\n                    includeAkaDora: false,\n                    pattern,\n                });\n                solvedPositions.push(i, i + 1, i + 2);\n                i += 2;\n            }\n        }\n        return [extractedPattern, solvedPositions];\n    }\n    extractUnknown(paiList) {\n        const extractedPattern = [];\n        const remainingPaiList = PaiPatternExtractor.sortByPaiName(paiList, false);\n        const solvedPositions = [];\n        for (let i = 0; i < remainingPaiList.length; i++) {\n            extractedPattern.push({\n                isKokushi: false,\n                isJantou: false,\n                isToitsu: false,\n                isShuntsu: false,\n                isKoutsu: false,\n                isKan: false,\n                isFuro: false,\n                includeAkaDora: false,\n                pattern: [remainingPaiList[i]],\n            });\n            solvedPositions.push(i);\n        }\n        return [extractedPattern, solvedPositions];\n    }\n    extractChiitoitsu(paiList) {\n        const extractedPattern = [];\n        const remainingPaiList = PaiPatternExtractor.sortByPaiName(paiList, false);\n        const solvedPositions = [];\n        for (let i = 0; i < remainingPaiList.length; i++) {\n            const pattern = remainingPaiList.slice(i, i + 3);\n            if (PaiPatternExtractor.shouldToitsu(pattern)) {\n                extractedPattern.push({\n                    isKokushi: false,\n                    isJantou: false,\n                    isToitsu: true,\n                    isShuntsu: false,\n                    isKoutsu: false,\n                    isKan: false,\n                    isFuro: false,\n                    includeAkaDora: false,\n                    pattern,\n                });\n                solvedPositions.push(i, i + 1);\n                i += 1;\n            }\n        }\n        return [extractedPattern, solvedPositions];\n    }\n    extractKokushiMusou(paiList) {\n        const extractedPattern = [];\n        const remainingPaiList = PaiPatternExtractor.sortByPaiName(paiList, false);\n        const solvedPositions = [];\n        if (paiList.length !== 14) {\n            return [[], []];\n        }\n        if (paiList.reduce((carry, item) => carry.filter(pai => pai === item), PaiGenerator_1.PaiGenerator.generateKokushiMusou()).length === 0) {\n            return [\n                [{\n                        isKokushi: true,\n                        isJantou: false,\n                        isToitsu: false,\n                        isShuntsu: false,\n                        isKoutsu: false,\n                        isKan: false,\n                        isFuro: false,\n                        includeAkaDora: false,\n                        pattern: paiList,\n                    }],\n                Array.from({ length: paiList.length }, (_, k) => k),\n            ];\n        }\n        return [[], []];\n    }\n    extract() {\n        const paiPairList = [];\n        const reducer = (items, targetNumbers) => Array.from({ length: items.length }, (_, k) => k)\n            .reduce((carry, number) => ([...carry, ...(targetNumbers.includes(number) ? [] : [items[number]])]), []);\n        // NOTE: Shuntsu friendly\n        const [shuntsuFriendlyShuntsuPatterns, shuntsuFriendlyShuntsuSolvedPositions] = this.extractShuntsu(this.paiCollection.paiList);\n        const [shuntsuFriendlyKoutsuPatterns, shuntsuFriendlyKoutsuSolvedPositions] = this.extractKoutsu(reducer(this.paiCollection.paiList, shuntsuFriendlyShuntsuSolvedPositions));\n        const [shuntsuFriendlyUnknownPaiList] = this.extractUnknown(reducer(this.paiCollection.paiList, [...shuntsuFriendlyShuntsuSolvedPositions, ...shuntsuFriendlyKoutsuSolvedPositions]));\n        paiPairList.push([...shuntsuFriendlyShuntsuPatterns, ...shuntsuFriendlyKoutsuPatterns, ...shuntsuFriendlyUnknownPaiList]);\n        // NOTE: Non shuntsu friendly\n        const [koutsuPatterns, koutsuSolvedPositions] = this.extractKoutsu(this.paiCollection.paiList);\n        const [shuntsuPatterns, shuntsuSolvedPositions] = this.extractShuntsu(reducer(this.paiCollection.paiList, koutsuSolvedPositions));\n        const [unknownPaiList] = this.extractUnknown(reducer(this.paiCollection.paiList, [...shuntsuSolvedPositions, ...koutsuSolvedPositions]));\n        paiPairList.push([...shuntsuPatterns, ...koutsuPatterns, ...unknownPaiList]);\n        // NOTE: chiitoitsu\n        const [chiitoitsuPatterns, chiitoitsuSolvedPositions] = this.extractChiitoitsu(this.paiCollection.paiList);\n        const [chiitoitsuUnknownPaiList] = this.extractUnknown(reducer(this.paiCollection.paiList, chiitoitsuSolvedPositions));\n        paiPairList.push([...chiitoitsuPatterns, ...chiitoitsuUnknownPaiList]);\n        // NOTE: kokushimusou\n        const [kokushimusouPatterns, kokushimusouSolvedPositions] = this.extractKokushiMusou(this.paiCollection.paiList);\n        const [kokushimusouUnknownPaiList] = this.extractUnknown(reducer(this.paiCollection.paiList, kokushimusouSolvedPositions));\n        paiPairList.push([...kokushimusouPatterns, ...kokushimusouUnknownPaiList]);\n        return paiPairList;\n    }\n    static shouldShuntsu(pattern) {\n        if (pattern.length !== 3) {\n            return false;\n        }\n        const [aName, aGroup] = PaiPatternExtractor.extractPaiPair(pattern[0]);\n        const [bName, bGroup] = PaiPatternExtractor.extractPaiPair(pattern[1]);\n        const [cName, cGroup] = PaiPatternExtractor.extractPaiPair(pattern[2]);\n        if (aGroup === 'z' || bGroup === 'z' || cGroup === 'z') {\n            return false;\n        }\n        return parseInt(aName) === (parseInt(bName) - 1) && parseInt(bName) === (parseInt(cName) - 1) && aGroup === bGroup && bGroup === cGroup;\n    }\n    static shouldKan(pattern) {\n        if (pattern.length !== 4) {\n            return false;\n        }\n        return pattern[0] === pattern[1] && pattern[1] === pattern[2] && pattern[2] === pattern[3];\n    }\n    static shouldKoutsu(pattern) {\n        if (pattern.length !== 3) {\n            return false;\n        }\n        return pattern[0] === pattern[1] && pattern[1] === pattern[2];\n    }\n    static shouldToitsu(pattern) {\n        if (pattern.length !== 2) {\n            return false;\n        }\n        return pattern[0] === pattern[1];\n    }\n    static extractPaiPair(paiName) {\n        return [\n            paiName.substring(0, 1),\n            paiName.substring(1, 2),\n        ];\n    }\n}\nexports.PaiPatternExtractor = PaiPatternExtractor;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Extractor.ts?");

/***/ }),

/***/ "./src/Fu/Ankan.ts":
/*!*************************!*\
  !*** ./src/Fu/Ankan.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ankan = void 0;\nclass Ankan {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai({ isKan: true }) * 32;\n        count += this.paiPairCollection.countChunChanPai({ isKan: true }) * 16;\n        return count;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Ankan = Ankan;\n\n\n//# sourceURL=webpack:///./src/Fu/Ankan.ts?");

/***/ }),

/***/ "./src/Fu/Ankou.ts":
/*!*************************!*\
  !*** ./src/Fu/Ankou.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ankou = void 0;\nclass Ankou {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai() * 8;\n        count += this.paiPairCollection.countChunChanPai() * 4;\n        return count;\n    }\n    get isFulfilled() {\n        // The Anko is always true\n        return this.value > 0;\n    }\n}\nexports.Ankou = Ankou;\n\n\n//# sourceURL=webpack:///./src/Fu/Ankou.ts?");

/***/ }),

/***/ "./src/Fu/ChanFonPai.ts":
/*!******************************!*\
  !*** ./src/Fu/ChanFonPai.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChanFonPai = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nclass ChanFonPai {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        const pattern = this.paiPairCollection.jantou.pattern;\n        if (!Extractor_1.PaiPatternExtractor.shouldToitsu(pattern)) {\n            return 0;\n        }\n        return this.option.kaze && pattern.includes(this.option.kaze)\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.ChanFonPai = ChanFonPai;\n\n\n//# sourceURL=webpack:///./src/Fu/ChanFonPai.ts?");

/***/ }),

/***/ "./src/Fu/Futei.ts":
/*!*************************!*\
  !*** ./src/Fu/Futei.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Futei = void 0;\nclass Futei {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        return this.paiPairCollection.isChiitoitsu\n            ? 25\n            : 20;\n    }\n    get isFulfilled() {\n        // The Futei is always true\n        return this.value > 0;\n    }\n}\nexports.Futei = Futei;\n\n\n//# sourceURL=webpack:///./src/Fu/Futei.ts?");

/***/ }),

/***/ "./src/Fu/MenFonPai.ts":
/*!*****************************!*\
  !*** ./src/Fu/MenFonPai.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MenFonPai = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nclass MenFonPai {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        const pattern = this.paiPairCollection.jantou.pattern;\n        if (!Extractor_1.PaiPatternExtractor.shouldToitsu(pattern)) {\n            return 0;\n        }\n        return this.option.jikaze && pattern.includes(this.option.jikaze)\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.MenFonPai = MenFonPai;\n\n\n//# sourceURL=webpack:///./src/Fu/MenFonPai.ts?");

/***/ }),

/***/ "./src/Fu/MenzenKafu.ts":
/*!******************************!*\
  !*** ./src/Fu/MenzenKafu.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MenzenKafu = void 0;\nclass MenzenKafu {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        return this.option.hora?.fromRon && !this.paiPairCollection.hasFuro\n            ? 10\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.MenzenKafu = MenzenKafu;\n\n\n//# sourceURL=webpack:///./src/Fu/MenzenKafu.ts?");

/***/ }),

/***/ "./src/Fu/Minkan.ts":
/*!**************************!*\
  !*** ./src/Fu/Minkan.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Minkan = void 0;\nclass Minkan {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai({ isKan: true }) * 16;\n        count += this.paiPairCollection.countChunChanPai({ isKan: true }) * 8;\n        return count;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Minkan = Minkan;\n\n\n//# sourceURL=webpack:///./src/Fu/Minkan.ts?");

/***/ }),

/***/ "./src/Fu/Minkou.ts":
/*!**************************!*\
  !*** ./src/Fu/Minkou.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Minkou = void 0;\nclass Minkou {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai({ isFuro: true }) * 4;\n        count += this.paiPairCollection.countChunChanPai({ isFuro: true }) * 2;\n        return count;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Minkou = Minkou;\n\n\n//# sourceURL=webpack:///./src/Fu/Minkou.ts?");

/***/ }),

/***/ "./src/Fu/SangenPai.ts":
/*!*****************************!*\
  !*** ./src/Fu/SangenPai.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SangenPai = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass SangenPai {\n    constructor(paiPairCollection, _yaku, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        const pattern = this.paiPairCollection.jantou.pattern;\n        if (!Extractor_1.PaiPatternExtractor.shouldToitsu(pattern)) {\n            return 0;\n        }\n        return this.option.kaze && pattern.includesWithMatrix(PaiGenerator_1.PaiGenerator.generateSangenPai())\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.SangenPai = SangenPai;\n\n\n//# sourceURL=webpack:///./src/Fu/SangenPai.ts?");

/***/ }),

/***/ "./src/Fu/Tsumo.ts":
/*!*************************!*\
  !*** ./src/Fu/Tsumo.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Tsumo = void 0;\nconst Pinfu_1 = __webpack_require__(/*! ../Yaku/Pinfu */ \"./src/Yaku/Pinfu.ts\");\nclass Tsumo {\n    constructor(paiPairCollection, yakuList, option = {}) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n        this.yakuList = yakuList;\n    }\n    get value() {\n        return this.option.hora?.fromTsumo && !this.paiPairCollection.isChiitoitsu && this.yakuList.some(yaku => !(yaku instanceof Pinfu_1.Pinfu))\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Tsumo = Tsumo;\n\n\n//# sourceURL=webpack:///./src/Fu/Tsumo.ts?");

/***/ }),

/***/ "./src/Mahjong.ts":
/*!************************!*\
  !*** ./src/Mahjong.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Mahjong = void 0;\nconst Collection_1 = __webpack_require__(/*! ./Collection */ \"./src/Collection.ts\");\nconst MahjongScoreCalculator_1 = __webpack_require__(/*! ./MahjongScoreCalculator */ \"./src/MahjongScoreCalculator.ts\");\nclass Mahjong {\n    constructor(paiList, option = {}) {\n        this.option = {};\n        this.option = option;\n        this.paiCollection = new Collection_1.PaiCollection(paiList);\n        this.paiPairCollections = this.paiCollection.extract();\n        this.scoreCalculator = new MahjongScoreCalculator_1.MahjongScoreCalculator(this, this.paiPairCollections);\n        if (!this.scoreCalculator.isValid) {\n            throw Error('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on');\n        }\n    }\n}\nexports.Mahjong = Mahjong;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Mahjong.ts?");

/***/ }),

/***/ "./src/MahjongScoreCalculator.ts":
/*!***************************************!*\
  !*** ./src/MahjongScoreCalculator.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongScoreCalculator = void 0;\nconst MahjongFulfilledYakuValidator_1 = __webpack_require__(/*! ./Validator/MahjongFulfilledYakuValidator */ \"./src/Validator/MahjongFulfilledYakuValidator.ts\");\nconst MahjongFulfilledFuValidator_1 = __webpack_require__(/*! ./Validator/MahjongFulfilledFuValidator */ \"./src/Validator/MahjongFulfilledFuValidator.ts\");\nclass MahjongScoreCalculator {\n    constructor(mahjong, paiPairCollections) {\n        this.mahjong = mahjong;\n        this.paiPairCollections = paiPairCollections;\n        this.scores = this.paiPairCollections.map(collection => this.calculateScore(collection));\n        console.log(this.scores);\n    }\n    get isValid() {\n        return this.scores.some(scores => scores.length > 0);\n    }\n    calculateScore(collection) {\n        const scores = [];\n        const yakuValidator = new MahjongFulfilledYakuValidator_1.MahjongFulfilledYakuValidator(collection);\n        if (yakuValidator.validate()) {\n            scores.push(...yakuValidator.fulfilled.map(yaku => ({\n                isYaku: true,\n                yaku,\n            })));\n        }\n        const fuValidator = new MahjongFulfilledFuValidator_1.MahjongFulfilledFuValidator(collection, yakuValidator.fulfilled, this.mahjong.option);\n        if (fuValidator.validate()) {\n            scores.push(...fuValidator.fulfilled.map(fu => ({\n                isYaku: false,\n                fu,\n            })));\n        }\n        return scores;\n    }\n}\nexports.MahjongScoreCalculator = MahjongScoreCalculator;\n\n\n//# sourceURL=webpack:///./src/MahjongScoreCalculator.ts?");

/***/ }),

/***/ "./src/PaiGenerator.ts":
/*!*****************************!*\
  !*** ./src/PaiGenerator.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PaiGenerator = void 0;\nclass PaiGeneratorCache {\n    static getOrSet(name, payload) {\n        if (PaiGeneratorCache.paiCache[name]) {\n            return PaiGeneratorCache.paiCache[name];\n        }\n        return PaiGeneratorCache.paiCache[name] = payload();\n    }\n}\nPaiGeneratorCache.paiCache = {};\nclass PaiGenerator {\n    constructor(from, to, group) {\n        this.from = from;\n        this.to = to;\n        this.group = group;\n    }\n    generate() {\n        const names = [];\n        for (let i = parseInt(this.from); i <= parseInt(this.to); i++) {\n            names.push(`${i}${this.group}`);\n        }\n        return names;\n    }\n    static generateRoutouHai() {\n        return [\"1m\", \"9m\", \"1p\", \"9p\", \"1s\", \"9s\"];\n    }\n    static generatePenchanHai() {\n        return PaiGeneratorCache.getOrSet('penchanHai', () => [\n            ...(new PaiGenerator('1', '3', 'm')).generate(),\n            ...(new PaiGenerator('7', '9', 'm')).generate(),\n            ...(new PaiGenerator('1', '3', 'p')).generate(),\n            ...(new PaiGenerator('7', '9', 'p')).generate(),\n            ...(new PaiGenerator('1', '3', 's')).generate(),\n            ...(new PaiGenerator('7', '9', 's')).generate(),\n        ]).chunk(3);\n    }\n    static generateOneToNine() {\n        const m = PaiGeneratorCache.getOrSet('oneToNineManzu', () => (new PaiGenerator('1', '9', 'm')).generate());\n        const p = PaiGeneratorCache.getOrSet('oneToNinePinzu', () => (new PaiGenerator('1', '9', 'p')).generate());\n        const s = PaiGeneratorCache.getOrSet('oneToNineSozu', () => (new PaiGenerator('1', '9', 'm')).generate());\n        return {\n            m,\n            p,\n            s,\n        };\n    }\n    static generateChunChanPai() {\n        return PaiGeneratorCache.getOrSet('chunChanPai', () => [\n            ...(new PaiGenerator('2', '8', 'm')).generate(),\n            ...(new PaiGenerator('2', '8', 'p')).generate(),\n            ...(new PaiGenerator('2', '8', 's')).generate(),\n        ]);\n    }\n    static generateYaoChuHai() {\n        return PaiGeneratorCache.getOrSet('yaoChuHai', () => [...PaiGenerator.generateRoutouHai(), ...this.generateJiHai()]);\n    }\n    static generateJiHai() {\n        return PaiGeneratorCache.getOrSet('jiHai', () => [...PaiGenerator.generateKazeHai(), ...PaiGenerator.generateSangenPai()]);\n    }\n    static generateKazeHai() {\n        return PaiGeneratorCache.getOrSet('kazeHai', () => (new PaiGenerator('1', '4', 'z')).generate());\n    }\n    static generateSangenPai() {\n        return PaiGeneratorCache.getOrSet('sangenPai', () => (new PaiGenerator('5', '7', 'z')).generate());\n    }\n    static generateKokushiMusou() {\n        return PaiGeneratorCache.getOrSet('kokushiMusou', () => [...PaiGenerator.generateRoutouHai(), ...this.generateJiHai()]);\n    }\n}\nexports.PaiGenerator = PaiGenerator;\n\n\n//# sourceURL=webpack:///./src/PaiGenerator.ts?");

/***/ }),

/***/ "./src/Utilities.ts":
/*!**************************!*\
  !*** ./src/Utilities.ts ***!
  \**************************/
/***/ (() => {

eval("\nArray.prototype.chunk = function (size) {\n    return Array.from({ length: Math.ceil(this.length / size) }, (_, i) => this.slice(i * size, (i + 1) * size));\n};\nArray.prototype.includesWithMatrix = function (items) {\n    return items.some(item => this.includes(item));\n};\n\n\n//# sourceURL=webpack:///./src/Utilities.ts?");

/***/ }),

/***/ "./src/Validator/MahjongFormatValidator.ts":
/*!*************************************************!*\
  !*** ./src/Validator/MahjongFormatValidator.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongFormatValidator = void 0;\nclass MahjongFormatValidator {\n    constructor(paiPairCollection) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    validate() {\n        // NOTE: check normally format `(shuntsu | koutsu | kan){4} + jantou`\n        return (this.paiPairCollection.countKan + this.paiPairCollection.countShuntsu + this.paiPairCollection.countKoutsu) === 4\n            && (this.paiPairCollection.countJantou) === 1;\n    }\n}\nexports.MahjongFormatValidator = MahjongFormatValidator;\n\n\n//# sourceURL=webpack:///./src/Validator/MahjongFormatValidator.ts?");

/***/ }),

/***/ "./src/Validator/MahjongFulfilledFuValidator.ts":
/*!******************************************************!*\
  !*** ./src/Validator/MahjongFulfilledFuValidator.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongFulfilledFuValidator = void 0;\nconst MahjongFormatValidator_1 = __webpack_require__(/*! ./MahjongFormatValidator */ \"./src/Validator/MahjongFormatValidator.ts\");\nconst Futei_1 = __webpack_require__(/*! ../Fu/Futei */ \"./src/Fu/Futei.ts\");\nconst Ankou_1 = __webpack_require__(/*! ../Fu/Ankou */ \"./src/Fu/Ankou.ts\");\nconst Ankan_1 = __webpack_require__(/*! ../Fu/Ankan */ \"./src/Fu/Ankan.ts\");\nconst Minkou_1 = __webpack_require__(/*! ../Fu/Minkou */ \"./src/Fu/Minkou.ts\");\nconst Minkan_1 = __webpack_require__(/*! ../Fu/Minkan */ \"./src/Fu/Minkan.ts\");\nconst Tsumo_1 = __webpack_require__(/*! ../Fu/Tsumo */ \"./src/Fu/Tsumo.ts\");\nconst MenzenKafu_1 = __webpack_require__(/*! ../Fu/MenzenKafu */ \"./src/Fu/MenzenKafu.ts\");\nconst MenFonPai_1 = __webpack_require__(/*! ../Fu/MenFonPai */ \"./src/Fu/MenFonPai.ts\");\nconst ChanFonPai_1 = __webpack_require__(/*! ../Fu/ChanFonPai */ \"./src/Fu/ChanFonPai.ts\");\nconst SangenPai_1 = __webpack_require__(/*! ../Fu/SangenPai */ \"./src/Fu/SangenPai.ts\");\nclass MahjongFulfilledFuValidator {\n    constructor(paiPairCollection, yakuList, option = {}) {\n        this.fuList = [\n            Futei_1.Futei,\n            Ankou_1.Ankou,\n            Minkou_1.Minkou,\n            Ankan_1.Ankan,\n            Minkan_1.Minkan,\n            Tsumo_1.Tsumo,\n            MenzenKafu_1.MenzenKafu,\n            MenFonPai_1.MenFonPai,\n            ChanFonPai_1.ChanFonPai,\n            SangenPai_1.SangenPai,\n        ];\n        this._fulfilled = [];\n        this.option = option;\n        this.yakuList = yakuList;\n        this.paiPairCollection = paiPairCollection;\n    }\n    get fulfilled() {\n        return this._fulfilled;\n    }\n    validate() {\n        if (this.paiPairCollection.paiPairs.length === 0) {\n            return false;\n        }\n        if (!(new MahjongFormatValidator_1.MahjongFormatValidator(this.paiPairCollection)).validate()) {\n            return false;\n        }\n        for (const fuName of this.fuList) {\n            let processor = new fuName(this.paiPairCollection, this.yakuList, this.option);\n            if (processor.isFulfilled) {\n                this._fulfilled.push(processor);\n            }\n        }\n        return true;\n    }\n}\nexports.MahjongFulfilledFuValidator = MahjongFulfilledFuValidator;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Validator/MahjongFulfilledFuValidator.ts?");

/***/ }),

/***/ "./src/Validator/MahjongFulfilledYakuValidator.ts":
/*!********************************************************!*\
  !*** ./src/Validator/MahjongFulfilledYakuValidator.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongFulfilledYakuValidator = void 0;\nconst Tanyao_1 = __webpack_require__(/*! ../Yaku/Tanyao */ \"./src/Yaku/Tanyao.ts\");\nconst Chanta_1 = __webpack_require__(/*! ../Yaku/Chanta */ \"./src/Yaku/Chanta.ts\");\nconst Honitsu_1 = __webpack_require__(/*! ../Yaku/Honitsu */ \"./src/Yaku/Honitsu.ts\");\nconst MahjongFormatValidator_1 = __webpack_require__(/*! ./MahjongFormatValidator */ \"./src/Validator/MahjongFormatValidator.ts\");\nconst Pinfu_1 = __webpack_require__(/*! ../Yaku/Pinfu */ \"./src/Yaku/Pinfu.ts\");\nclass MahjongFulfilledYakuValidator {\n    constructor(paiPairCollection) {\n        this.yakuList = [\n            Tanyao_1.Tanyao,\n            Chanta_1.Chanta,\n            Honitsu_1.Honitsu,\n            Pinfu_1.Pinfu,\n        ];\n        this._fulfilled = [];\n        this.paiPairCollection = paiPairCollection;\n    }\n    get fulfilled() {\n        return this._fulfilled;\n    }\n    validate() {\n        if (this.paiPairCollection.paiPairs.length === 0) {\n            return false;\n        }\n        if (!(new MahjongFormatValidator_1.MahjongFormatValidator(this.paiPairCollection)).validate()) {\n            return false;\n        }\n        for (const yakuName of this.yakuList) {\n            let processor = new yakuName(this.paiPairCollection);\n            let record = null;\n            do {\n                if (processor.isFulfilled) {\n                    record = processor;\n                }\n                if (processor.parent === null) {\n                    break;\n                }\n                processor = processor.parent;\n            } while (processor);\n            if (record !== null) {\n                this._fulfilled.push(record);\n            }\n        }\n        return this._fulfilled.length > 0;\n    }\n}\nexports.MahjongFulfilledYakuValidator = MahjongFulfilledYakuValidator;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Validator/MahjongFulfilledYakuValidator.ts?");

/***/ }),

/***/ "./src/Yaku/Chanta.ts":
/*!****************************!*\
  !*** ./src/Yaku/Chanta.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Chanta = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nconst JunChanta_1 = __webpack_require__(/*! ./JunChanta */ \"./src/Yaku/JunChanta.ts\");\nclass Chanta {\n    constructor(paiPairCollection) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 1\n            : 2;\n    }\n    get parent() {\n        return new JunChanta_1.JunChanta(this.paiPairCollection);\n    }\n    get isFulfilled() {\n        const result = [];\n        const allowedPatterns = PaiGenerator_1.PaiGenerator.generatePenchanHai();\n        for (const paiPair of this.paiPairCollection.paiPairs) {\n            result.push(allowedPatterns.includes(paiPair.pattern) || paiPair.pattern.some(pai => PaiGenerator_1.PaiGenerator.generateJiHai().includes(pai)));\n        }\n        return result.every(v => v);\n    }\n}\nexports.Chanta = Chanta;\n\n\n//# sourceURL=webpack:///./src/Yaku/Chanta.ts?");

/***/ }),

/***/ "./src/Yaku/Chinitsu.ts":
/*!******************************!*\
  !*** ./src/Yaku/Chinitsu.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Chinitsu = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass Chinitsu {\n    constructor(paiPairCollection) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 5\n            : 6;\n    }\n    get parent() {\n        return null;\n    }\n    get isFulfilled() {\n        const { m, p, s } = PaiGenerator_1.PaiGenerator.generateOneToNine();\n        for (const pai of [m, p, s]) {\n            const result = [];\n            for (const paiPair of this.paiPairCollection.paiPairs) {\n                const hasSameColored = paiPair.pattern.every(paiName => pai.includes(paiName));\n                result.push(hasSameColored);\n            }\n            if (result.every(v => v)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.Chinitsu = Chinitsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Chinitsu.ts?");

/***/ }),

/***/ "./src/Yaku/Honitsu.ts":
/*!*****************************!*\
  !*** ./src/Yaku/Honitsu.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Honitsu = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nconst Chinitsu_1 = __webpack_require__(/*! ./Chinitsu */ \"./src/Yaku/Chinitsu.ts\");\nclass Honitsu {\n    constructor(paiPairCollection) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 2\n            : 3;\n    }\n    get parent() {\n        return new Chinitsu_1.Chinitsu(this.paiPairCollection);\n    }\n    get isFulfilled() {\n        const { m, p, s } = PaiGenerator_1.PaiGenerator.generateOneToNine();\n        const jiHai = PaiGenerator_1.PaiGenerator.generateJiHai();\n        for (const pai of [m, p, s]) {\n            const result = [];\n            for (const paiPair of this.paiPairCollection.paiPairs) {\n                const hasSameColored = paiPair.pattern.every(paiName => [...pai, ...jiHai].includes(paiName));\n                result.push(hasSameColored);\n            }\n            if (result.every(v => v)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.Honitsu = Honitsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Honitsu.ts?");

/***/ }),

/***/ "./src/Yaku/JunChanta.ts":
/*!*******************************!*\
  !*** ./src/Yaku/JunChanta.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.JunChanta = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass JunChanta {\n    constructor(paiPairCollection) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 2\n            : 3;\n    }\n    get parent() {\n        return null;\n    }\n    get isFulfilled() {\n        const result = [];\n        const allowedPatterns = PaiGenerator_1.PaiGenerator.generatePenchanHai();\n        for (const paiPair of this.paiPairCollection.paiPairs) {\n            result.push(allowedPatterns.includes(paiPair.pattern));\n        }\n        return result.every(v => v);\n    }\n}\nexports.JunChanta = JunChanta;\n\n\n//# sourceURL=webpack:///./src/Yaku/JunChanta.ts?");

/***/ }),

/***/ "./src/Yaku/Pinfu.ts":
/*!***************************!*\
  !*** ./src/Yaku/Pinfu.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Pinfu = void 0;\nclass Pinfu {\n    constructor(paiPairCollection) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return 1;\n    }\n    get parent() {\n        return null;\n    }\n    // TODO: Not implemented yet\n    get isFulfilled() {\n        return false;\n    }\n}\nexports.Pinfu = Pinfu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Pinfu.ts?");

/***/ }),

/***/ "./src/Yaku/Tanyao.ts":
/*!****************************!*\
  !*** ./src/Yaku/Tanyao.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Tanyao = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass Tanyao {\n    constructor(paiPairCollection) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return 1;\n    }\n    get parent() {\n        return null;\n    }\n    get isFulfilled() {\n        for (const paiPair of this.paiPairCollection.paiPairs) {\n            const hasYaoChuHai = paiPair.pattern.some(paiName => PaiGenerator_1.PaiGenerator.generateYaoChuHai().includes(paiName));\n            if (hasYaoChuHai) {\n                return false;\n            }\n        }\n        return true;\n    }\n}\nexports.Tanyao = Tanyao;\n\n\n//# sourceURL=webpack:///./src/Yaku/Tanyao.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n__webpack_require__(/*! ./Utilities */ \"./src/Utilities.ts\");\nconst Mahjong_1 = __webpack_require__(/*! ./Mahjong */ \"./src/Mahjong.ts\");\n// torima\nconst mahjong = new Mahjong_1.Mahjong([\n    \"2p\", \"3p\", \"4p\",\n    \"2p\", \"3p\", \"4p\",\n    \"2s\", \"3s\", \"4s\",\n    \"5s\", \"5s\", \"5s\",\n    \"8m\", \"8m\",\n]);\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;