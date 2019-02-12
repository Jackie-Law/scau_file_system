import React from "react";
import getWeb3 from "../utils/getWeb3";
import FileSystemContract from "../contracts/FileSystem.json";

export default class Register extends React.Component {
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

    handleRegister = () =>{
        const {accounts, contract} = this.state;
        const file_data = "{}";
        let account = this.refs.account.value;
        let password = this.refs.password.value;
        console.log(account+"---"+password)
        const response = contract.methods.register(account,password,file_data).send({ from: accounts[0] }).then(function(result){
            console.log(result)
        });
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
                    <input type="text" ref="password"></input>
                </span>
                <input type="button" onClick={this.handleRegister} value="注册"></input>
            </div>
        )
    }
}