import React from "react";
import { Tree, Menu, Icon, Upload, Button, message } from 'antd';
import '../style/UserCenter.css'
import { saveFileOnIpfs } from '../utils/ipfsIOUtil';
const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;


export default class UserCenter extends React.Component {

    state = {
        // file_tree_data: window.sessionStorage.getItem("file_tree_json")
        file_tree_data: '{"test.txt":"asdasd"}',
        preview_file_hash:''
    };

    onSelect = (comp) => {
        console.log('更新'+comp[0])
        this.setState({preview_file_hash:comp[0]})
    };

    onExpand = () => {
        // console.log('Trigger Expand');
    }

    getProps = () => {
        const props = {
            name: 'file',
            showUploadList: false,
            action: (file) => {
                return new Promise((solve, reject) => {
                    console.log(file)
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onloadend = (e)=>{
                        console.log(reader);
                        saveFileOnIpfs(reader).then((hash) => {
                            console.log(hash)
                            let file_tree_obj = JSON.parse(this.state.file_tree_data);
                            file_tree_obj[file.name]=hash;
                            let file_tree_json = JSON.stringify(file_tree_obj);
                            this.setState({file_tree_data:file_tree_json})
                        }).catch((err) => {
                            console.log('备份文件失败')
                        })
                    }
                })
            }
        }
        return props;
    }

    dataJsonToComponent = () => {
        let dataObj = JSON.parse(this.state.file_tree_data);
        let compArr = [];
        Object.keys(dataObj).map(function (key) {
            compArr.push(<TreeNode title={key} key={dataObj[key]} isLeaf />);
        })
        return compArr;
    }

    render() {
        return (
            <div id="container">
                <div>
                    <Menu mode="horizontal" selectedKeys={['Logo']} onClick={this.onMenuClick}>
                        <Menu.Item key='Logo'>
                            <Icon type="cloud" />云文件系统
                        </Menu.Item>
                        <Menu.Item key='upload-Btn'>
                            <Upload {...this.getProps()}>
                                <Button>
                                    <Icon type='upload' />上传文件
                                </Button>
                            </Upload>
                        </Menu.Item>
                    </Menu>
                    {/* <input ref={(ref) => {this.fileUploadRef = ref}} type='file' hidden/> */}
                </div>
                <div id='content-body'>
                    <div id='file-tree'>
                        <DirectoryTree defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
                            <TreeNode title="我的文件" key="root">
                                {this.dataJsonToComponent()}
                            </TreeNode>
                        </DirectoryTree>
                    </div>
                    <div id='preview'>
                        <iframe src={'http://localhost:8080/ipfs/QmXDX2HWHTzLf1N4D26k4rehaSHr3xR5uATHrCw62x94PM'} width='100%' height='100%'></iframe>
                    </div>
                </div>
            </div>
        )
    }
}