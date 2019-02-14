import React from "react";
import { Tree, Menu, Icon} from 'antd';
import '../style/UserCenter.css'

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

export default class UserCenter extends React.Component {

    state = {
        file_tree_data: window.sessionStorage.getItem("file_tree_json")
    };

    onSelect = () => {
        console.log(this.state)
    };

    onExpand = () => {
        // console.log('Trigger Expand');
    }

    dataJsonToComponent = () =>{
        // let dataObj = JSON.parse('{"test.txt":"asdasd"}');
        // Object.keys(dataObj).map(key=>{
        //     console.log(key+"--"+dataObj[key])
        //     return <TreeNode title={key} key={dataObj[key]}></TreeNode>
        // })
        return (<TreeNode title='文件1' key='asasd' isLeaf/>)
    }

    render() {
        return (
            <div id="container">
                <div>
                    <Menu mode="horizontal" selectedKeys={['Logo']}>
                        <Menu.Item key='Logo'>
                            <Icon type="cloud"/>云文件系统
                        </Menu.Item>
                        
                    </Menu>
                </div>
                <div className='file-tree'>
                    <DirectoryTree defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
                        <TreeNode title="我的文件" key="root">
                            {this.dataJsonToComponent}
                        </TreeNode>
                    </DirectoryTree>
                    <div></div>
                </div>
            </div>
        )
    }
}