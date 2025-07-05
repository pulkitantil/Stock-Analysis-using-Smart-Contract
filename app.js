let contract;
const contractAddress = "0x4594a9A0fB3a7632433f1A47b34C344c19cac94C";
const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "authorizeUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_stock",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_analysis",
				"type": "string"
			}
		],
		"name": "submitAnalysis",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "submitter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "stock",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "analysis",
				"type": "string"
			}
		],
		"name": "ReportSubmitted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
		"name": "authorized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllReports",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "stock",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "analysis",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "submitter",
						"type": "address"
					}
				],
				"internalType": "struct StockAnalysis.Report[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
async function connect() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    contract = new web3.eth.Contract(abi, contractAddress);
  } else {
    alert("Please install MetaMask");
  }
}

async function submitAnalysis() {
  await connect();
  const stock = document.getElementById("stockName").value;
  const analysis = document.getElementById("analysis").value;
  const accounts = await web3.eth.getAccounts();
  const user = accounts[0];

  // Check if the user is authorized
  const isAuthorized = await contract.methods.authorized(user).call();
  if (!isAuthorized) {
    alert("❌ You are not authorized to submit analysis. Contact the admin.");
    return;
  }

  try {
    await contract.methods.submitAnalysis(stock, analysis).send({ from: user });
    alert("✅ Analysis submitted successfully!");
    document.getElementById("stockName").value = "";
    document.getElementById("analysis").value = "";
  } catch (err) {
    alert("⚠️ Submission failed: " + err.message);
  }
}

async function loadReports() {
  await connect();
  const reports = await contract.methods.getAllReports().call();
  const container = document.getElementById("reports");
  if (reports.length === 0) {
    container.innerHTML = "<p>No reports found.</p>";
    return;
  }
  container.innerHTML = reports.map(r => `
    <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
      <strong>${r.stock}</strong>
      <p>${r.analysis}</p>
      <small>By: ${r.submitter}</small>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("reports")) {
    loadReports();
  }
});
