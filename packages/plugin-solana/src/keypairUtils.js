"use strict";
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
exports.getWalletKey = getWalletKey;
var web3_js_1 = require("@solana/web3.js");
var plugin_tee_1 = require("@ai16z/plugin-tee");
var bs58_1 = require("bs58");
/**
 * Gets either a keypair or public key based on TEE mode and runtime settings
 * @param runtime The agent runtime
 * @param requirePrivateKey Whether to return a full keypair (true) or just public key (false)
 * @returns KeypairResult containing either keypair or public key
 */
function getWalletKey(runtime_1) {
    return __awaiter(this, arguments, void 0, function (runtime, requirePrivateKey) {
        var teeMode, walletSecretSalt, deriveKeyProvider, deriveKeyResult, privateKeyString, secretKey, secretKey, publicKeyString;
        var _a, _b;
        if (requirePrivateKey === void 0) { requirePrivateKey = true; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    teeMode = runtime.getSetting("TEE_MODE") || plugin_tee_1.TEEMode.OFF;
                    if (!(teeMode !== plugin_tee_1.TEEMode.OFF)) return [3 /*break*/, 2];
                    walletSecretSalt = runtime.getSetting("WALLET_SECRET_SALT");
                    if (!walletSecretSalt) {
                        throw new Error("WALLET_SECRET_SALT required when TEE_MODE is enabled");
                    }
                    deriveKeyProvider = new plugin_tee_1.DeriveKeyProvider(teeMode);
                    return [4 /*yield*/, deriveKeyProvider.deriveEd25519Keypair("/", walletSecretSalt, runtime.agentId)];
                case 1:
                    deriveKeyResult = _c.sent();
                    return [2 /*return*/, requirePrivateKey
                            ? { keypair: deriveKeyResult.keypair }
                            : { publicKey: deriveKeyResult.keypair.publicKey }];
                case 2:
                    // TEE mode is OFF
                    if (requirePrivateKey) {
                        privateKeyString = (_a = runtime.getSetting("SOLANA_PRIVATE_KEY")) !== null && _a !== void 0 ? _a : runtime.getSetting("WALLET_PRIVATE_KEY");
                        if (!privateKeyString) {
                            throw new Error("Private key not found in settings");
                        }
                        try {
                            secretKey = bs58_1.default.decode(privateKeyString);
                            return [2 /*return*/, { keypair: web3_js_1.Keypair.fromSecretKey(secretKey) }];
                        }
                        catch (e) {
                            console.log("Error decoding base58 private key:", e);
                            try {
                                // Then try base64
                                console.log("Try decoding base64 instead");
                                secretKey = Uint8Array.from(Buffer.from(privateKeyString, "base64"));
                                return [2 /*return*/, { keypair: web3_js_1.Keypair.fromSecretKey(secretKey) }];
                            }
                            catch (e2) {
                                console.error("Error decoding private key: ", e2);
                                throw new Error("Invalid private key format");
                            }
                        }
                    }
                    else {
                        publicKeyString = (_b = runtime.getSetting("SOLANA_PUBLIC_KEY")) !== null && _b !== void 0 ? _b : runtime.getSetting("WALLET_PUBLIC_KEY");
                        if (!publicKeyString) {
                            throw new Error("Public key not found in settings");
                        }
                        return [2 /*return*/, { publicKey: new web3_js_1.PublicKey(publicKeyString) }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
