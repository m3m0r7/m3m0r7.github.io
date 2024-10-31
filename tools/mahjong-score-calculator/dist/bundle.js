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

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PaiCollection = exports.PaiPairCollection = void 0;\nconst Extractor_1 = __webpack_require__(/*! ./Extractor */ \"./src/Extractor.ts\");\nconst PaiGenerator_1 = __webpack_require__(/*! ./PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass PaiPairCollection {\n    constructor(paiPairs) {\n        this.paiPairs = [];\n        this.paiPairs = paiPairs;\n    }\n    // TODO: Not implemented yet\n    get isChiitoitsu() {\n        return false;\n    }\n    // TODO: Not implemented yet\n    get isKokushiMusou() {\n        return false;\n    }\n    get hasJantou() {\n        return this.count('isJantou') > 0;\n    }\n    get hasFuro() {\n        return this.count('isFuro') > 0;\n    }\n    get hasToitsu() {\n        return this.count('isToitsu') > 0;\n    }\n    get hasKan() {\n        return this.count('isKan') > 0;\n    }\n    get hasShuntsu() {\n        return this.count('isShuntsu') > 0;\n    }\n    get hasKoutsu() {\n        return this.count('isKoutsu') > 0;\n    }\n    get countJantou() {\n        return this.count('isJantou');\n    }\n    get countAkaDora() {\n        return this.count('includeAkaDora');\n    }\n    get countFuro() {\n        return this.count('isFuro');\n    }\n    get countToitsu() {\n        return this.count('isToitsu');\n    }\n    get countKan() {\n        return this.count('isKan');\n    }\n    get countShuntsu() {\n        return this.count('isShuntsu');\n    }\n    get countKoutsu() {\n        return this.count('isKoutsu');\n    }\n    countYaoChuHai(option = {}) {\n        const mergedOption = Object.assign({\n            isKan: false,\n            isFuro: false,\n        }, option);\n        return this.paiPairs.reduce((sum, paiPair) => sum + (paiPair.isKoutsu && paiPair.isFuro === mergedOption.isFuro && paiPair.isKan === mergedOption.isKan && paiPair.pattern.includesWithMatrix(PaiGenerator_1.PaiGenerator.generateYaoChuHai()) ? 1 : 0), 0);\n    }\n    countChunChanPai(option = {}) {\n        const mergedOption = Object.assign({\n            isKan: false,\n            isFuro: false,\n        }, option);\n        return this.paiPairs.reduce((sum, paiPair) => sum + (paiPair.isKoutsu && paiPair.isFuro === mergedOption.isFuro && paiPair.isKan === mergedOption.isKan && paiPair.pattern.includesWithMatrix(PaiGenerator_1.PaiGenerator.generateChunChanPai()) ? 1 : 0), 0);\n    }\n    count(by) {\n        if (by === 'pattern') {\n            throw Error('Specified parameter is not allowed');\n        }\n        let counter = 0;\n        for (const paiPair of this.paiPairs) {\n            if (paiPair[by]) {\n                counter++;\n            }\n        }\n        return counter;\n    }\n    get jantou() {\n        const jantou = this.paiPairs.find((paiPair) => paiPair.isJantou);\n        if (!jantou) {\n            throw Error('The Jantou is not found');\n        }\n        return jantou;\n    }\n}\nexports.PaiPairCollection = PaiPairCollection;\nclass PaiCollection {\n    constructor(paiList) {\n        this.paiList = [];\n        this.paiPairList = [];\n        this.length = 0;\n        this.paiNumberName = { \"1\": \"一\", \"2\": \"二\", \"3\": \"三\", \"4\": \"四\", \"5\": \"五\", \"6\": \"六\", \"7\": \"七\", \"8\": \"八\", \"9\": \"九\" };\n        this.paiGroupNamePatterns = {\n            \"m\": { name: \"萬子\" },\n            \"p\": { name: \"筒子\" },\n            \"s\": { name: \"索子\" },\n            \"z\": { name: \"字牌・三元牌\", patterns: { \"1z\": \"東\", \"2z\": \"南\", \"3z\": \"西\", \"4z\": \"北\", \"5z\": \"白\", \"6z\": \"発\", \"7z\": \"中\" } },\n        };\n        this.paiList = paiList;\n        this.validatePaiList();\n        this.length = this.paiList.length;\n    }\n    isAvailablePai(name) {\n        const [extractedName, extractedGroup] = Extractor_1.PaiPatternExtractor.extractPaiPair(name);\n        return ([\"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\"].includes(extractedName) && [\"z\"].includes(extractedGroup)) || ([\"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"8\", \"9\"].includes(extractedName) && [\"m\", \"p\", \"s\"].includes(extractedGroup));\n    }\n    lookUpPredictionJantouList() {\n        const jantouList = [];\n        for (let i = 0; i < 14; i++) {\n            const paiList = this.paiList.slice(i, i + 2);\n            if (paiList.length !== 2) {\n                continue;\n            }\n            if (paiList[0] !== paiList[1]) {\n                continue;\n            }\n            jantouList.push({\n                isKokushi: false,\n                isJantou: true,\n                isToitsu: true,\n                isShuntsu: false,\n                isKoutsu: false,\n                isKan: false,\n                isFuro: false,\n                includeAkaDora: false,\n                pattern: [paiList[0], paiList[1]],\n            });\n        }\n        return jantouList;\n    }\n    extract() {\n        const predictionJantouList = this.lookUpPredictionJantouList();\n        let paiPairs = [];\n        if (predictionJantouList.length === 0) {\n            return [\n                new PaiPairCollection(this.paiPairList),\n            ];\n        }\n        for (const jantou of predictionJantouList) {\n            const extractor = new Extractor_1.PaiPatternExtractor(new PaiCollection(this.diff(jantou)));\n            for (const extractedPatterns of extractor.extract()) {\n                paiPairs.push(new PaiPairCollection([...extractedPatterns, jantou]));\n            }\n        }\n        return paiPairs;\n    }\n    diff(removePaiList) {\n        const targetRemovePaiList = [...removePaiList.pattern];\n        const newPaiName = [];\n        for (let i = 0, j = 0; i < targetRemovePaiList.length; i++) {\n            for (; j < this.paiList.length; j++) {\n                if (targetRemovePaiList[i] === this.paiList[j]) {\n                    continue;\n                }\n                newPaiName.push(this.paiList[j]);\n            }\n        }\n        return newPaiName;\n    }\n    validatePaiList() {\n        for (let i = 0; i < this.paiList.length; i++) {\n            if (!this.isAvailablePai(this.paiList[i])) {\n                throw Error(`The pai format is invalid: ${this.paiList[i]} (index#${i})`);\n            }\n        }\n    }\n}\nexports.PaiCollection = PaiCollection;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Collection.ts?");

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

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ankan = void 0;\nclass Ankan {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai({ isKan: true }) * 32;\n        count += this.paiPairCollection.countChunChanPai({ isKan: true }) * 16;\n        return count;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Ankan = Ankan;\n\n\n//# sourceURL=webpack:///./src/Fu/Ankan.ts?");

/***/ }),

/***/ "./src/Fu/Ankou.ts":
/*!*************************!*\
  !*** ./src/Fu/Ankou.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ankou = void 0;\nclass Ankou {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai() * 8;\n        count += this.paiPairCollection.countChunChanPai() * 4;\n        return count;\n    }\n    get isFulfilled() {\n        // The Anko is always true\n        return this.value > 0;\n    }\n}\nexports.Ankou = Ankou;\n\n\n//# sourceURL=webpack:///./src/Fu/Ankou.ts?");

/***/ }),

/***/ "./src/Fu/ChanFonPai.ts":
/*!******************************!*\
  !*** ./src/Fu/ChanFonPai.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChanFonPai = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nclass ChanFonPai {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        const pattern = this.paiPairCollection.jantou.pattern;\n        if (!Extractor_1.PaiPatternExtractor.shouldToitsu(pattern)) {\n            return 0;\n        }\n        return this.option.kaze && pattern.includes(this.option.kaze)\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.ChanFonPai = ChanFonPai;\n\n\n//# sourceURL=webpack:///./src/Fu/ChanFonPai.ts?");

/***/ }),

/***/ "./src/Fu/Futei.ts":
/*!*************************!*\
  !*** ./src/Fu/Futei.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Futei = void 0;\nclass Futei {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        return this.paiPairCollection.isChiitoitsu\n            ? 25\n            : 20;\n    }\n    get isFulfilled() {\n        // The Futei is always true\n        return this.value > 0;\n    }\n}\nexports.Futei = Futei;\n\n\n//# sourceURL=webpack:///./src/Fu/Futei.ts?");

/***/ }),

/***/ "./src/Fu/MenFonPai.ts":
/*!*****************************!*\
  !*** ./src/Fu/MenFonPai.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MenFonPai = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nclass MenFonPai {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        const pattern = this.paiPairCollection.jantou.pattern;\n        if (!Extractor_1.PaiPatternExtractor.shouldToitsu(pattern)) {\n            return 0;\n        }\n        return this.option.jikaze && pattern.includes(this.option.jikaze)\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.MenFonPai = MenFonPai;\n\n\n//# sourceURL=webpack:///./src/Fu/MenFonPai.ts?");

/***/ }),

/***/ "./src/Fu/MenzenKafu.ts":
/*!******************************!*\
  !*** ./src/Fu/MenzenKafu.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MenzenKafu = void 0;\nclass MenzenKafu {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        return this.option.hora.fromRon && !this.paiPairCollection.hasFuro\n            ? 10\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.MenzenKafu = MenzenKafu;\n\n\n//# sourceURL=webpack:///./src/Fu/MenzenKafu.ts?");

/***/ }),

/***/ "./src/Fu/Minkan.ts":
/*!**************************!*\
  !*** ./src/Fu/Minkan.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Minkan = void 0;\nclass Minkan {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai({ isKan: true }) * 16;\n        count += this.paiPairCollection.countChunChanPai({ isKan: true }) * 8;\n        return count;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Minkan = Minkan;\n\n\n//# sourceURL=webpack:///./src/Fu/Minkan.ts?");

/***/ }),

/***/ "./src/Fu/Minkou.ts":
/*!**************************!*\
  !*** ./src/Fu/Minkou.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Minkou = void 0;\nclass Minkou {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        let count = 0;\n        count += this.paiPairCollection.countYaoChuHai({ isFuro: true }) * 4;\n        count += this.paiPairCollection.countChunChanPai({ isFuro: true }) * 2;\n        return count;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Minkou = Minkou;\n\n\n//# sourceURL=webpack:///./src/Fu/Minkou.ts?");

/***/ }),

/***/ "./src/Fu/RenFonPai.ts":
/*!*****************************!*\
  !*** ./src/Fu/RenFonPai.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RenFonPai = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nclass RenFonPai {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        const pattern = this.paiPairCollection.jantou.pattern;\n        if (!Extractor_1.PaiPatternExtractor.shouldToitsu(pattern)) {\n            return 0;\n        }\n        return this.option.kaze === this.option.jikaze && pattern.includes(this.option.kaze)\n            // NOTE: Here is decided to calculate fu from a renfon pai. Default is 4 because it is based on mahjong official tournament rules.\n            //       But I know, in some cases, that is calculated with 2.\n            //       Of course, this is built-in option, and it is available to customize.\n            ? this.option.localRules?.fu?.renfonPai ?? 4\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.RenFonPai = RenFonPai;\n\n\n//# sourceURL=webpack:///./src/Fu/RenFonPai.ts?");

/***/ }),

/***/ "./src/Fu/SangenPai.ts":
/*!*****************************!*\
  !*** ./src/Fu/SangenPai.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SangenPai = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass SangenPai {\n    constructor(paiPairCollection, _yaku, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get value() {\n        const pattern = this.paiPairCollection.jantou.pattern;\n        if (!Extractor_1.PaiPatternExtractor.shouldToitsu(pattern)) {\n            return 0;\n        }\n        return pattern.includesWithMatrix(PaiGenerator_1.PaiGenerator.generateSangenPai())\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.SangenPai = SangenPai;\n\n\n//# sourceURL=webpack:///./src/Fu/SangenPai.ts?");

/***/ }),

/***/ "./src/Fu/Tsumo.ts":
/*!*************************!*\
  !*** ./src/Fu/Tsumo.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Tsumo = void 0;\nconst Pinfu_1 = __webpack_require__(/*! ../Yaku/Pinfu */ \"./src/Yaku/Pinfu.ts\");\nclass Tsumo {\n    constructor(paiPairCollection, yakuList, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n        this.yakuList = yakuList;\n    }\n    get value() {\n        return this.option.hora.fromTsumo && !this.paiPairCollection.isChiitoitsu && this.yakuList.some(yaku => !(yaku instanceof Pinfu_1.Pinfu))\n            ? 2\n            : 0;\n    }\n    get isFulfilled() {\n        return this.value > 0;\n    }\n}\nexports.Tsumo = Tsumo;\n\n\n//# sourceURL=webpack:///./src/Fu/Tsumo.ts?");

/***/ }),

/***/ "./src/Fu/index.ts":
/*!*************************!*\
  !*** ./src/Fu/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RenFonPai = exports.SangenPai = exports.ChanFonPai = exports.MenFonPai = exports.MenzenKafu = exports.Tsumo = exports.Minkou = exports.Minkan = exports.Ankan = exports.Ankou = exports.Futei = void 0;\nconst Futei_1 = __webpack_require__(/*! ./Futei */ \"./src/Fu/Futei.ts\");\nObject.defineProperty(exports, \"Futei\", ({ enumerable: true, get: function () { return Futei_1.Futei; } }));\nconst Ankou_1 = __webpack_require__(/*! ./Ankou */ \"./src/Fu/Ankou.ts\");\nObject.defineProperty(exports, \"Ankou\", ({ enumerable: true, get: function () { return Ankou_1.Ankou; } }));\nconst Ankan_1 = __webpack_require__(/*! ./Ankan */ \"./src/Fu/Ankan.ts\");\nObject.defineProperty(exports, \"Ankan\", ({ enumerable: true, get: function () { return Ankan_1.Ankan; } }));\nconst Minkou_1 = __webpack_require__(/*! ./Minkou */ \"./src/Fu/Minkou.ts\");\nObject.defineProperty(exports, \"Minkou\", ({ enumerable: true, get: function () { return Minkou_1.Minkou; } }));\nconst Minkan_1 = __webpack_require__(/*! ./Minkan */ \"./src/Fu/Minkan.ts\");\nObject.defineProperty(exports, \"Minkan\", ({ enumerable: true, get: function () { return Minkan_1.Minkan; } }));\nconst Tsumo_1 = __webpack_require__(/*! ./Tsumo */ \"./src/Fu/Tsumo.ts\");\nObject.defineProperty(exports, \"Tsumo\", ({ enumerable: true, get: function () { return Tsumo_1.Tsumo; } }));\nconst MenzenKafu_1 = __webpack_require__(/*! ./MenzenKafu */ \"./src/Fu/MenzenKafu.ts\");\nObject.defineProperty(exports, \"MenzenKafu\", ({ enumerable: true, get: function () { return MenzenKafu_1.MenzenKafu; } }));\nconst MenFonPai_1 = __webpack_require__(/*! ./MenFonPai */ \"./src/Fu/MenFonPai.ts\");\nObject.defineProperty(exports, \"MenFonPai\", ({ enumerable: true, get: function () { return MenFonPai_1.MenFonPai; } }));\nconst ChanFonPai_1 = __webpack_require__(/*! ./ChanFonPai */ \"./src/Fu/ChanFonPai.ts\");\nObject.defineProperty(exports, \"ChanFonPai\", ({ enumerable: true, get: function () { return ChanFonPai_1.ChanFonPai; } }));\nconst SangenPai_1 = __webpack_require__(/*! ./SangenPai */ \"./src/Fu/SangenPai.ts\");\nObject.defineProperty(exports, \"SangenPai\", ({ enumerable: true, get: function () { return SangenPai_1.SangenPai; } }));\nconst RenFonPai_1 = __webpack_require__(/*! ./RenFonPai */ \"./src/Fu/RenFonPai.ts\");\nObject.defineProperty(exports, \"RenFonPai\", ({ enumerable: true, get: function () { return RenFonPai_1.RenFonPai; } }));\n\n\n//# sourceURL=webpack:///./src/Fu/index.ts?");

/***/ }),

/***/ "./src/I18n.ts":
/*!*********************!*\
  !*** ./src/I18n.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Yaku_1 = __webpack_require__(/*! ./Yaku */ \"./src/Yaku/index.ts\");\nconst Fu_1 = __webpack_require__(/*! ./Fu */ \"./src/Fu/index.ts\");\nexports[\"default\"] = {\n    ja: {\n        fu: {\n            [Fu_1.Futei.name]: '副底',\n            [Fu_1.Ankou.name]: '暗刻',\n            [Fu_1.Minkou.name]: '明刻',\n            [Fu_1.Ankan.name]: '暗槓',\n            [Fu_1.Minkan.name]: '明槓',\n            [Fu_1.Tsumo.name]: 'ツモ符',\n            [Fu_1.MenzenKafu.name]: '門前加付',\n            [Fu_1.MenFonPai.name]: '自風牌',\n            [Fu_1.ChanFonPai.name]: '場風牌',\n            [Fu_1.SangenPai.name]: '三元牌',\n            [Fu_1.RenFonPai.name]: '連風牌',\n        },\n        yaku: {\n            // Hands\n            [Yaku_1.Tanyao.name]: '断么九',\n            [Yaku_1.Chanta.name]: '混全帯么九',\n            [Yaku_1.Honitsu.name]: '混一色',\n            [Yaku_1.Chinitsu.name]: '清一色',\n            [Yaku_1.Pinfu.name]: '平和',\n            [Yaku_1.Houtei.name]: '河底撈魚',\n            [Yaku_1.Haitei.name]: '海底摸月',\n            [Yaku_1.Riichi.name]: 'リーチ',\n            [Yaku_1.OpenRiichi.name]: 'オープンリーチ',\n            [Yaku_1.RinshanKaiho.name]: '嶺上開花',\n            [Yaku_1.RenFon.name]: 'ダブル風役',\n            [Yaku_1.ChanFon.name]: '場風役',\n            [Yaku_1.MenFon.name]: '自風役',\n            [Yaku_1.Ippatsu.name]: '一発',\n            [Yaku_1.Haku.name]: '白',\n            [Yaku_1.Hatsu.name]: '発',\n            [Yaku_1.Chun.name]: '中',\n            [Yaku_1.ChanKan.name]: '槍槓',\n            [Yaku_1.IpeiKou.name]: '一盃口',\n            [Yaku_1.RyanPeiKou.name]: '二盃口',\n            [Yaku_1.ToiToi.name]: '対々和',\n            [Yaku_1.SanAnkou.name]: '三暗刻',\n            [Yaku_1.JunChanta.name]: '純全帯么九',\n            [Yaku_1.SanShokuDouKou.name]: '三色同順',\n            [Yaku_1.SanShokuDouJun.name]: '三色同刻',\n            [Yaku_1.SanKantsu.name]: '三槓子',\n            [Yaku_1.ChiiToitsu.name]: '七対子',\n            // Dora\n            [Yaku_1.Dora.name]: 'ドラ',\n            [Yaku_1.UraDora.name]: '裏ドラ',\n            [Yaku_1.AkaDora.name]: '赤ドラ',\n        }\n    }\n};\n\n\n//# sourceURL=webpack:///./src/I18n.ts?");

/***/ }),

/***/ "./src/Mahjong.ts":
/*!************************!*\
  !*** ./src/Mahjong.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Mahjong = void 0;\nconst Collection_1 = __webpack_require__(/*! ./Collection */ \"./src/Collection.ts\");\nconst MahjongScoreCalculator_1 = __webpack_require__(/*! ./MahjongScoreCalculator */ \"./src/MahjongScoreCalculator.ts\");\nconst MahjongDefaultOption_1 = __webpack_require__(/*! ./MahjongDefaultOption */ \"./src/MahjongDefaultOption.ts\");\nclass Mahjong {\n    constructor(paiList, option = {}) {\n        this.option = Object.assign({\n            ...MahjongDefaultOption_1.MahjongDefaultOption,\n            hora: {\n                pai: paiList[paiList.length - 1],\n                fromRon: false,\n                fromTsumo: false,\n                fromRinshanPai: false,\n            },\n            honba: 0,\n            kaze: \"1z\",\n            jikaze: \"1z\",\n            doraList: [],\n            uraDoraList: [],\n            localRules: {\n                fu: {\n                    renfonPai: 4,\n                },\n                honba: 300,\n            },\n            fuList: MahjongDefaultOption_1.MahjongDefaultOption.fuList ?? [],\n            yakuList: MahjongDefaultOption_1.MahjongDefaultOption.yakuList ?? [],\n            additionalSpecialYaku: {\n                withRiichi: false,\n                withDoubleRiichi: false,\n                withOpenRiichi: false,\n                withIppatsu: false,\n                withHaitei: false,\n                withHoutei: false,\n                withChanKan: false,\n            },\n        }, option);\n        this.paiCollection = new Collection_1.PaiCollection(paiList);\n        this.paiPairCollections = this.paiCollection.extract();\n        this.scoreCalculator = new MahjongScoreCalculator_1.MahjongScoreCalculator(this, this.paiPairCollections);\n        if (!this.scoreCalculator.isValid) {\n            throw Error('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on');\n        }\n    }\n}\nexports.Mahjong = Mahjong;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Mahjong.ts?");

/***/ }),

/***/ "./src/MahjongDefaultOption.ts":
/*!*************************************!*\
  !*** ./src/MahjongDefaultOption.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongDefaultOption = void 0;\nconst Fu_1 = __webpack_require__(/*! ./Fu */ \"./src/Fu/index.ts\");\nconst Yaku_1 = __webpack_require__(/*! ./Yaku */ \"./src/Yaku/index.ts\");\n// NOTE: The other property will be merged\nexports.MahjongDefaultOption = {\n    localRules: {\n        fu: {\n            renfonPai: 4,\n        },\n        honba: 0,\n    },\n    fuList: [\n        Fu_1.Futei,\n        Fu_1.Ankou,\n        Fu_1.Minkou,\n        Fu_1.Ankan,\n        Fu_1.Minkan,\n        Fu_1.Tsumo,\n        Fu_1.MenzenKafu,\n        Fu_1.MenFonPai,\n        Fu_1.ChanFonPai,\n        Fu_1.SangenPai,\n        Fu_1.RenFonPai,\n    ],\n    yakuList: [\n        Yaku_1.Tanyao,\n        Yaku_1.Chanta,\n        Yaku_1.Honitsu,\n        Yaku_1.Pinfu,\n        Yaku_1.Houtei,\n        Yaku_1.Haitei,\n        Yaku_1.Riichi,\n        Yaku_1.OpenRiichi,\n        Yaku_1.RinshanKaiho,\n        Yaku_1.RenFon,\n        Yaku_1.ChanFon,\n        Yaku_1.MenFon,\n        Yaku_1.Ippatsu,\n        Yaku_1.Dora,\n        Yaku_1.UraDora,\n        Yaku_1.AkaDora,\n        Yaku_1.Haku,\n        Yaku_1.Hatsu,\n        Yaku_1.Chun,\n        Yaku_1.ChanKan,\n        Yaku_1.IpeiKou,\n        Yaku_1.RyanPeiKou,\n        Yaku_1.ToiToi,\n        Yaku_1.SanAnkou,\n        Yaku_1.SanShokuDouKou,\n        Yaku_1.SanShokuDouJun,\n    ],\n};\n\n\n//# sourceURL=webpack:///./src/MahjongDefaultOption.ts?");

/***/ }),

/***/ "./src/MahjongScoreCalculator.ts":
/*!***************************************!*\
  !*** ./src/MahjongScoreCalculator.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongScoreCalculator = void 0;\nconst MahjongFulfilledYakuValidator_1 = __webpack_require__(/*! ./Validator/MahjongFulfilledYakuValidator */ \"./src/Validator/MahjongFulfilledYakuValidator.ts\");\nconst MahjongFulfilledFuValidator_1 = __webpack_require__(/*! ./Validator/MahjongFulfilledFuValidator */ \"./src/Validator/MahjongFulfilledFuValidator.ts\");\nconst I18n_1 = __importDefault(__webpack_require__(/*! ./I18n */ \"./src/I18n.ts\"));\nclass MahjongScoreCalculator {\n    constructor(mahjong, paiPairCollections) {\n        this.scoreTable = {\n            parent: {\n                1: { 30: 1500, 40: 2000, 50: 2400, 60: 2900, 70: 3400, 80: 3900, 90: 4400, 100: 4800, 110: 5300 },\n                2: { 25: 2400, 30: 2900, 40: 3900, 50: 4800, 60: 5800, 70: 6800, 80: 7700, 90: 8700, 100: 9600, 110: 10600 },\n                3: { 25: 4800, 30: 5800, 40: 7700, 50: 9600, 60: 11600, 70: 12000, 80: 12000, 90: 12000, 100: 12000, 110: 12000 },\n                4: { 25: 9600, 30: 11600, 40: 12000, 50: 12000, 60: 12000, 70: 12000, 80: 12000, 90: 12000, 100: 12000, 110: 12000 },\n            },\n            child: {\n                1: { 30: 1000, 40: 1300, 50: 1600, 60: 2000, 70: 2300, 80: 2600, 90: 2900, 100: 3200, 110: 3600 },\n                2: { 25: 1600, 30: 2000, 40: 2600, 50: 3200, 60: 3900, 70: 4500, 80: 5200, 90: 5800, 100: 6400, 110: 7100 },\n                3: { 25: 3200, 30: 3900, 40: 5200, 50: 6400, 60: 7700, 70: 8000, 80: 8000, 90: 8000, 100: 8000, 110: 8000 },\n                4: { 25: 6400, 30: 7700, 40: 8000, 50: 8000, 60: 8000, 70: 8000, 80: 8000, 90: 8000, 100: 8000, 110: 8000 },\n            },\n        };\n        this.mahjong = mahjong;\n        this.paiPairCollections = paiPairCollections;\n        this.calculatedYakuAndFu = this.paiPairCollections.map(collection => this.calculateYakuAndFu(collection))\n            .filter(score => score.length > 0);\n        this._scoreData = this.calculateScoreData(this.calculatedYakuAndFu);\n    }\n    get scoreData() {\n        return this._scoreData;\n    }\n    get isValid() {\n        return this.scoreData !== null;\n    }\n    calculateYakuAndFu(collection) {\n        const scores = [];\n        const yakuValidator = new MahjongFulfilledYakuValidator_1.MahjongFulfilledYakuValidator(collection, this.mahjong.option);\n        if (yakuValidator.validate()) {\n            scores.push(...yakuValidator.fulfilled.map(yaku => ({\n                isYaku: true,\n                yaku,\n            })));\n        }\n        const fuValidator = new MahjongFulfilledFuValidator_1.MahjongFulfilledFuValidator(collection, yakuValidator.fulfilled, this.mahjong.option);\n        if (fuValidator.validate()) {\n            scores.push(...fuValidator.fulfilled.map(fu => ({\n                isYaku: false,\n                fu,\n            })));\n        }\n        return scores;\n    }\n    calculateScoreData(yakuAndFuList) {\n        let scoreData = null;\n        for (const yakuAndFu of yakuAndFuList) {\n            if (!yakuAndFu.some(score => score.isYaku && score.yaku.availableHora)) {\n                continue;\n            }\n            const tempScoreData = yakuAndFu.reduce((carry, score) => {\n                if (score.isYaku) {\n                    carry.appliedYakuList?.push({\n                        name: I18n_1.default.ja.yaku[score.yaku.constructor.name] ?? score.yaku.constructor.name,\n                        score: score.yaku.han,\n                    });\n                }\n                else {\n                    carry.appliedFuList?.push({\n                        name: I18n_1.default.ja.fu[score.fu.constructor.name] ?? score.fu.constructor.name,\n                        score: score.fu.value,\n                    });\n                }\n                return carry;\n            }, {\n                appliedFuList: [],\n                appliedYakuList: [],\n            });\n            tempScoreData.fu = tempScoreData.appliedFuList?.map(fu => fu.score).sum() ?? 0;\n            // NOTE: The fu must be rounded up to the nearest one\n            tempScoreData.fu = tempScoreData.fu === 25\n                ? tempScoreData.fu\n                : Math.ceil(tempScoreData.fu / 10) * 10;\n            tempScoreData.yaku = tempScoreData.appliedYakuList?.map(yaku => yaku.score).sum() ?? 0;\n            tempScoreData.honba = this.mahjong.option.honba;\n            let baseScore = tempScoreData.honba * this.mahjong.option.localRules.honba;\n            const isParent = this.mahjong.option.jikaze === '1z';\n            const roundUpScore = (score) => Math.ceil(score / 100) * 100;\n            // NOTE: Normally scoring\n            if (tempScoreData.yaku >= 11 && tempScoreData.yaku <= 12) {\n                baseScore += isParent ? 36000 : 24000;\n            }\n            else if (tempScoreData.yaku >= 8 && tempScoreData.yaku <= 10) {\n                baseScore += isParent ? 24000 : 16000;\n            }\n            else if (tempScoreData.yaku >= 6 && tempScoreData.yaku <= 7) {\n                baseScore += isParent ? 18000 : 12000;\n            }\n            else if (tempScoreData.yaku >= 5) {\n                baseScore += isParent ? 12000 : 8000;\n            }\n            else {\n                baseScore += this.scoreTable?.[isParent ? 'parent' : 'child']?.[tempScoreData.yaku]?.[tempScoreData.fu] ?? 0;\n            }\n            if (this.mahjong.option.hora.fromTsumo) {\n                if (isParent) {\n                    tempScoreData.score = {\n                        base: baseScore,\n                        child: roundUpScore(baseScore / 3),\n                    };\n                }\n                else {\n                    tempScoreData.score = {\n                        base: baseScore,\n                        parent: roundUpScore(baseScore / 2),\n                        child: roundUpScore(baseScore / 4),\n                    };\n                }\n            }\n            else {\n                tempScoreData.score = {\n                    base: baseScore,\n                };\n            }\n            if (!scoreData || (tempScoreData.score && scoreData.score && tempScoreData.score > scoreData.score)) {\n                scoreData = tempScoreData;\n            }\n        }\n        console.log(scoreData);\n        if (!scoreData) {\n            return null;\n        }\n        return Object.assign({\n            score: { base: 0 },\n            fu: 0,\n            yaku: 0,\n            honba: 0,\n            appliedFuList: [],\n            appliedYakuList: [],\n        }, scoreData);\n    }\n}\nexports.MahjongScoreCalculator = MahjongScoreCalculator;\n\n\n//# sourceURL=webpack:///./src/MahjongScoreCalculator.ts?");

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

eval("\nArray.prototype.chunk = function (size) {\n    return Array.from({ length: Math.ceil(this.length / size) }, (_, i) => this.slice(i * size, (i + 1) * size));\n};\nArray.prototype.includesWithMatrix = function (items, type = 'OR') {\n    return type === 'AND'\n        ? items.every(item => this.includes(item))\n        : items.some(item => this.includes(item));\n};\nArray.prototype.sum = function () {\n    return this.reduce((carry, item) => {\n        return carry + item;\n    }, 0);\n};\n\n\n//# sourceURL=webpack:///./src/Utilities.ts?");

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

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongFulfilledFuValidator = void 0;\nconst MahjongFormatValidator_1 = __webpack_require__(/*! ./MahjongFormatValidator */ \"./src/Validator/MahjongFormatValidator.ts\");\nclass MahjongFulfilledFuValidator {\n    constructor(paiPairCollection, yakuList, option) {\n        this._fulfilled = [];\n        this.option = option;\n        this.yakuList = yakuList;\n        this.paiPairCollection = paiPairCollection;\n    }\n    get fulfilled() {\n        return this._fulfilled;\n    }\n    validate() {\n        if (this.paiPairCollection.paiPairs.length === 0) {\n            return false;\n        }\n        if (!(new MahjongFormatValidator_1.MahjongFormatValidator(this.paiPairCollection)).validate()) {\n            return false;\n        }\n        for (const fuName of this.option.fuList) {\n            let processor = new fuName(this.paiPairCollection, this.yakuList, this.option);\n            if (processor.isFulfilled) {\n                this._fulfilled.push(processor);\n            }\n        }\n        return true;\n    }\n}\nexports.MahjongFulfilledFuValidator = MahjongFulfilledFuValidator;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Validator/MahjongFulfilledFuValidator.ts?");

/***/ }),

/***/ "./src/Validator/MahjongFulfilledYakuValidator.ts":
/*!********************************************************!*\
  !*** ./src/Validator/MahjongFulfilledYakuValidator.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MahjongFulfilledYakuValidator = void 0;\nconst MahjongFormatValidator_1 = __webpack_require__(/*! ./MahjongFormatValidator */ \"./src/Validator/MahjongFormatValidator.ts\");\nclass MahjongFulfilledYakuValidator {\n    constructor(paiPairCollection, option) {\n        this._fulfilled = [];\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get fulfilled() {\n        return this._fulfilled;\n    }\n    validate() {\n        if (this.paiPairCollection.paiPairs.length === 0) {\n            return false;\n        }\n        if (!(new MahjongFormatValidator_1.MahjongFormatValidator(this.paiPairCollection)).validate()) {\n            return false;\n        }\n        for (const yakuName of this.option.yakuList) {\n            let processor = new yakuName(this.paiPairCollection, this.option);\n            let record = null;\n            do {\n                if (processor.isFulfilled) {\n                    record = processor;\n                }\n                if (!processor.parent) {\n                    break;\n                }\n                processor = processor.parent;\n            } while (processor);\n            if (record !== null) {\n                record.availableHora = processor.availableHora === undefined || processor.availableHora;\n                this._fulfilled.push(record);\n            }\n        }\n        return this._fulfilled.length > 0;\n    }\n}\nexports.MahjongFulfilledYakuValidator = MahjongFulfilledYakuValidator;\nexports[\"default\"] = {};\n\n\n//# sourceURL=webpack:///./src/Validator/MahjongFulfilledYakuValidator.ts?");

/***/ }),

/***/ "./src/Yaku/AkaDora.ts":
/*!*****************************!*\
  !*** ./src/Yaku/AkaDora.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AkaDora = void 0;\nclass AkaDora {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get availableHora() {\n        // NOTE: A dora is not available hora, if you need to hora, and then you need to have other a yaku.\n        return false;\n    }\n    get han() {\n        return this.paiPairCollection.countAkaDora;\n    }\n    get isFulfilled() {\n        return this.han > 0;\n    }\n}\nexports.AkaDora = AkaDora;\n\n\n//# sourceURL=webpack:///./src/Yaku/AkaDora.ts?");

/***/ }),

/***/ "./src/Yaku/ChanFon.ts":
/*!*****************************!*\
  !*** ./src/Yaku/ChanFon.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChanFon = void 0;\nclass ChanFon {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.kaze !== this.option.jikaze && this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan)\n            && paiPair.pattern.includes(this.option.kaze));\n    }\n}\nexports.ChanFon = ChanFon;\n\n\n//# sourceURL=webpack:///./src/Yaku/ChanFon.ts?");

/***/ }),

/***/ "./src/Yaku/ChanKan.ts":
/*!*****************************!*\
  !*** ./src/Yaku/ChanKan.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChanKan = void 0;\nclass ChanKan {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.additionalSpecialYaku.withChanKan;\n    }\n}\nexports.ChanKan = ChanKan;\n\n\n//# sourceURL=webpack:///./src/Yaku/ChanKan.ts?");

/***/ }),

/***/ "./src/Yaku/Chanta.ts":
/*!****************************!*\
  !*** ./src/Yaku/Chanta.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Chanta = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nconst JunChanta_1 = __webpack_require__(/*! ./JunChanta */ \"./src/Yaku/JunChanta.ts\");\nclass Chanta {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 1\n            : 2;\n    }\n    get parent() {\n        return new JunChanta_1.JunChanta(this.paiPairCollection, this.option);\n    }\n    get isFulfilled() {\n        const result = [];\n        const allowedPatterns = PaiGenerator_1.PaiGenerator.generatePenchanHai();\n        for (const paiPair of this.paiPairCollection.paiPairs) {\n            result.push(allowedPatterns.includes(paiPair.pattern) || paiPair.pattern.some(pai => PaiGenerator_1.PaiGenerator.generateJiHai().includes(pai)));\n        }\n        return result.every(v => v);\n    }\n}\nexports.Chanta = Chanta;\n\n\n//# sourceURL=webpack:///./src/Yaku/Chanta.ts?");

/***/ }),

/***/ "./src/Yaku/ChiiToitsu.ts":
/*!********************************!*\
  !*** ./src/Yaku/ChiiToitsu.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChiiToitsu = void 0;\nclass ChiiToitsu {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 2;\n    }\n    get isFulfilled() {\n        return this.paiPairCollection.isChiitoitsu;\n    }\n}\nexports.ChiiToitsu = ChiiToitsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/ChiiToitsu.ts?");

/***/ }),

/***/ "./src/Yaku/Chinitsu.ts":
/*!******************************!*\
  !*** ./src/Yaku/Chinitsu.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Chinitsu = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass Chinitsu {\n    constructor(paiPairCollection, _) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 5\n            : 6;\n    }\n    get isFulfilled() {\n        const { m, p, s } = PaiGenerator_1.PaiGenerator.generateOneToNine();\n        for (const pai of [m, p, s]) {\n            const result = [];\n            for (const paiPair of this.paiPairCollection.paiPairs) {\n                const hasSameColored = paiPair.pattern.every(paiName => pai.includes(paiName));\n                result.push(hasSameColored);\n            }\n            if (result.every(v => v)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.Chinitsu = Chinitsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Chinitsu.ts?");

/***/ }),

/***/ "./src/Yaku/Chun.ts":
/*!**************************!*\
  !*** ./src/Yaku/Chun.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Chun = void 0;\nclass Chun {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.paiPairCollection.paiPairs.some(paiPair => paiPair.isKoutsu && paiPair.pattern.includes('7z'));\n    }\n}\nexports.Chun = Chun;\n\n\n//# sourceURL=webpack:///./src/Yaku/Chun.ts?");

/***/ }),

/***/ "./src/Yaku/Dora.ts":
/*!**************************!*\
  !*** ./src/Yaku/Dora.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Dora = void 0;\nclass Dora {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get availableHora() {\n        // NOTE: A dora is not available hora, if you need to hora, and then you need to have other a yaku.\n        return false;\n    }\n    get han() {\n        return this.paiPairCollection.paiPairs.reduce((carry, item) => carry + (this.option.doraList.reduce((dora, pai) => dora + (this.option.doraList.includes(pai) ? 1 : 0), 0)), 0);\n    }\n    get isFulfilled() {\n        return this.han > 0;\n    }\n}\nexports.Dora = Dora;\n\n\n//# sourceURL=webpack:///./src/Yaku/Dora.ts?");

/***/ }),

/***/ "./src/Yaku/DoubleRiichi.ts":
/*!**********************************!*\
  !*** ./src/Yaku/DoubleRiichi.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DoubleRiichi = void 0;\nclass DoubleRiichi {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 2;\n    }\n    get isFulfilled() {\n        return this.option.additionalSpecialYaku.withDoubleRiichi || false;\n    }\n}\nexports.DoubleRiichi = DoubleRiichi;\n\n\n//# sourceURL=webpack:///./src/Yaku/DoubleRiichi.ts?");

/***/ }),

/***/ "./src/Yaku/Haitei.ts":
/*!****************************!*\
  !*** ./src/Yaku/Haitei.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Haitei = void 0;\nclass Haitei {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.additionalSpecialYaku.withHaitei;\n    }\n}\nexports.Haitei = Haitei;\n\n\n//# sourceURL=webpack:///./src/Yaku/Haitei.ts?");

/***/ }),

/***/ "./src/Yaku/Haku.ts":
/*!**************************!*\
  !*** ./src/Yaku/Haku.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Haku = void 0;\nclass Haku {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.paiPairCollection.paiPairs.some(paiPair => paiPair.isKoutsu && paiPair.pattern.includes('5z'));\n    }\n}\nexports.Haku = Haku;\n\n\n//# sourceURL=webpack:///./src/Yaku/Haku.ts?");

/***/ }),

/***/ "./src/Yaku/Hatsu.ts":
/*!***************************!*\
  !*** ./src/Yaku/Hatsu.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Hatsu = void 0;\nclass Hatsu {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.paiPairCollection.paiPairs.some(paiPair => paiPair.isKoutsu && paiPair.pattern.includes('6z'));\n    }\n}\nexports.Hatsu = Hatsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Hatsu.ts?");

/***/ }),

/***/ "./src/Yaku/Honitsu.ts":
/*!*****************************!*\
  !*** ./src/Yaku/Honitsu.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Honitsu = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nconst Chinitsu_1 = __webpack_require__(/*! ./Chinitsu */ \"./src/Yaku/Chinitsu.ts\");\nclass Honitsu {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 2\n            : 3;\n    }\n    get parent() {\n        return new Chinitsu_1.Chinitsu(this.paiPairCollection, this.option);\n    }\n    get isFulfilled() {\n        const { m, p, s } = PaiGenerator_1.PaiGenerator.generateOneToNine();\n        const jiHai = PaiGenerator_1.PaiGenerator.generateJiHai();\n        for (const pai of [m, p, s]) {\n            const result = [];\n            for (const paiPair of this.paiPairCollection.paiPairs) {\n                const hasSameColored = paiPair.pattern.every(paiName => [...pai, ...jiHai].includes(paiName));\n                result.push(hasSameColored);\n            }\n            if (result.every(v => v)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.Honitsu = Honitsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Honitsu.ts?");

/***/ }),

/***/ "./src/Yaku/Houtei.ts":
/*!****************************!*\
  !*** ./src/Yaku/Houtei.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Houtei = void 0;\nclass Houtei {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.additionalSpecialYaku.withHoutei;\n    }\n}\nexports.Houtei = Houtei;\n\n\n//# sourceURL=webpack:///./src/Yaku/Houtei.ts?");

/***/ }),

/***/ "./src/Yaku/IpeiKou.ts":
/*!*****************************!*\
  !*** ./src/Yaku/IpeiKou.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.IpeiKou = void 0;\nconst RyanPeiKou_1 = __webpack_require__(/*! ./RyanPeiKou */ \"./src/Yaku/RyanPeiKou.ts\");\nclass IpeiKou {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get parent() {\n        return new RyanPeiKou_1.RyanPeiKou(this.paiPairCollection, this.option);\n    }\n    get isFulfilled() {\n        // NOTE: IpeiKou/RyanPeikou is not fulfilled including furo in PaiPairs\n        if (this.paiPairCollection.hasFuro) {\n            return false;\n        }\n        for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {\n            const targetPaiPair = this.paiPairCollection.paiPairs[i];\n            if (!targetPaiPair.isShuntsu) {\n                continue;\n            }\n            for (let j = i + 1; j < this.paiPairCollection.paiPairs.length; j++) {\n                const sourcePaiPair = this.paiPairCollection.paiPairs[j];\n                if (!sourcePaiPair.isShuntsu) {\n                    continue;\n                }\n                if (targetPaiPair.pattern.includesWithMatrix(sourcePaiPair.pattern, 'AND')) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n}\nexports.IpeiKou = IpeiKou;\n\n\n//# sourceURL=webpack:///./src/Yaku/IpeiKou.ts?");

/***/ }),

/***/ "./src/Yaku/Ippatsu.ts":
/*!*****************************!*\
  !*** ./src/Yaku/Ippatsu.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ippatsu = void 0;\nclass Ippatsu {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.additionalSpecialYaku.withIppatsu;\n    }\n}\nexports.Ippatsu = Ippatsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Ippatsu.ts?");

/***/ }),

/***/ "./src/Yaku/JunChanta.ts":
/*!*******************************!*\
  !*** ./src/Yaku/JunChanta.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.JunChanta = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass JunChanta {\n    constructor(paiPairCollection, _) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return this.paiPairCollection.hasFuro\n            ? 2\n            : 3;\n    }\n    get isFulfilled() {\n        const result = [];\n        const allowedPatterns = PaiGenerator_1.PaiGenerator.generatePenchanHai();\n        for (const paiPair of this.paiPairCollection.paiPairs) {\n            result.push(allowedPatterns.includes(paiPair.pattern));\n        }\n        return result.every(v => v);\n    }\n}\nexports.JunChanta = JunChanta;\n\n\n//# sourceURL=webpack:///./src/Yaku/JunChanta.ts?");

/***/ }),

/***/ "./src/Yaku/MenFon.ts":
/*!****************************!*\
  !*** ./src/Yaku/MenFon.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MenFon = void 0;\nclass MenFon {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.kaze !== this.option.jikaze && this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan)\n            && paiPair.pattern.includes(this.option.jikaze));\n    }\n}\nexports.MenFon = MenFon;\n\n\n//# sourceURL=webpack:///./src/Yaku/MenFon.ts?");

/***/ }),

/***/ "./src/Yaku/OpenRiichi.ts":
/*!********************************!*\
  !*** ./src/Yaku/OpenRiichi.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.OpenRiichi = void 0;\nclass OpenRiichi {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.additionalSpecialYaku.withOpenRiichi || false;\n    }\n}\nexports.OpenRiichi = OpenRiichi;\n\n\n//# sourceURL=webpack:///./src/Yaku/OpenRiichi.ts?");

/***/ }),

/***/ "./src/Yaku/Pinfu.ts":
/*!***************************!*\
  !*** ./src/Yaku/Pinfu.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Pinfu = void 0;\nclass Pinfu {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        const horaPai = this.option.hora.pai;\n        if (!horaPai) {\n            return false;\n        }\n        // NOTE: The pinfu yaku is not allowed furo\n        if (this.paiPairCollection.hasFuro) {\n            return false;\n        }\n        for (const paiPair of this.paiPairCollection.paiPairs) {\n            // NOTE: The pinfu yaku waits only shuntsu, in other case, it is not fulfilled.\n            if (!paiPair.isShuntsu) {\n                continue;\n            }\n            const [left, _, right] = paiPair.pattern;\n            // NOTE: The pinfu yaku is not allowed to wait a centered pai in shuntsu.\n            if (left === horaPai || right === horaPai) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.Pinfu = Pinfu;\n\n\n//# sourceURL=webpack:///./src/Yaku/Pinfu.ts?");

/***/ }),

/***/ "./src/Yaku/RenFon.ts":
/*!****************************!*\
  !*** ./src/Yaku/RenFon.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RenFon = void 0;\nclass RenFon {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        // NOTE: Here is same of Dabu-Nan|Ton.\n        return 2;\n    }\n    get isFulfilled() {\n        return this.option.kaze === this.option.jikaze && this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan)\n            && paiPair.pattern.includes(this.option.kaze));\n    }\n}\nexports.RenFon = RenFon;\n\n\n//# sourceURL=webpack:///./src/Yaku/RenFon.ts?");

/***/ }),

/***/ "./src/Yaku/Riichi.ts":
/*!****************************!*\
  !*** ./src/Yaku/Riichi.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Riichi = void 0;\nconst DoubleRiichi_1 = __webpack_require__(/*! ./DoubleRiichi */ \"./src/Yaku/DoubleRiichi.ts\");\nclass Riichi {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get parent() {\n        return new DoubleRiichi_1.DoubleRiichi(this.paiPairCollection, this.option);\n    }\n    get isFulfilled() {\n        return this.option.additionalSpecialYaku.withRiichi || false;\n    }\n}\nexports.Riichi = Riichi;\n\n\n//# sourceURL=webpack:///./src/Yaku/Riichi.ts?");

/***/ }),

/***/ "./src/Yaku/RinshanKaiho.ts":
/*!**********************************!*\
  !*** ./src/Yaku/RinshanKaiho.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RinshanKaiho = void 0;\nclass RinshanKaiho {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        return this.option.hora.fromRinshanPai || false;\n    }\n}\nexports.RinshanKaiho = RinshanKaiho;\n\n\n//# sourceURL=webpack:///./src/Yaku/RinshanKaiho.ts?");

/***/ }),

/***/ "./src/Yaku/RyanPeiKou.ts":
/*!********************************!*\
  !*** ./src/Yaku/RyanPeiKou.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RyanPeiKou = void 0;\nclass RyanPeiKou {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 3;\n    }\n    get isFulfilled() {\n        // NOTE: IpeiKou/RyanPeikou is not fulfilled including furo in PaiPairs\n        if (this.paiPairCollection.hasFuro) {\n            return false;\n        }\n        for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {\n            const targetPaiPair = this.paiPairCollection.paiPairs[i];\n            if (!targetPaiPair.isShuntsu) {\n                continue;\n            }\n            for (let j = i + 1, counter = 0; j < this.paiPairCollection.paiPairs.length; j++) {\n                const sourcePaiPair = this.paiPairCollection.paiPairs[j];\n                if (!sourcePaiPair.isShuntsu) {\n                    continue;\n                }\n                if (targetPaiPair.pattern.includesWithMatrix(sourcePaiPair.pattern, 'AND')) {\n                    counter++;\n                }\n                if (counter === 2) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n}\nexports.RyanPeiKou = RyanPeiKou;\n\n\n//# sourceURL=webpack:///./src/Yaku/RyanPeiKou.ts?");

/***/ }),

/***/ "./src/Yaku/SanAnkou.ts":
/*!******************************!*\
  !*** ./src/Yaku/SanAnkou.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SanAnkou = void 0;\nclass SanAnkou {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 2;\n    }\n    get isFulfilled() {\n        for (let i = 0, counter = 0; i < this.paiPairCollection.paiPairs.length; i++) {\n            const paiPair = this.paiPairCollection.paiPairs[i];\n            if (!paiPair.isFuro && (paiPair.isKoutsu || paiPair.isKan)) {\n                counter++;\n            }\n            if (counter === 3) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.SanAnkou = SanAnkou;\n\n\n//# sourceURL=webpack:///./src/Yaku/SanAnkou.ts?");

/***/ }),

/***/ "./src/Yaku/SanKantsu.ts":
/*!*******************************!*\
  !*** ./src/Yaku/SanKantsu.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SanKantsu = void 0;\nclass SanKantsu {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 2;\n    }\n    get isFulfilled() {\n        for (let i = 0, counter = 0; i < this.paiPairCollection.paiPairs.length; i++) {\n            const paiPair = this.paiPairCollection.paiPairs[i];\n            if (paiPair.isKan) {\n                counter++;\n            }\n            if (counter === 3) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.SanKantsu = SanKantsu;\n\n\n//# sourceURL=webpack:///./src/Yaku/SanKantsu.ts?");

/***/ }),

/***/ "./src/Yaku/SanShokuDouJun.ts":
/*!************************************!*\
  !*** ./src/Yaku/SanShokuDouJun.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SanShokuDouJun = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nclass SanShokuDouJun {\n    constructor(paiPairCollection, option) {\n        this.includeFuro = false;\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return this.includeFuro\n            ? 1\n            : 2;\n    }\n    get isFulfilled() {\n        const contains = (paiNames) => this.paiPairCollection.paiPairs\n            .some(paiPair => {\n            const result = paiPair.isShuntsu && paiPair.pattern.includesWithMatrix(paiNames, 'AND');\n            if (result && paiPair.isFuro) {\n                this.includeFuro = true;\n            }\n            return result;\n        });\n        for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {\n            const targetPaiPair = this.paiPairCollection.paiPairs[i];\n            if (!targetPaiPair.isShuntsu) {\n                continue;\n            }\n            const [aNumber] = Extractor_1.PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[0]);\n            const [bNumber] = Extractor_1.PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[1]);\n            const [cNumber] = Extractor_1.PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[2]);\n            const shuntsuManzu = [`${aNumber}m`, `${bNumber}m`, `${cNumber}m`];\n            const shuntsuPinzu = [`${aNumber}p`, `${bNumber}p`, `${cNumber}p`];\n            const shuntsuSouzu = [`${aNumber}s`, `${bNumber}s`, `${cNumber}s`];\n            if (contains(shuntsuManzu) && contains(shuntsuPinzu) && contains(shuntsuSouzu)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.SanShokuDouJun = SanShokuDouJun;\n\n\n//# sourceURL=webpack:///./src/Yaku/SanShokuDouJun.ts?");

/***/ }),

/***/ "./src/Yaku/SanShokuDouKou.ts":
/*!************************************!*\
  !*** ./src/Yaku/SanShokuDouKou.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SanShokuDouKou = void 0;\nconst Extractor_1 = __webpack_require__(/*! ../Extractor */ \"./src/Extractor.ts\");\nclass SanShokuDouKou {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 2;\n    }\n    get isFulfilled() {\n        const contains = (paiName) => this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includes(paiName));\n        for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {\n            const targetPaiPair = this.paiPairCollection.paiPairs[i];\n            if (!targetPaiPair.isKoutsu && !targetPaiPair.isKan) {\n                continue;\n            }\n            const [aNumber, aGroup] = Extractor_1.PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[0]);\n            const koutsuManzu = `${aNumber}m`;\n            const koutsuPinzu = `${aNumber}p`;\n            const koutsuSouzu = `${aNumber}s`;\n            if (contains(koutsuManzu) && contains(koutsuPinzu) && contains(koutsuSouzu)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports.SanShokuDouKou = SanShokuDouKou;\n\n\n//# sourceURL=webpack:///./src/Yaku/SanShokuDouKou.ts?");

/***/ }),

/***/ "./src/Yaku/Tanyao.ts":
/*!****************************!*\
  !*** ./src/Yaku/Tanyao.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Tanyao = void 0;\nconst PaiGenerator_1 = __webpack_require__(/*! ../PaiGenerator */ \"./src/PaiGenerator.ts\");\nclass Tanyao {\n    constructor(paiPairCollection, _) {\n        this.paiPairCollection = paiPairCollection;\n    }\n    get han() {\n        return 1;\n    }\n    get isFulfilled() {\n        for (const paiPair of this.paiPairCollection.paiPairs) {\n            const hasYaoChuHai = paiPair.pattern.some(paiName => PaiGenerator_1.PaiGenerator.generateYaoChuHai().includes(paiName));\n            if (hasYaoChuHai) {\n                return false;\n            }\n        }\n        return true;\n    }\n}\nexports.Tanyao = Tanyao;\n\n\n//# sourceURL=webpack:///./src/Yaku/Tanyao.ts?");

/***/ }),

/***/ "./src/Yaku/ToiToi.ts":
/*!****************************!*\
  !*** ./src/Yaku/ToiToi.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ToiToi = void 0;\nclass ToiToi {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get han() {\n        return 2;\n    }\n    get isFulfilled() {\n        return this.paiPairCollection.hasFuro &&\n            this.paiPairCollection.paiPairs.every(paiPair => paiPair.isKoutsu || paiPair.isKan);\n    }\n}\nexports.ToiToi = ToiToi;\n\n\n//# sourceURL=webpack:///./src/Yaku/ToiToi.ts?");

/***/ }),

/***/ "./src/Yaku/UraDora.ts":
/*!*****************************!*\
  !*** ./src/Yaku/UraDora.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UraDora = void 0;\nclass UraDora {\n    constructor(paiPairCollection, option) {\n        this.paiPairCollection = paiPairCollection;\n        this.option = option;\n    }\n    get availableHora() {\n        // NOTE: A dora is not available hora, if you need to hora, and then you need to have other a yaku.\n        return false;\n    }\n    get han() {\n        return this.paiPairCollection.paiPairs.reduce((carry, item) => carry + (this.option.uraDoraList.reduce((dora, pai) => dora + (this.option.uraDoraList.includes(pai) ? 1 : 0), 0)), 0);\n    }\n    get isFulfilled() {\n        return this.han > 0;\n    }\n}\nexports.UraDora = UraDora;\n\n\n//# sourceURL=webpack:///./src/Yaku/UraDora.ts?");

/***/ }),

/***/ "./src/Yaku/index.ts":
/*!***************************!*\
  !*** ./src/Yaku/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChiiToitsu = exports.SanKantsu = exports.SanShokuDouJun = exports.SanShokuDouKou = exports.SanAnkou = exports.ToiToi = exports.RyanPeiKou = exports.IpeiKou = exports.ChanKan = exports.Chun = exports.Hatsu = exports.Haku = exports.AkaDora = exports.UraDora = exports.Dora = exports.RenFon = exports.ChanFon = exports.MenFon = exports.Ippatsu = exports.RinshanKaiho = exports.Houtei = exports.Haitei = exports.DoubleRiichi = exports.OpenRiichi = exports.Riichi = exports.Chinitsu = exports.JunChanta = exports.Pinfu = exports.Honitsu = exports.Chanta = exports.Tanyao = void 0;\nconst Tanyao_1 = __webpack_require__(/*! ./Tanyao */ \"./src/Yaku/Tanyao.ts\");\nObject.defineProperty(exports, \"Tanyao\", ({ enumerable: true, get: function () { return Tanyao_1.Tanyao; } }));\nconst Chanta_1 = __webpack_require__(/*! ./Chanta */ \"./src/Yaku/Chanta.ts\");\nObject.defineProperty(exports, \"Chanta\", ({ enumerable: true, get: function () { return Chanta_1.Chanta; } }));\nconst JunChanta_1 = __webpack_require__(/*! ./JunChanta */ \"./src/Yaku/JunChanta.ts\");\nObject.defineProperty(exports, \"JunChanta\", ({ enumerable: true, get: function () { return JunChanta_1.JunChanta; } }));\nconst Chinitsu_1 = __webpack_require__(/*! ./Chinitsu */ \"./src/Yaku/Chinitsu.ts\");\nObject.defineProperty(exports, \"Chinitsu\", ({ enumerable: true, get: function () { return Chinitsu_1.Chinitsu; } }));\nconst Honitsu_1 = __webpack_require__(/*! ./Honitsu */ \"./src/Yaku/Honitsu.ts\");\nObject.defineProperty(exports, \"Honitsu\", ({ enumerable: true, get: function () { return Honitsu_1.Honitsu; } }));\nconst Pinfu_1 = __webpack_require__(/*! ./Pinfu */ \"./src/Yaku/Pinfu.ts\");\nObject.defineProperty(exports, \"Pinfu\", ({ enumerable: true, get: function () { return Pinfu_1.Pinfu; } }));\nconst Riichi_1 = __webpack_require__(/*! ./Riichi */ \"./src/Yaku/Riichi.ts\");\nObject.defineProperty(exports, \"Riichi\", ({ enumerable: true, get: function () { return Riichi_1.Riichi; } }));\nconst OpenRiichi_1 = __webpack_require__(/*! ./OpenRiichi */ \"./src/Yaku/OpenRiichi.ts\");\nObject.defineProperty(exports, \"OpenRiichi\", ({ enumerable: true, get: function () { return OpenRiichi_1.OpenRiichi; } }));\nconst DoubleRiichi_1 = __webpack_require__(/*! ./DoubleRiichi */ \"./src/Yaku/DoubleRiichi.ts\");\nObject.defineProperty(exports, \"DoubleRiichi\", ({ enumerable: true, get: function () { return DoubleRiichi_1.DoubleRiichi; } }));\nconst Haitei_1 = __webpack_require__(/*! ./Haitei */ \"./src/Yaku/Haitei.ts\");\nObject.defineProperty(exports, \"Haitei\", ({ enumerable: true, get: function () { return Haitei_1.Haitei; } }));\nconst Houtei_1 = __webpack_require__(/*! ./Houtei */ \"./src/Yaku/Houtei.ts\");\nObject.defineProperty(exports, \"Houtei\", ({ enumerable: true, get: function () { return Houtei_1.Houtei; } }));\nconst RinshanKaiho_1 = __webpack_require__(/*! ./RinshanKaiho */ \"./src/Yaku/RinshanKaiho.ts\");\nObject.defineProperty(exports, \"RinshanKaiho\", ({ enumerable: true, get: function () { return RinshanKaiho_1.RinshanKaiho; } }));\nconst Ippatsu_1 = __webpack_require__(/*! ./Ippatsu */ \"./src/Yaku/Ippatsu.ts\");\nObject.defineProperty(exports, \"Ippatsu\", ({ enumerable: true, get: function () { return Ippatsu_1.Ippatsu; } }));\nconst MenFon_1 = __webpack_require__(/*! ./MenFon */ \"./src/Yaku/MenFon.ts\");\nObject.defineProperty(exports, \"MenFon\", ({ enumerable: true, get: function () { return MenFon_1.MenFon; } }));\nconst ChanFon_1 = __webpack_require__(/*! ./ChanFon */ \"./src/Yaku/ChanFon.ts\");\nObject.defineProperty(exports, \"ChanFon\", ({ enumerable: true, get: function () { return ChanFon_1.ChanFon; } }));\nconst RenFon_1 = __webpack_require__(/*! ./RenFon */ \"./src/Yaku/RenFon.ts\");\nObject.defineProperty(exports, \"RenFon\", ({ enumerable: true, get: function () { return RenFon_1.RenFon; } }));\nconst Dora_1 = __webpack_require__(/*! ./Dora */ \"./src/Yaku/Dora.ts\");\nObject.defineProperty(exports, \"Dora\", ({ enumerable: true, get: function () { return Dora_1.Dora; } }));\nconst UraDora_1 = __webpack_require__(/*! ./UraDora */ \"./src/Yaku/UraDora.ts\");\nObject.defineProperty(exports, \"UraDora\", ({ enumerable: true, get: function () { return UraDora_1.UraDora; } }));\nconst AkaDora_1 = __webpack_require__(/*! ./AkaDora */ \"./src/Yaku/AkaDora.ts\");\nObject.defineProperty(exports, \"AkaDora\", ({ enumerable: true, get: function () { return AkaDora_1.AkaDora; } }));\nconst Haku_1 = __webpack_require__(/*! ./Haku */ \"./src/Yaku/Haku.ts\");\nObject.defineProperty(exports, \"Haku\", ({ enumerable: true, get: function () { return Haku_1.Haku; } }));\nconst Hatsu_1 = __webpack_require__(/*! ./Hatsu */ \"./src/Yaku/Hatsu.ts\");\nObject.defineProperty(exports, \"Hatsu\", ({ enumerable: true, get: function () { return Hatsu_1.Hatsu; } }));\nconst Chun_1 = __webpack_require__(/*! ./Chun */ \"./src/Yaku/Chun.ts\");\nObject.defineProperty(exports, \"Chun\", ({ enumerable: true, get: function () { return Chun_1.Chun; } }));\nconst ChanKan_1 = __webpack_require__(/*! ./ChanKan */ \"./src/Yaku/ChanKan.ts\");\nObject.defineProperty(exports, \"ChanKan\", ({ enumerable: true, get: function () { return ChanKan_1.ChanKan; } }));\nconst IpeiKou_1 = __webpack_require__(/*! ./IpeiKou */ \"./src/Yaku/IpeiKou.ts\");\nObject.defineProperty(exports, \"IpeiKou\", ({ enumerable: true, get: function () { return IpeiKou_1.IpeiKou; } }));\nconst RyanPeiKou_1 = __webpack_require__(/*! ./RyanPeiKou */ \"./src/Yaku/RyanPeiKou.ts\");\nObject.defineProperty(exports, \"RyanPeiKou\", ({ enumerable: true, get: function () { return RyanPeiKou_1.RyanPeiKou; } }));\nconst ToiToi_1 = __webpack_require__(/*! ./ToiToi */ \"./src/Yaku/ToiToi.ts\");\nObject.defineProperty(exports, \"ToiToi\", ({ enumerable: true, get: function () { return ToiToi_1.ToiToi; } }));\nconst SanAnkou_1 = __webpack_require__(/*! ./SanAnkou */ \"./src/Yaku/SanAnkou.ts\");\nObject.defineProperty(exports, \"SanAnkou\", ({ enumerable: true, get: function () { return SanAnkou_1.SanAnkou; } }));\nconst SanShokuDouKou_1 = __webpack_require__(/*! ./SanShokuDouKou */ \"./src/Yaku/SanShokuDouKou.ts\");\nObject.defineProperty(exports, \"SanShokuDouKou\", ({ enumerable: true, get: function () { return SanShokuDouKou_1.SanShokuDouKou; } }));\nconst SanShokuDouJun_1 = __webpack_require__(/*! ./SanShokuDouJun */ \"./src/Yaku/SanShokuDouJun.ts\");\nObject.defineProperty(exports, \"SanShokuDouJun\", ({ enumerable: true, get: function () { return SanShokuDouJun_1.SanShokuDouJun; } }));\nconst SanKantsu_1 = __webpack_require__(/*! ./SanKantsu */ \"./src/Yaku/SanKantsu.ts\");\nObject.defineProperty(exports, \"SanKantsu\", ({ enumerable: true, get: function () { return SanKantsu_1.SanKantsu; } }));\nconst ChiiToitsu_1 = __webpack_require__(/*! ./ChiiToitsu */ \"./src/Yaku/ChiiToitsu.ts\");\nObject.defineProperty(exports, \"ChiiToitsu\", ({ enumerable: true, get: function () { return ChiiToitsu_1.ChiiToitsu; } }));\n\n\n//# sourceURL=webpack:///./src/Yaku/index.ts?");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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