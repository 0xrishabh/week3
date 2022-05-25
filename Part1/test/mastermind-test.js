//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require("chai");
const buildPoseidon = require("circomlibjs").buildPoseidon;

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Mastermind", async function(){
    it("should pass for valid inputs", async function(){
        const poseidon = await buildPoseidon();
        const F = poseidon.F;
        const circuit = await wasm_tester("contracts/circuits/MasterMindVariation.circom");
        await circuit.loadConstraints();
        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const pubSolnHash = poseidon([salt, 1,2,3,4,5]);
        const INPUT = {
            "pubGuessA": 1,
            "pubGuessB": 2,
            "pubGuessC": 3,
            "pubGuessD": 4,
            "pubGuessE": 5,
            "pubNumHit": 5,
            "pubNumBlow": 0,
            "pubSolnHash": F.toObject(pubSolnHash),
            "privSolnA": 1,
            "privSolnB": 2,
            "privSolnC": 3,
            "privSolnD": 4,
            "privSolnE": 5,
            "privSalt": salt,
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(F.toObject(pubSolnHash))));
    })
})