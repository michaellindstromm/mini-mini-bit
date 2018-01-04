const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis block", "0");
    } 

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            } 

        }

        return true;
    }
}

let miniBit = new Blockchain();

// *******************************************************************************
// Below show the basic implementation of proof of work.
// *******************************************************************************
console.log('Mining block 1...');
miniBit.addBlock(new Block(1, "01/04/2018", {amount: 4}));

console.log('Mining block 2...');
miniBit.addBlock(new Block(1, "01/06/2018", {amount: 12}));

console.log('Mining block 3...');
miniBit.addBlock(new Block(1, "01/08/2018", {amount: 120}));

// ********************************************************************************
// Below shows basic implementation of blockchain.

// Also shows how changing data and recalculating hash still invalidates the chain.

// The proof of work makes recalculating and changing all subsequent hashes nearly,
// impossible with a simple increase to the difficulty.
// ********************************************************************************

console.log(JSON.stringify(miniBit.chain, null, 4));

console.log('Is blockchain valid?', miniBit.isChainValid());

miniBit.chain[1].data = {amount: 100};
miniBit.chain[1].hash = miniBit.chain[1].calculateHash();

console.log('Is blockchain valid?', miniBit.isChainValid());

console.log(JSON.stringify(miniBit.chain, null, 4));

// *******************************************************************************