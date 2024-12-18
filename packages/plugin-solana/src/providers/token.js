"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenProvider = exports.TokenProvider = void 0;
var eliza_1 = require("@ai16z/eliza");
var node_cache_1 = require("node-cache");
var path = require("path");
var bignumber_ts_1 = require("../bignumber.ts");
var wallet_ts_1 = require("./wallet.ts");
var web3_js_1 = require("@solana/web3.js");
var keypairUtils_ts_1 = require("../keypairUtils.ts");
var PROVIDER_CONFIG = {
    COINGECKO_API: "https://api.coingecko.com/api/v3",
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    DEFAULT_RPC: "https://api.mainnet-beta.solana.com",
    TOKEN_ADDRESSES: {
        SOL: "solana", // CoinGecko ID for Solana
        BTC: "bitcoin", // CoinGecko ID for Bitcoin
        ETH: "ethereum", // CoinGecko ID for Ethereum
    },
    MAIN_WALLET: "",
};
var TokenProvider = /** @class */ (function () {
    function TokenProvider(
    //  private connection: Connection,
    tokenAddress, walletProvider, cacheManager) {
        this.tokenAddress = tokenAddress;
        this.walletProvider = walletProvider;
        this.cacheManager = cacheManager;
        this.cacheKey = "solana/tokens";
        this.NETWORK_ID = 1399811149;
        this.GRAPHQL_ENDPOINT = "https://graph.codex.io/graphql";
        this.cache = new node_cache_1.default({ stdTTL: 300 }); // 5 minutes cache
    }
    TokenProvider.prototype.readFromCache = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cacheManager.get(path.join(this.cacheKey, key))];
                    case 1:
                        cached = _a.sent();
                        return [2 /*return*/, cached];
                }
            });
        });
    };
    TokenProvider.prototype.writeToCache = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cacheManager.set(path.join(this.cacheKey, key), data, {
                            expires: Date.now() + 5 * 60 * 1000,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.getCachedData = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var cachedData, fileCachedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cachedData = this.cache.get(key);
                        if (cachedData) {
                            return [2 /*return*/, cachedData];
                        }
                        return [4 /*yield*/, this.readFromCache(key)];
                    case 1:
                        fileCachedData = _a.sent();
                        if (fileCachedData) {
                            // Populate in-memory cache
                            this.cache.set(key, fileCachedData);
                            return [2 /*return*/, fileCachedData];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    TokenProvider.prototype.setCachedData = function (cacheKey, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Set in-memory cache
                        this.cache.set(cacheKey, data);
                        // Write to file-based cache
                        return [4 /*yield*/, this.writeToCache(cacheKey, data)];
                    case 1:
                        // Write to file-based cache
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.fetchWithRetry = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, options) {
            var lastError, _loop_1, i, state_1;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_1 = function (i) {
                            var response, errorText, data, error_1, delay_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 5, , 8]);
                                        return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { headers: __assign({ Accept: "application/json", "x-chain": "solana", "X-API-KEY": eliza_1.settings.BIRDEYE_API_KEY || "" }, options.headers) }))];
                                    case 1:
                                        response = _b.sent();
                                        if (!!response.ok) return [3 /*break*/, 3];
                                        return [4 /*yield*/, response.text()];
                                    case 2:
                                        errorText = _b.sent();
                                        throw new Error("HTTP error! status: ".concat(response.status, ", message: ").concat(errorText));
                                    case 3: return [4 /*yield*/, response.json()];
                                    case 4:
                                        data = _b.sent();
                                        return [2 /*return*/, { value: data }];
                                    case 5:
                                        error_1 = _b.sent();
                                        console.error("Attempt ".concat(i + 1, " failed:"), error_1);
                                        lastError = error_1;
                                        if (!(i < PROVIDER_CONFIG.MAX_RETRIES - 1)) return [3 /*break*/, 7];
                                        delay_1 = PROVIDER_CONFIG.RETRY_DELAY * Math.pow(2, i);
                                        console.log("Waiting ".concat(delay_1, "ms before retrying..."));
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                    case 6:
                                        _b.sent();
                                        return [2 /*return*/, "continue"];
                                    case 7: return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < PROVIDER_CONFIG.MAX_RETRIES)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.error("All attempts failed. Throwing the last error:", lastError);
                        throw lastError;
                }
            });
        });
    };
    TokenProvider.prototype.getTokensInWallet = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var walletInfo, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletProvider.fetchPortfolioValue(runtime)];
                    case 1:
                        walletInfo = _a.sent();
                        items = walletInfo.items;
                        return [2 /*return*/, items];
                }
            });
        });
    };
    // check if the token symbol is in the wallet
    TokenProvider.prototype.getTokenFromWallet = function (runtime, tokenSymbol) {
        return __awaiter(this, void 0, void 0, function () {
            var items, token, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getTokensInWallet(runtime)];
                    case 1:
                        items = _a.sent();
                        token = items.find(function (item) { return item.symbol === tokenSymbol; });
                        if (token) {
                            return [2 /*return*/, token.address];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error checking token in wallet:", error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.fetchTokenCodex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, query, variables, response, token, error_3;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        cacheKey = "token_".concat(this.tokenAddress);
                        cachedData = this.getCachedData(cacheKey);
                        if (cachedData) {
                            console.log("Returning cached token data for ".concat(this.tokenAddress, "."));
                            return [2 /*return*/, cachedData];
                        }
                        query = "\n            query Token($address: String!, $networkId: Int!) {\n              token(input: { address: $address, networkId: $networkId }) {\n                id\n                address\n                cmcId\n                decimals\n                name\n                symbol\n                totalSupply\n                isScam\n                info {\n                  circulatingSupply\n                  imageThumbUrl\n                }\n                explorerData {\n                  blueCheckmark\n                  description\n                  tokenType\n                }\n              }\n            }\n          ";
                        variables = {
                            address: this.tokenAddress,
                            networkId: this.NETWORK_ID, // Replace with your network ID
                        };
                        return [4 /*yield*/, fetch(this.GRAPHQL_ENDPOINT, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: eliza_1.settings.CODEX_API_KEY,
                                },
                                body: JSON.stringify({
                                    query: query,
                                    variables: variables,
                                }),
                            }).then(function (res) { return res.json(); })];
                    case 1:
                        response = _f.sent();
                        token = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.token;
                        if (!token) {
                            throw new Error("No data returned for token ".concat(tokenAddress));
                        }
                        this.setCachedData(cacheKey, token);
                        return [2 /*return*/, {
                                id: token.id,
                                address: token.address,
                                cmcId: token.cmcId,
                                decimals: token.decimals,
                                name: token.name,
                                symbol: token.symbol,
                                totalSupply: token.totalSupply,
                                circulatingSupply: (_c = token.info) === null || _c === void 0 ? void 0 : _c.circulatingSupply,
                                imageThumbUrl: (_d = token.info) === null || _d === void 0 ? void 0 : _d.imageThumbUrl,
                                blueCheckmark: (_e = token.explorerData) === null || _e === void 0 ? void 0 : _e.blueCheckmark,
                                isScam: token.isScam ? true : false,
                            }];
                    case 2:
                        error_3 = _f.sent();
                        console.error("Error fetching token data from Codex:", error_3.message);
                        return [2 /*return*/, {}];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.fetchPrices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, _a, SOL, BTC, ETH, tokens, prices, response, data, error_4;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        cacheKey = "prices";
                        cachedData = this.getCachedData(cacheKey);
                        if (cachedData) {
                            console.log("Returning cached prices.");
                            return [2 /*return*/, cachedData];
                        }
                        _a = PROVIDER_CONFIG.TOKEN_ADDRESSES, SOL = _a.SOL, BTC = _a.BTC, ETH = _a.ETH;
                        tokens = [SOL, BTC, ETH];
                        prices = {
                            solana: { usd: "0" },
                            bitcoin: { usd: "0" },
                            ethereum: { usd: "0" },
                        };
                        return [4 /*yield*/, fetch("".concat(PROVIDER_CONFIG.COINGECKO_API, "/simple/price?ids=").concat(tokens.join(","), "&vs_currencies=usd"), {
                                headers: {
                                    "Accept": "application/json",
                                    "X-CoinGecko-API-Key": eliza_1.settings.COINGECKO_API_KEY || "",
                                },
                            })];
                    case 1:
                        response = _e.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _e.sent();
                        if ((_b = data[SOL]) === null || _b === void 0 ? void 0 : _b.usd)
                            prices.solana.usd = data[SOL].usd.toString();
                        if ((_c = data[BTC]) === null || _c === void 0 ? void 0 : _c.usd)
                            prices.bitcoin.usd = data[BTC].usd.toString();
                        if ((_d = data[ETH]) === null || _d === void 0 ? void 0 : _d.usd)
                            prices.ethereum.usd = data[ETH].usd.toString();
                        this.setCachedData(cacheKey, prices);
                        return [2 /*return*/, prices];
                    case 3:
                        error_4 = _e.sent();
                        console.error("Error fetching prices:", error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.calculateBuyAmounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dexScreenerData, prices, solPrice, pair, liquidity, marketCap, impactPercentages, lowBuyAmountUSD, mediumBuyAmountUSD, highBuyAmountUSD, lowBuyAmountSOL, mediumBuyAmountSOL, highBuyAmountSOL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchDexScreenerData()];
                    case 1:
                        dexScreenerData = _a.sent();
                        return [4 /*yield*/, this.fetchPrices()];
                    case 2:
                        prices = _a.sent();
                        solPrice = (0, bignumber_ts_1.toBN)(prices.solana.usd);
                        if (!dexScreenerData || dexScreenerData.pairs.length === 0) {
                            return [2 /*return*/, { none: 0, low: 0, medium: 0, high: 0 }];
                        }
                        pair = dexScreenerData.pairs[0];
                        liquidity = pair.liquidity, marketCap = pair.marketCap;
                        if (!liquidity || !marketCap) {
                            return [2 /*return*/, { none: 0, low: 0, medium: 0, high: 0 }];
                        }
                        if (liquidity.usd === 0) {
                            return [2 /*return*/, { none: 0, low: 0, medium: 0, high: 0 }];
                        }
                        if (marketCap < 100000) {
                            return [2 /*return*/, { none: 0, low: 0, medium: 0, high: 0 }];
                        }
                        impactPercentages = {
                            LOW: 0.01, // 1% of liquidity
                            MEDIUM: 0.05, // 5% of liquidity
                            HIGH: 0.1, // 10% of liquidity
                        };
                        lowBuyAmountUSD = liquidity.usd * impactPercentages.LOW;
                        mediumBuyAmountUSD = liquidity.usd * impactPercentages.MEDIUM;
                        highBuyAmountUSD = liquidity.usd * impactPercentages.HIGH;
                        lowBuyAmountSOL = (0, bignumber_ts_1.toBN)(lowBuyAmountUSD).div(solPrice).toNumber();
                        mediumBuyAmountSOL = (0, bignumber_ts_1.toBN)(mediumBuyAmountUSD)
                            .div(solPrice)
                            .toNumber();
                        highBuyAmountSOL = (0, bignumber_ts_1.toBN)(highBuyAmountUSD)
                            .div(solPrice)
                            .toNumber();
                        return [2 /*return*/, {
                                none: 0,
                                low: lowBuyAmountSOL,
                                medium: mediumBuyAmountSOL,
                                high: highBuyAmountSOL,
                            }];
                }
            });
        });
    };
    TokenProvider.prototype.fetchTokenSecurity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, security;
            return __generator(this, function (_a) {
                cacheKey = "tokenSecurity_".concat(this.tokenAddress);
                cachedData = this.getCachedData(cacheKey);
                if (cachedData) {
                    console.log("Returning cached token security data for ".concat(this.tokenAddress, "."));
                    return [2 /*return*/, cachedData];
                }
                security = {
                    ownerBalance: "0",
                    creatorBalance: "0",
                    ownerPercentage: "0",
                    creatorPercentage: "0",
                    top10HolderBalance: "0",
                    top10HolderPercent: "0",
                };
                this.setCachedData(cacheKey, security);
                return [2 /*return*/, security];
            });
        });
    };
    TokenProvider.prototype.fetchTokenTradeData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, tradeData;
            return __generator(this, function (_a) {
                cacheKey = "tokenTradeData_".concat(this.tokenAddress);
                cachedData = this.getCachedData(cacheKey);
                if (cachedData) {
                    console.log("Returning cached token trade data for ".concat(this.tokenAddress, "."));
                    return [2 /*return*/, cachedData];
                }
                tradeData = {
                    address: this.tokenAddress,
                    holder: "0",
                    market: "0",
                    last_trade_unix_time: "0",
                    last_trade_human_time: "",
                    price: "0",
                    history_30m_price: "0",
                    price_change_30m_percent: "0",
                    // ... rest of the fields with "0" values
                };
                this.setCachedData(cacheKey, tradeData);
                return [2 /*return*/, tradeData];
            });
        });
    };
    TokenProvider.prototype.fetchDexScreenerData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, url, data, dexData, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "dexScreenerData_".concat(this.tokenAddress);
                        cachedData = this.getCachedData(cacheKey);
                        if (cachedData) {
                            console.log("Returning cached DexScreener data.");
                            return [2 /*return*/, cachedData];
                        }
                        url = "https://api.dexscreener.com/latest/dex/search?q=".concat(this.tokenAddress);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log("Fetching DexScreener data for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, fetch(url)
                                .then(function (res) { return res.json(); })
                                .catch(function (err) {
                                console.error(err);
                            })];
                    case 2:
                        data = _a.sent();
                        if (!data || !data.pairs) {
                            throw new Error("No DexScreener data available");
                        }
                        dexData = {
                            schemaVersion: data.schemaVersion,
                            pairs: data.pairs,
                        };
                        // Cache the result
                        this.setCachedData(cacheKey, dexData);
                        return [2 /*return*/, dexData];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error fetching DexScreener data:", error_5);
                        return [2 /*return*/, {
                                schemaVersion: "1.0.0",
                                pairs: [],
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.searchDexScreenerData = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, url, data, dexData, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "dexScreenerData_search_".concat(symbol);
                        return [4 /*yield*/, this.getCachedData(cacheKey)];
                    case 1:
                        cachedData = _a.sent();
                        if (cachedData) {
                            console.log("Returning cached search DexScreener data.");
                            return [2 /*return*/, this.getHighestLiquidityPair(cachedData)];
                        }
                        url = "https://api.dexscreener.com/latest/dex/search?q=".concat(symbol);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        console.log("Fetching DexScreener data for symbol: ".concat(symbol));
                        return [4 /*yield*/, fetch(url)
                                .then(function (res) { return res.json(); })
                                .catch(function (err) {
                                console.error(err);
                                return null;
                            })];
                    case 3:
                        data = _a.sent();
                        if (!data || !data.pairs || data.pairs.length === 0) {
                            throw new Error("No DexScreener data available");
                        }
                        dexData = {
                            schemaVersion: data.schemaVersion,
                            pairs: data.pairs,
                        };
                        // Cache the result
                        this.setCachedData(cacheKey, dexData);
                        // Return the pair with the highest liquidity and market cap
                        return [2 /*return*/, this.getHighestLiquidityPair(dexData)];
                    case 4:
                        error_6 = _a.sent();
                        console.error("Error fetching DexScreener data:", error_6);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.getHighestLiquidityPair = function (dexData) {
        if (dexData.pairs.length === 0) {
            return null;
        }
        // Sort pairs by both liquidity and market cap to get the highest one
        return dexData.pairs.sort(function (a, b) {
            var liquidityDiff = b.liquidity.usd - a.liquidity.usd;
            if (liquidityDiff !== 0) {
                return liquidityDiff; // Higher liquidity comes first
            }
            return b.marketCap - a.marketCap; // If liquidity is equal, higher market cap comes first
        })[0];
    };
    TokenProvider.prototype.analyzeHolderDistribution = function (tradeData) {
        return __awaiter(this, void 0, void 0, function () {
            var intervals, validChanges, averageChange, increaseThreshold, decreaseThreshold;
            return __generator(this, function (_a) {
                intervals = [
                    {
                        period: "30m",
                        change: tradeData.unique_wallet_30m_change_percent,
                    },
                    { period: "1h", change: tradeData.unique_wallet_1h_change_percent },
                    { period: "2h", change: tradeData.unique_wallet_2h_change_percent },
                    { period: "4h", change: tradeData.unique_wallet_4h_change_percent },
                    { period: "8h", change: tradeData.unique_wallet_8h_change_percent },
                    {
                        period: "24h",
                        change: tradeData.unique_wallet_24h_change_percent,
                    },
                ];
                validChanges = intervals
                    .map(function (interval) { return interval.change; })
                    .filter(function (change) { return change !== null && change !== undefined; });
                if (validChanges.length === 0) {
                    return [2 /*return*/, "stable"];
                }
                averageChange = validChanges.reduce(function (acc, curr) { return acc + curr; }, 0) /
                    validChanges.length;
                increaseThreshold = 10;
                decreaseThreshold = -10;
                if (averageChange > increaseThreshold) {
                    return [2 /*return*/, "increasing"];
                }
                else if (averageChange < decreaseThreshold) {
                    return [2 /*return*/, "decreasing"];
                }
                else {
                    return [2 /*return*/, "stable"];
                }
                return [2 /*return*/];
            });
        });
    };
    TokenProvider.prototype.fetchHolderList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, allHoldersMap, page, limit, cursor, url, params, response, data, holders, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "holderList_".concat(this.tokenAddress);
                        cachedData = this.getCachedData(cacheKey);
                        if (cachedData) {
                            console.log("Returning cached holder list.");
                            return [2 /*return*/, cachedData];
                        }
                        allHoldersMap = new Map();
                        page = 1;
                        limit = 1000;
                        url = "https://mainnet.helius-rpc.com/?api-key=".concat(eliza_1.settings.HELIUS_API_KEY || "");
                        console.log({ url: url });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 5];
                        params = {
                            limit: limit,
                            displayOptions: {},
                            mint: this.tokenAddress,
                            cursor: cursor,
                        };
                        if (cursor != undefined) {
                            params.cursor = cursor;
                        }
                        console.log("Fetching holders - Page ".concat(page));
                        if (page > 2) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, fetch(url, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    jsonrpc: "2.0",
                                    id: "helius-test",
                                    method: "getTokenAccounts",
                                    params: params,
                                }),
                            })];
                    case 3:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 4:
                        data = _a.sent();
                        if (!data ||
                            !data.result ||
                            !data.result.token_accounts ||
                            data.result.token_accounts.length === 0) {
                            console.log("No more holders found. Total pages fetched: ".concat(page - 1));
                            return [3 /*break*/, 5];
                        }
                        console.log("Processing ".concat(data.result.token_accounts.length, " holders from page ").concat(page));
                        data.result.token_accounts.forEach(function (account) {
                            var owner = account.owner;
                            var balance = parseFloat(account.amount);
                            if (allHoldersMap.has(owner)) {
                                allHoldersMap.set(owner, allHoldersMap.get(owner) + balance);
                            }
                            else {
                                allHoldersMap.set(owner, balance);
                            }
                        });
                        cursor = data.result.cursor;
                        page++;
                        return [3 /*break*/, 2];
                    case 5:
                        holders = Array.from(allHoldersMap.entries()).map(function (_a) {
                            var address = _a[0], balance = _a[1];
                            return ({
                                address: address,
                                balance: balance.toString(),
                            });
                        });
                        console.log("Total unique holders fetched: ".concat(holders.length));
                        // Cache the result
                        this.setCachedData(cacheKey, holders);
                        return [2 /*return*/, holders];
                    case 6:
                        error_7 = _a.sent();
                        console.error("Error fetching holder list from Helius:", error_7);
                        throw new Error("Failed to fetch holder list from Helius.");
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.filterHighValueHolders = function (tradeData) {
        return __awaiter(this, void 0, void 0, function () {
            var holdersData, tokenPriceUsd, highValueHolders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHolderList()];
                    case 1:
                        holdersData = _a.sent();
                        tokenPriceUsd = (0, bignumber_ts_1.toBN)(tradeData.price);
                        highValueHolders = holdersData
                            .filter(function (holder) {
                            var balanceUsd = (0, bignumber_ts_1.toBN)(holder.balance).multipliedBy(tokenPriceUsd);
                            return balanceUsd.isGreaterThan(5);
                        })
                            .map(function (holder) { return ({
                            holderAddress: holder.address,
                            balanceUsd: (0, bignumber_ts_1.toBN)(holder.balance)
                                .multipliedBy(tokenPriceUsd)
                                .toFixed(2),
                        }); });
                        return [2 /*return*/, highValueHolders];
                }
            });
        });
    };
    TokenProvider.prototype.checkRecentTrades = function (tradeData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, bignumber_ts_1.toBN)(tradeData.volume_24h_usd).isGreaterThan(0)];
            });
        });
    };
    TokenProvider.prototype.countHighSupplyHolders = function (securityData) {
        return __awaiter(this, void 0, void 0, function () {
            var ownerBalance, totalSupply_1, highSupplyHolders, highSupplyHoldersCount, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ownerBalance = (0, bignumber_ts_1.toBN)(securityData.ownerBalance);
                        totalSupply_1 = ownerBalance.plus(securityData.creatorBalance);
                        return [4 /*yield*/, this.fetchHolderList()];
                    case 1:
                        highSupplyHolders = _a.sent();
                        highSupplyHoldersCount = highSupplyHolders.filter(function (holder) {
                            var balance = (0, bignumber_ts_1.toBN)(holder.balance);
                            return balance.dividedBy(totalSupply_1).isGreaterThan(0.02);
                        }).length;
                        return [2 /*return*/, highSupplyHoldersCount];
                    case 2:
                        error_8 = _a.sent();
                        console.error("Error counting high supply holders:", error_8);
                        return [2 /*return*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.getProcessedTokenData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var security, tokenCodex, tradeData, dexData, holderDistributionTrend, highValueHolders, recentTrades, highSupplyHoldersCount, isDexScreenerListed, isDexScreenerPaid, processedData, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        console.log("Fetching security data for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, this.fetchTokenSecurity()];
                    case 1:
                        security = _a.sent();
                        return [4 /*yield*/, this.fetchTokenCodex()];
                    case 2:
                        tokenCodex = _a.sent();
                        console.log("Fetching trade data for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, this.fetchTokenTradeData()];
                    case 3:
                        tradeData = _a.sent();
                        console.log("Fetching DexScreener data for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, this.fetchDexScreenerData()];
                    case 4:
                        dexData = _a.sent();
                        console.log("Analyzing holder distribution for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, this.analyzeHolderDistribution(tradeData)];
                    case 5:
                        holderDistributionTrend = _a.sent();
                        console.log("Filtering high-value holders for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, this.filterHighValueHolders(tradeData)];
                    case 6:
                        highValueHolders = _a.sent();
                        console.log("Checking recent trades for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, this.checkRecentTrades(tradeData)];
                    case 7:
                        recentTrades = _a.sent();
                        console.log("Counting high-supply holders for token: ".concat(this.tokenAddress));
                        return [4 /*yield*/, this.countHighSupplyHolders(security)];
                    case 8:
                        highSupplyHoldersCount = _a.sent();
                        console.log("Determining DexScreener listing status for token: ".concat(this.tokenAddress));
                        isDexScreenerListed = dexData.pairs.length > 0;
                        isDexScreenerPaid = dexData.pairs.some(function (pair) { return pair.boosts && pair.boosts.active > 0; });
                        processedData = {
                            security: security,
                            tradeData: tradeData,
                            holderDistributionTrend: holderDistributionTrend,
                            highValueHolders: highValueHolders,
                            recentTrades: recentTrades,
                            highSupplyHoldersCount: highSupplyHoldersCount,
                            dexScreenerData: dexData,
                            isDexScreenerListed: isDexScreenerListed,
                            isDexScreenerPaid: isDexScreenerPaid,
                            tokenCodex: tokenCodex,
                        };
                        // console.log("Processed token data:", processedData);
                        return [2 /*return*/, processedData];
                    case 9:
                        error_9 = _a.sent();
                        console.error("Error processing token data:", error_9);
                        throw error_9;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.shouldTradeToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, tradeData, security, dexScreenerData, ownerBalance, creatorBalance, _a, liquidity, marketCap, liquidityUsd, marketCapUsd, totalSupply, _ownerPercentage, _creatorPercentage, top10HolderPercent, priceChange24hPercent, priceChange12hPercent, uniqueWallet24h, volume24hUsd, volume24hUsdThreshold, priceChange24hPercentThreshold, priceChange12hPercentThreshold, top10HolderPercentThreshold, uniqueWallet24hThreshold, isTop10Holder, isVolume24h, isPriceChange24h, isPriceChange12h, isUniqueWallet24h, isLiquidityTooLow, isMarketCapTooLow, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getProcessedTokenData()];
                    case 1:
                        tokenData = _b.sent();
                        tradeData = tokenData.tradeData, security = tokenData.security, dexScreenerData = tokenData.dexScreenerData;
                        ownerBalance = security.ownerBalance, creatorBalance = security.creatorBalance;
                        _a = dexScreenerData.pairs[0], liquidity = _a.liquidity, marketCap = _a.marketCap;
                        liquidityUsd = (0, bignumber_ts_1.toBN)(liquidity.usd);
                        marketCapUsd = (0, bignumber_ts_1.toBN)(marketCap);
                        totalSupply = (0, bignumber_ts_1.toBN)(ownerBalance).plus(creatorBalance);
                        _ownerPercentage = (0, bignumber_ts_1.toBN)(ownerBalance).dividedBy(totalSupply);
                        _creatorPercentage = (0, bignumber_ts_1.toBN)(creatorBalance).dividedBy(totalSupply);
                        top10HolderPercent = (0, bignumber_ts_1.toBN)(tradeData.volume_24h_usd).dividedBy(totalSupply);
                        priceChange24hPercent = (0, bignumber_ts_1.toBN)(tradeData.price_change_24h_percent);
                        priceChange12hPercent = (0, bignumber_ts_1.toBN)(tradeData.price_change_12h_percent);
                        uniqueWallet24h = tradeData.unique_wallet_24h;
                        volume24hUsd = (0, bignumber_ts_1.toBN)(tradeData.volume_24h_usd);
                        volume24hUsdThreshold = 1000;
                        priceChange24hPercentThreshold = 10;
                        priceChange12hPercentThreshold = 5;
                        top10HolderPercentThreshold = 0.05;
                        uniqueWallet24hThreshold = 100;
                        isTop10Holder = top10HolderPercent.gte(top10HolderPercentThreshold);
                        isVolume24h = volume24hUsd.gte(volume24hUsdThreshold);
                        isPriceChange24h = priceChange24hPercent.gte(priceChange24hPercentThreshold);
                        isPriceChange12h = priceChange12hPercent.gte(priceChange12hPercentThreshold);
                        isUniqueWallet24h = uniqueWallet24h >= uniqueWallet24hThreshold;
                        isLiquidityTooLow = liquidityUsd.lt(1000);
                        isMarketCapTooLow = marketCapUsd.lt(100000);
                        return [2 /*return*/, (isTop10Holder ||
                                isVolume24h ||
                                isPriceChange24h ||
                                isPriceChange12h ||
                                isUniqueWallet24h ||
                                isLiquidityTooLow ||
                                isMarketCapTooLow)];
                    case 2:
                        error_10 = _b.sent();
                        console.error("Error processing token data:", error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokenProvider.prototype.formatTokenData = function (data) {
        var output = "**Token Security and Trade Report**\n";
        output += "Token Address: ".concat(this.tokenAddress, "\n\n");
        // Security Data
        output += "**Ownership Distribution:**\n";
        output += "- Owner Balance: ".concat(data.security.ownerBalance, "\n");
        output += "- Creator Balance: ".concat(data.security.creatorBalance, "\n");
        output += "- Owner Percentage: ".concat(data.security.ownerPercentage, "%\n");
        output += "- Creator Percentage: ".concat(data.security.creatorPercentage, "%\n");
        output += "- Top 10 Holders Balance: ".concat(data.security.top10HolderBalance, "\n");
        output += "- Top 10 Holders Percentage: ".concat(data.security.top10HolderPercent, "%\n\n");
        // Trade Data
        output += "**Trade Data:**\n";
        output += "- Holders: ".concat(data.tradeData.holder, "\n");
        output += "- Unique Wallets (24h): ".concat(data.tradeData.unique_wallet_24h, "\n");
        output += "- Price Change (24h): ".concat(data.tradeData.price_change_24h_percent, "%\n");
        output += "- Price Change (12h): ".concat(data.tradeData.price_change_12h_percent, "%\n");
        output += "- Volume (24h USD): $".concat((0, bignumber_ts_1.toBN)(data.tradeData.volume_24h_usd).toFixed(2), "\n");
        output += "- Current Price: $".concat((0, bignumber_ts_1.toBN)(data.tradeData.price).toFixed(2), "\n\n");
        // Holder Distribution Trend
        output += "**Holder Distribution Trend:** ".concat(data.holderDistributionTrend, "\n\n");
        // High-Value Holders
        output += "**High-Value Holders (>$5 USD):**\n";
        if (data.highValueHolders.length === 0) {
            output += "- No high-value holders found or data not available.\n";
        }
        else {
            data.highValueHolders.forEach(function (holder) {
                output += "- ".concat(holder.holderAddress, ": $").concat(holder.balanceUsd, "\n");
            });
        }
        output += "\n";
        // Recent Trades
        output += "**Recent Trades (Last 24h):** ".concat(data.recentTrades ? "Yes" : "No", "\n\n");
        // High-Supply Holders
        output += "**Holders with >2% Supply:** ".concat(data.highSupplyHoldersCount, "\n\n");
        // DexScreener Status
        output += "**DexScreener Listing:** ".concat(data.isDexScreenerListed ? "Yes" : "No", "\n");
        if (data.isDexScreenerListed) {
            output += "- Listing Type: ".concat(data.isDexScreenerPaid ? "Paid" : "Free", "\n");
            output += "- Number of DexPairs: ".concat(data.dexScreenerData.pairs.length, "\n\n");
            output += "**DexScreener Pairs:**\n";
            data.dexScreenerData.pairs.forEach(function (pair, index) {
                output += "\n**Pair ".concat(index + 1, ":**\n");
                output += "- DEX: ".concat(pair.dexId, "\n");
                output += "- URL: ".concat(pair.url, "\n");
                output += "- Price USD: $".concat((0, bignumber_ts_1.toBN)(pair.priceUsd).toFixed(6), "\n");
                output += "- Volume (24h USD): $".concat((0, bignumber_ts_1.toBN)(pair.volume.h24).toFixed(2), "\n");
                output += "- Boosts Active: ".concat(pair.boosts && pair.boosts.active, "\n");
                output += "- Liquidity USD: $".concat((0, bignumber_ts_1.toBN)(pair.liquidity.usd).toFixed(2), "\n");
            });
        }
        output += "\n";
        console.log("Formatted token data:", output);
        return output;
    };
    TokenProvider.prototype.getFormattedTokenReport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var processedData, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Generating formatted token report...");
                        return [4 /*yield*/, this.getProcessedTokenData()];
                    case 1:
                        processedData = _a.sent();
                        return [2 /*return*/, this.formatTokenData(processedData)];
                    case 2:
                        error_11 = _a.sent();
                        console.error("Error generating token report:", error_11);
                        return [2 /*return*/, "Unable to fetch token information. Please try again later."];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TokenProvider;
}());
exports.TokenProvider = TokenProvider;
var tokenAddress = PROVIDER_CONFIG.TOKEN_ADDRESSES.SOL;
var connection = new web3_js_1.Connection(PROVIDER_CONFIG.DEFAULT_RPC);
var tokenProvider = {
    get: function (runtime, _message, _state) { return __awaiter(void 0, void 0, void 0, function () {
        var publicKey, walletProvider, provider, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, keypairUtils_ts_1.getWalletKey)(runtime, false)];
                case 1:
                    publicKey = (_a.sent()).publicKey;
                    walletProvider = new wallet_ts_1.WalletProvider(connection, publicKey);
                    provider = new TokenProvider(tokenAddress, walletProvider, runtime.cacheManager);
                    return [2 /*return*/, provider.getFormattedTokenReport()];
                case 2:
                    error_12 = _a.sent();
                    console.error("Error fetching token data:", error_12);
                    return [2 /*return*/, "Unable to fetch token information. Please try again later."];
                case 3: return [2 /*return*/];
            }
        });
    }); },
};
exports.tokenProvider = tokenProvider;
