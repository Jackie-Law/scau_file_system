import React from "react";
import getWeb3 from "../utils/getWeb3";
import FileSystemContract from "../contracts/FileSystem.json";
import {
    Form, Icon, Input, Button, message
} from 'antd';
import '../../node_modules/antd/dist/antd.css';
import '../style/Register.css';
import { aesEncrypt, sha256Encrypt } from '../utils/cipherUtil.js';
import { saveTextBlobOnIpfs } from '../utils/ipfsIOUtil'

class Register extends React.Component {
    state = {
        web3: null,
        contract: null,
        confirmDirty: false
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

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.handleRegister(values);
            }
        });
    }

    handleRegister = (values) => {
        const { accounts, contract } = this.state;
        const file_data = "{}";
        let account = values.userName;
        let password = values.password;
        let encryptedPwd = sha256Encrypt(password, account);
        let encryptedData = aesEncrypt(file_data, password);
        // console.log('加密的文件树字符串'+encryptedData)
        saveTextBlobOnIpfs(encryptedData).then((hash) => {
            let dataHash = hash;
            console.log(account + "--" + encryptedPwd + '--' + dataHash)
            contract.methods.register(account, encryptedPwd, dataHash).send({ from: accounts[0], gas: 1000000 }).then((result) => {
                console.log(result)
                let resultCode = result.events.RegisterEvent.returnValues[0];
                let resultMsg = result.events.RegisterEvent.returnValues[1];
                // console.log(resultCode+'----'+resultMsg)
                if (resultCode == 200) {
                    console.log('注册成功')
                    //跳转到登录界面
                    alert('注册成功')
                    window.location.href='/'
                } else {
                    // console.log(resultMsg)
                    message.info(resultMsg);
                }
            })
        })
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="register">
                <div className="register-form">
                    <div className="register-logo">
                        <div className="register-name">区块链文件系统-账号注册</div>
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
                                rules: [{ required: true, message: '请输入密码!' }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('confirm', {
                                rules: [{ required: true, message: '请再次输入密码!' }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onBlur={this.handleConfirmBlur} type="password" placeholder="Repeat Password" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                注册
                            </Button>
                            Or <a href="/">已有账号，去登陆!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

let registerForm = Form.create()(Register);
export default registerForm;