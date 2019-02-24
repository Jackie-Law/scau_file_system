import React from "react";
import getWeb3 from "../utils/getWeb3";
import FileSystemContract from "../contracts/FileSystem.json";
import {
    Form, Icon, Input, Button, message
} from 'antd';
import '../../node_modules/antd/dist/antd.css';
import '../style/Login.css';
import {getTextFromIpfs} from "../utils/ipfsIOUtil";
import { aesDecrypt } from '../utils/cipherUtil.js';

class Login extends React.Component {
    state = {
        web3: null,
        contract: null
    };

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = FileSystemContract.networks[networkId];
            const instance = new web3.eth.Contract(
                FileSystemContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({
                web3, accounts, contract: instance
            })
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error)
        }
    }

    handleLogin = (values) => {
        const { contract } = this.state;
        contract.methods.login(values.userName).call().then((result)=>{
            let resultCode = result[0];
            let resultData = result[1];
            if(resultCode==200){
                //请求成功
                try{
                    if(resultData.length<=0){
                        throw new Error('账号或密码错误');
                    }else{
                        //使用密码解密
                        getTextFromIpfs(resultData).then((response)=>{
                            let decode = aesDecrypt(response,values.password);
                            //解密成功
                            window.sessionStorage.setItem('file_tree_json',decode);
                            window.sessionStorage.setItem('account',values.userName);
                            window.sessionStorage.setItem('password',values.password);
                            //跳转到用户树页面
                            window.location.href = '/home';
                            console.log(decode)
                        }).catch((err)=>{
                            console.log('解密失败');
                            message.info('账号或密码错误');
                        })
                    }
                }catch(e){
                    message.info('账号或密码错误');
                    console.log(e);
                }
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                this.handleLogin(values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <div className="login-name">区块链文件系统-账号登录</div>
                    </div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入账号！' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                            Or <a href="/register">去注册!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

let LoginForm = Form.create()(Login);
export default LoginForm;