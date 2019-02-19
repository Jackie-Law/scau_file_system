import React from "react";
import { saveFileOnIpfs, getFileFromIpfs } from '../utils/ipfsIOUtil';
import {
    Layout, Menu, Breadcrumb, Icon, Upload, Button, Table, Divider
} from 'antd';

const { Header, Content, Sider } = Layout;

export default class Home extends React.Component {

    state = {
        // file_tree_data: window.sessionStorage.getItem("file_tree_json")
        file_tree_data: '[{"fileName":"test.txt","key":"QmeaSGiKMHo2S8ZtfnS5LkrXE9Lavxr8A6RyEBHCoGnpyy","fileHash":"QmeaSGiKMHo2S8ZtfnS5LkrXE9Lavxr8A6RyEBHCoGnpyy","uploadTime":"2019-02-19"}]'
    };

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
                            let file_tree_obj = JSON.parse(this.state.file_tree_data);
                            //TODO 判断是否已经存有该文件
                            file_tree_obj.push({
                                "fileName": file.name,
                                "fileHash": hash,
                                "key": hash,
                                "uploadTime": '2019-02-19'
                            })
                            let file_tree_json = JSON.stringify(file_tree_obj);
                            this.setState({ file_tree_data: file_tree_json })
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
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href={'http://localhost:8080/ipfs/' + record.fileHash} target="_Blank"><Icon type="eye" />预览</a>
                    <Divider type="vertical" />
                    {/* <a href="javascript:;" onClick={() => { this.downloadFile(record.fileHash) }}><Icon type="download" />下载</a> */}
                    <a href="javascrpit:;" onClick={() => { this.downloadFile(record.fileHash) }}><Icon type="download" />下载</a>
                </span>
            ),
        }];
    }

    downloadFile = (dataHash) => {
        getFileFromIpfs(dataHash).then((data) => {
            console.log(data)
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            let blob = new Blob([data], { type: "octet/stream" }), url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'example.jpg';
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((err) => {
            alert('下载文件失败')
        })
    }

    getfileDataArr = () => {
        let dataObj = JSON.parse(this.state.file_tree_data);
        return dataObj;
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