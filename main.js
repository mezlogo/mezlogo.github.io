async function loadWeb3() {
    if (!window.ethereum) {
        throw new Error('Your browser does not support ethereum');
    }
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    return web3;
}

async function load() {
    updateStatus('Loading web3');
    const web3 = await loadWeb3();
    window.web3 = web3;
    updateStatus('Loading contract');
    const contract = await loadContract(web3);
    updateStatus('Calling contract');
    const result = await callContract(contract);
    updateStatus(`Result: '${result}'`);
    updateStatus('Requesting account info');
    const accountInfo = await getAccountInfo(web3);
    updateStatus(`Account: ${JSON.stringify(accountInfo)}`)
}

const contentEl = document.getElementById('content');
const logs = [];

function updateStatus(status) {
    logs.push(status);
    contentEl.innerHTML = logs.join('<br/>');
}

async function callContract(contract) {
    return await contract.methods.greet().call();
}

async function loadContract(web3) {
    return await new web3.eth.Contract(ABI, contractAddress);
}

async function getAccountInfo(web3) {
    const accounts = await web3.eth.getAccounts();
    const balances = await Promise.all(accounts.map(it => web3.eth.getBalance(it)))
    const results = [];
    for (let index = 0; index < accounts.length; index++) {
        results.push({ account: accounts[index], balance: balances[index] });
    }
    return results;
}

const ABI = [
    {
        inputs: [],
        name: 'text',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'greet',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];

const contractAddress = '0x102d654713BEdc573d8d8c800311C1c4a4a6fd07';

load();
