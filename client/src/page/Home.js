import React from "react";
import getWeb3 from "../utils/getWeb3";
import FileSystemContract from "../contracts/FileSystem.json";
import { saveFileOnIpfs, getFileFromIpfs } from '../utils/ipfsIOUtil';
import { sha256Encrypt } from '../utils/cipherUtil.js';
import { getNowFormatDate} from '../utils/commonUtil';
import {
    Layout, Menu, Breadcrumb, Icon, Upload, Button, Table, Divider
} from 'antd';

const { Header, Content, Sider } = Layout;

export default class Home extends React.Component {

    state = {
        web3: null,
        contract: null,
        account: window.sessionStorage.getItem('account'),
        password: window.sessionStorage.getItem('password'),
        file_tree_data: window.sessionStorage.getItem("file_tree_json")
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

    getProps = () => {
        const props = {
            name: 'file',
            showUploadList: false,
            action: (file) => {
                return new Promise((solve, reject) => {
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onloadend = (e) => {
                        saveFileOnIpfs(reader).then((hash) => {
                            const { accounts, contract,account,password } = this.state;
                            let file_tree_obj = JSON.parse(this.state.file_tree_data);
                            //TODO 判断是否已经存有该文件
                            if(file_tree_obj[hash]==null||file_tree_obj[hash]==undefined){
                                //新文件
                                file_tree_obj[hash] = {
                                    "fileName": file.name,
                                    "fileHash": hash,
                                    "key": hash,
                                    "uploadTime": getNowFormatDate()
                                }
                                let file_tree_json = JSON.stringify(file_tree_obj);
                                let encryptedPwd = sha256Encrypt(password, account);
                                contract.methods.update(account,encryptedPwd,file_tree_json).send({ from: accounts[0], gas: 1000000 }).then((result)=>{
                                    console.log(result)
                                    let resultCode = result.events.UpdateEvent.returnValues[0];
                                    let resultMsg = result.events.UpdateEvent.returnValues[1];
                                    if(resultCode==200){
                                        this.setState({ file_tree_data: file_tree_json })
                                        //更新sessionStore
                                        window.sessionStorage.setItem("file_tree_json",file_tree_json)
                                    }else{
                                        console.log("更新失败")
                                    }
                                })
                            }else{
                                console.log('已存有该文件')
                            }
                        }).catch((err) => {
                            console.log('备份文件失败')
                        })
                    }
                })
            }
        }
        return props;
    }

    getColumn = () => {
        return [{
            title: '文件名',
            dataIndex: 'fileName',
            key: 'fileName'
        }, {
            title: '文件Hash',
            dataIndex: 'fileHash',
            key: 'fileHash',
        }, {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href={'http://localhost:8080/ipfs/' + record.fileHash} target="_Blank"><Icon type="eye" />预览</a>
                    <Divider type="vertical" />
                    {/* <a href="javascript:;" onClick={() => { this.downloadFile(record.fileHash) }}><Icon type="download" />下载</a> */}
                    <a href="javascrpit:;" onClick={() => { this.downloadFile(record.fileHash,record.fileName) }}><Icon type="download" />下载</a>
                </span>
            ),
        }];
    }

    downloadFile = (dataHash,fileName) => {
        getFileFromIpfs(dataHash).then((resultArr) => {
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            let blob = new Blob([resultArr], { type: "octet/stream" }), url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((err) => {
            alert('下载文件失败')
        })
    }

    getfileDataArr = () => {
        let dataObj = JSON.parse(this.state.file_tree_data);
        let dataArr = new Array();
        Object.keys(dataObj).forEach(function(key){
            dataArr.push(dataObj[key])
       });
        return dataArr;
    }

    render() {
        return (
            <Layout>
                <Header>
                    <h2 style={{ color: '#fff' }}><Icon type="cloud" />&nbsp;&nbsp;云文件系统</h2>
                </Header>
                <Layout>
                    <Sider width={250} style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['myfiles']}
                            defaultOpenKeys={['myfiles']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="myfiles"><Icon type="folder-open" />我的文件</Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item><Upload {...this.getProps()}>
                                <Button>
                                    <Icon type='upload' />上传文件
                                </Button>
                            </Upload></Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{
                            background: '#fff', padding: 24, margin: 0, minHeight: 790,
                        }}
                        >
                            <Table columns={this.getColumn()} dataSource={this.getfileDataArr()} />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}