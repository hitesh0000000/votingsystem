const contractAddress = "0x2ab42855f9cb23cdc7d7b9ba2903736e110ed2ad";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateIndex",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "candidateName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCandidate",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCandidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getVoteHistory",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVoteHistoryCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "voteHistory",
		"outputs": [
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "candidateName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
let votingContract;

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        votingContract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Connected to contract at:", contractAddress);
    } else {
        alert("Please install MetaMask!");
    }
}

async function vote(candidateIndex) {
    try {
        const accounts = await web3.eth.getAccounts();
        await votingContract.methods.vote(candidateIndex).send({ from: accounts[0] });
        alert("Your vote has been successfully cast!");
        updateVotes();
    } catch (error) {
        console.error(error);
        if (error.message.includes("You have already voted")) {
            alert("You have already voted. Duplicate voting is not allowed.");
        } else if (error.message.includes("Invalid candidate")) {
            alert("Invalid candidate selection. Please try again.");
        } else {
            alert("An error occurred. Please try again later.");
        }
    }
}

async function updateVotes() {
    const candidateCount = await votingContract.methods.getCandidatesCount().call();
    for (let i = 0; i < candidateCount; i++) {
        const candidate = await votingContract.methods.getCandidate(i).call();
        document.getElementById(`votes-candidate-${i + 1}`).textContent = `Votes: ${candidate[1]}`;
    }
}

// Load web3 and initialize contract
window.onload = loadWeb3;
