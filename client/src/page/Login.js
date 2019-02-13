import React from "react";
import getWeb3 from "../utils/getWeb3";
import FileSystemContract from "../contracts/FileSystem.json";
import {
    Form, Icon, Input, Button,
} from 'antd';
import '../../node_modules/antd/dist/antd.css';
import '../style/Login.css';

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
        const response = contract.methods.login(values.userName).call();
        console.log(response)
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
                        <div className="login-name">区块链文件系统</div>
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