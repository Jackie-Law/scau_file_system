import React from "react";
import getWeb3 from "../utils/getWeb3";
import FileSystemContract from "../contracts/FileSystem.json";

export default class Login extends React.Component {
    state = {
        web3:null,
        contract: null
    };

    componentDidMount = async() => {
        try{
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = FileSystemContract.networks[networkId];
            const instance = new web3.eth.Contract(
                FileSystemContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({
                web3,accounts,contract:instance
            })
        }catch(error){
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error)
        }
    }

    handleLogin = () =>{
        const {contract} = this.state;
        let account = this.refs.account.value;
        const response = contract.methods.login(account).call();
        console.log(response)
    }

    render() {
        return (
            <div>
                <span>
                    <label>账号</label>
                    <input type="text" ref="account"></input>
                </span>
                <span>
                    <label>密码</label>
                    <input type="text"></input>
                </span>
                <input type="button" onClick={this.handleLogin} value="登录"></input>
            </div>
        )
    }
}