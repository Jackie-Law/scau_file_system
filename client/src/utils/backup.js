import Web3 from "web3";
import BackupContract from "../contracts/BackupContract.json";

//默认3分钟一次请求
function startBackup() {
    try {
        const provider = new Web3.providers.HttpProvider(
            "http://127.0.0.1:9545"
        );
        const web3 = new Web3(provider);
        console.log('load web3 success')
        web3.eth.getAccounts().then((accounts) => {
            web3.eth.net.getId().then((networkId) => {
                let deployedNetworkOfBackup = BackupContract.networks[networkId];
                let backupContractInstance = new web3.eth.Contract(
                    BackupContract.abi,
                    deployedNetworkOfBackup && deployedNetworkOfBackup.address,
                );
                setInterval(()=>{
                    backupContractInstance.methods.requestBackup().send({ from: accounts[0], gas: 1000000 }).then((result) => {
                        let resultCode = result.events.requestEvent.returnValues[0];
                        let resultMsg = result.events.requestEvent.returnValues[1];
                        console.log(resultCode+"--"+resultMsg)
                    })
                },180000);
            })
        })

    } catch (error) {
        console.error(error)
        //restart
    }
}

startBackup();