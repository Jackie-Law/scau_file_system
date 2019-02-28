pragma solidity ^0.5.0;
contract BackupContract {
    
    
    uint256 constant redundancy_num = 4;
    
    string[] backupOrderList;
    
    mapping(string => address[]) file_redundancy_map;
    
    event postEvent(int code, string msg);
    event requestEvent(int code, string msg);
    
    function postBackupOrder(string memory fileHash) public returns (int, string memory){
        if(file_redundancy_map[fileHash].length>0){
            emit postEvent(500,"file redundancy already exists");
            return (500,"file redundancy already exists");
        }else{
            address req_node_addr = msg.sender;
            address[] memory addressList = new address[](redundancy_num);
            addressList[0] = req_node_addr;
            file_redundancy_map[fileHash] = addressList;
            backupOrderList.push(fileHash);
            emit postEvent(200,"success");
            return (200,"success");
        }
    }
    
    function requestBackup() public returns (int, string memory){
        address req_node_addr = msg.sender;
        for(uint i=0;i<backupOrderList.length;i++){
            string memory fileHash = backupOrderList[i];
            address[] memory addressList = file_redundancy_map[fileHash];
            for(uint j=0;j<addressList.length;j++){
                if(addressList[j]==req_node_addr){
                    break;
                }else if(addressList[j]==address(0)){
                    addressList[j] = msg.sender;
                    file_redundancy_map[fileHash] = addressList;
                    if(j+1==redundancy_num){
                        deleteStrAt(i);
                    }
                    emit requestEvent(200,fileHash);
                    return (200,fileHash);
                }
            }
        }
        emit requestEvent(500,"no suitable order found");
        return (500,"no suitable order found");
    }
    
    function deleteStrAt(uint index) private{
        uint len = backupOrderList.length;
        if (index >= len) return;
        for (uint i = index; i<len-1; i++) {
            backupOrderList[i] = backupOrderList[i+1];
        }
        
        delete backupOrderList[len-1];
        backupOrderList.length--;
    }
}