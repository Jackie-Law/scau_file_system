import getWeb3 from "../utils/getWeb3";
import BackupContract from "../contracts/Backup.json";

//默认3分钟一次请求
function startBackup() {
    try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetworkOfBackup = BackupContract.networks[networkId];
        const backupContractInstance = new web3.eth.Contract(
            BackupContract.abi,
            deployedNetworkOfBackup && deployedNetworkOfBackup.address,
        );
    } catch (error) {
        console.error(err)
    }
}