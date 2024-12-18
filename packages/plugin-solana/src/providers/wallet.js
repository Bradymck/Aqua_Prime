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
exports.walletProvider = exports.WalletProvider = void 0;
var web3_js_1 = require("@solana/web3.js");
var bignumber_js_1 = require("bignumber.js");
var node_cache_1 = require("node-cache");
var keypairUtils_1 = require("../keypairUtils");
// Provider configuration
var PROVIDER_CONFIG = {
    BIRDEYE_API: "https://public-api.birdeye.so",
    COINGECKO_API: "https://api.coingecko.com/api/v3",
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    DEFAULT_RPC: "https://api.mainnet-beta.solana.com",
    GRAPHQL_ENDPOINT: "https://graph.codex.io/graphql",
    TOKEN_ADDRESSES: {
        SOL: "solana",
        BTC: "bitcoin",
        ETH: "ethereum",
    },
};
var WalletProvider = /** @class */ (function () {
    function WalletProvider(connection, walletPublicKey) {
        this.connection = connection;
        this.walletPublicKey = walletPublicKey;
        this.cache = new node_cache_1.default({ stdTTL: 300 }); // Cache TTL set to 5 minutes
    }
    WalletProvider.prototype.fetchWithRetry = function (runtime_1, url_1) {
        return __awaiter(this, arguments, void 0, function (runtime, url, options) {
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
                                        return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { headers: __assign({ Accept: "application/json", "x-chain": "solana", "X-API-KEY": runtime.getSetting("BIRDEYE_API_KEY", "") || "" }, options.headers) }))];
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
    WalletProvider.prototype.fetchPortfolioValue = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedValue, walletData, data, totalUsd, prices, solPriceInUSD_1, items, totalSol, portfolio, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        cacheKey = "portfolio-".concat(this.walletPublicKey.toBase58());
                        cachedValue = this.cache.get(cacheKey);
                        if (cachedValue) {
                            console.log("Cache hit for fetchPortfolioValue");
                            return [2 /*return*/, cachedValue];
                        }
                        console.log("Cache miss for fetchPortfolioValue");
                        return [4 /*yield*/, this.fetchWithRetry(runtime, "".concat(PROVIDER_CONFIG.BIRDEYE_API, "/v1/wallet/token_list?wallet=").concat(this.walletPublicKey.toBase58()))];
                    case 1:
                        walletData = _a.sent();
                        if (!(walletData === null || walletData === void 0 ? void 0 : walletData.success) || !(walletData === null || walletData === void 0 ? void 0 : walletData.data)) {
                            console.error("No portfolio data available", walletData);
                            throw new Error("No portfolio data available");
                        }
                        data = walletData.data;
                        totalUsd = new bignumber_js_1.default(data.totalUsd.toString());
                        return [4 /*yield*/, this.fetchPrices(runtime)];
                    case 2:
                        prices = _a.sent();
                        solPriceInUSD_1 = new bignumber_js_1.default(prices.solana.usd.toString());
                        items = data.items.map(function (item) { return (__assign(__assign({}, item), { valueSol: new bignumber_js_1.default(item.valueUsd || 0)
                                .div(solPriceInUSD_1)
                                .toFixed(6), name: item.name || "Unknown", symbol: item.symbol || "Unknown", priceUsd: item.priceUsd || "0", valueUsd: item.valueUsd || "0" })); });
                        totalSol = totalUsd.div(solPriceInUSD_1);
                        portfolio = {
                            totalUsd: totalUsd.toString(),
                            totalSol: totalSol.toFixed(6),
                            items: items.sort(function (a, b) {
                                return new bignumber_js_1.default(b.valueUsd)
                                    .minus(new bignumber_js_1.default(a.valueUsd))
                                    .toNumber();
                            }),
                        };
                        this.cache.set(cacheKey, portfolio);
                        return [2 /*return*/, portfolio];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Error fetching portfolio:", error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WalletProvider.prototype.fetchPortfolioValueCodex = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedValue, query, variables, response, data, prices, solPriceInUSD, items, totalUsd, totalSol, portfolio, error_3;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        cacheKey = "portfolio-".concat(this.walletPublicKey.toBase58());
                        return [4 /*yield*/, this.cache.get(cacheKey)];
                    case 1:
                        cachedValue = _d.sent();
                        if (cachedValue) {
                            console.log("Cache hit for fetchPortfolioValue");
                            return [2 /*return*/, cachedValue];
                        }
                        console.log("Cache miss for fetchPortfolioValue");
                        query = "\n              query Balances($walletId: String!, $cursor: String) {\n                balances(input: { walletId: $walletId, cursor: $cursor }) {\n                  cursor\n                  items {\n                    walletId\n                    tokenId\n                    balance\n                    shiftedBalance\n                  }\n                }\n              }\n            ";
                        variables = {
                            walletId: "".concat(this.walletPublicKey.toBase58(), ":").concat(1399811149),
                            cursor: null,
                        };
                        return [4 /*yield*/, fetch(PROVIDER_CONFIG.GRAPHQL_ENDPOINT, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: runtime.getSetting("CODEX_API_KEY", "") || "",
                                },
                                body: JSON.stringify({
                                    query: query,
                                    variables: variables,
                                }),
                            }).then(function (res) { return res.json(); })];
                    case 2:
                        response = _d.sent();
                        data = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.balances) === null || _c === void 0 ? void 0 : _c.items;
                        if (!data || data.length === 0) {
                            console.error("No portfolio data available", data);
                            throw new Error("No portfolio data available");
                        }
                        return [4 /*yield*/, this.fetchPrices(runtime)];
                    case 3:
                        prices = _d.sent();
                        solPriceInUSD = new bignumber_js_1.default(prices.solana.usd.toString());
                        items = data.map(function (item) {
                            return {
                                name: "Unknown",
                                address: item.tokenId.split(":")[0],
                                symbol: item.tokenId.split(":")[0],
                                decimals: 6,
                                balance: item.balance,
                                uiAmount: item.shiftedBalance.toString(),
                                priceUsd: "",
                                valueUsd: "",
                                valueSol: "",
                            };
                        });
                        totalUsd = items.reduce(function (sum, item) { return sum.plus(new bignumber_js_1.default(item.valueUsd)); }, new bignumber_js_1.default(0));
                        totalSol = totalUsd.div(solPriceInUSD);
                        portfolio = {
                            totalUsd: totalUsd.toFixed(6),
                            totalSol: totalSol.toFixed(6),
                            items: items.sort(function (a, b) {
                                return new bignumber_js_1.default(b.valueUsd)
                                    .minus(new bignumber_js_1.default(a.valueUsd))
                                    .toNumber();
                            }),
                        };
                        // Cache the portfolio for future requests
                        return [4 /*yield*/, this.cache.set(cacheKey, portfolio, 60 * 1000)];
                    case 4:
                        // Cache the portfolio for future requests
                        _d.sent(); // Cache for 1 minute
                        return [2 /*return*/, portfolio];
                    case 5:
                        error_3 = _d.sent();
                        console.error("Error fetching portfolio:", error_3);
                        throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WalletProvider.prototype.fetchPrices = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedValue, _a, SOL, BTC, ETH, tokens, prices, response, data, error_4;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        cacheKey = "prices";
                        cachedValue = this.cache.get(cacheKey);
                        if (cachedValue) {
                            console.log("Cache hit for fetchPrices");
                            return [2 /*return*/, cachedValue];
                        }
                        console.log("Cache miss for fetchPrices");
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
                                    "X-CoinGecko-API-Key": runtime.getSetting("COINGECKO_API_KEY", "") || "",
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
                        this.cache.set(cacheKey, prices);
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
    WalletProvider.prototype.formatPortfolio = function (runtime, portfolio, prices) {
        var output = "".concat(runtime.character.description, "\n");
        output += "Wallet Address: ".concat(this.walletPublicKey.toBase58(), "\n\n");
        var totalUsdFormatted = new bignumber_js_1.default(portfolio.totalUsd).toFixed(2);
        var totalSolFormatted = portfolio.totalSol;
        output += "Total Value: $".concat(totalUsdFormatted, " (").concat(totalSolFormatted, " SOL)\n\n");
        output += "Token Balances:\n";
        var nonZeroItems = portfolio.items.filter(function (item) {
            return new bignumber_js_1.default(item.uiAmount).isGreaterThan(0);
        });
        if (nonZeroItems.length === 0) {
            output += "No tokens found with non-zero balance\n";
        }
        else {
            for (var _i = 0, nonZeroItems_1 = nonZeroItems; _i < nonZeroItems_1.length; _i++) {
                var item = nonZeroItems_1[_i];
                var valueUsd = new bignumber_js_1.default(item.valueUsd).toFixed(2);
                output += "".concat(item.name, " (").concat(item.symbol, "): ").concat(new bignumber_js_1.default(item.uiAmount).toFixed(6), " ($").concat(valueUsd, " | ").concat(item.valueSol, " SOL)\n");
            }
        }
        output += "\nMarket Prices:\n";
        output += "SOL: $".concat(new bignumber_js_1.default(prices.solana.usd).toFixed(2), "\n");
        output += "BTC: $".concat(new bignumber_js_1.default(prices.bitcoin.usd).toFixed(2), "\n");
        output += "ETH: $".concat(new bignumber_js_1.default(prices.ethereum.usd).toFixed(2), "\n");
        return output;
    };
    WalletProvider.prototype.getFormattedPortfolio = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, portfolio, prices, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.fetchPortfolioValue(runtime),
                                this.fetchPrices(runtime),
                            ])];
                    case 1:
                        _a = _b.sent(), portfolio = _a[0], prices = _a[1];
                        return [2 /*return*/, this.formatPortfolio(runtime, portfolio, prices)];
                    case 2:
                        error_5 = _b.sent();
                        console.error("Error generating portfolio report:", error_5);
                        return [2 /*return*/, "Unable to fetch wallet information. Please try again later."];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return WalletProvider;
}());
exports.WalletProvider = WalletProvider;
var walletProvider = {
    get: function (runtime, _message, _state) { return __awaiter(void 0, void 0, void 0, function () {
        var publicKey, connection, provider, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, keypairUtils_1.getWalletKey)(runtime, false)];
                case 1:
                    publicKey = (_a.sent()).publicKey;
                    connection = new web3_js_1.Connection(runtime.getSetting("RPC_URL") || PROVIDER_CONFIG.DEFAULT_RPC);
                    provider = new WalletProvider(connection, publicKey);
                    return [4 /*yield*/, provider.getFormattedPortfolio(runtime)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_6 = _a.sent();
                    console.error("Error in wallet provider:", error_6);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); },
};
exports.walletProvider = walletProvider;
