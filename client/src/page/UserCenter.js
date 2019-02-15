import React from "react";
import { Tree, Menu, Icon, Upload, Button, message} from 'antd';
import '../style/UserCenter.css'

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;


export default class UserCenter extends React.Component {

    state = {
        file_tree_data: window.sessionStorage.getItem("file_tree_json")
    };

    onSelect = (comp) => {
        console.log(comp)
    };

    onExpand = () => {
        // console.log('Trigger Expand');
    }

    // onMenuClick = ({item, key}) => {
    //     if(key=='upload-Btn'){
    //         //点击上传
    //         this.fileUploadRef.click();
    //     }
    // }

    getProps = () => {
        const props = {
            name: 'file',
            showUploadList: false,
            action: (file) =>{
                return new Promise((solve,reject)=>{
                    console.log(file)
                })
            }
        }
        return props;
    }

    dataJsonToComponent = () =>{
        let dataObj = JSON.parse('{"test.txt":"asdasd"}');
        let compArr = [];
        Object.keys(dataObj).map(function(key){
            compArr.push(<TreeNode title={key} key={dataObj[key]} isLeaf/>);
        })
        return compArr;
    }

    render() {
        return (
            <div id="container">
                <div>
                    <Menu mode="horizontal" selectedKeys={['Logo']} onClick={this.onMenuClick}>
                        <Menu.Item key='Logo'>
                            <Icon type="cloud"/>云文件系统
                        </Menu.Item>
                        <Menu.Item key='upload-Btn'>
                            <Upload {...this.getProps()}>
                                <Button>
                                    <Icon type='upload'/>上传文件
                                </Button>
                            </Upload>
                        </Menu.Item>
                    </Menu>
                    {/* <input ref={(ref) => {this.fileUploadRef = ref}} type='file' hidden/> */}
                </div>
                <div className='file-tree'>
                    <DirectoryTree defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
                        <TreeNode title="我的文件" key="root">
                            {this.dataJsonToComponent()}
                        </TreeNode>
                    </DirectoryTree>
                    <div></div>
                </div>
            </div>
        )
    }
}