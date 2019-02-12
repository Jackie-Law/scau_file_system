pragma solidity ^0.5.0;
contract FileSystem {

    //账户->文件树密文(使用密码可逆加密的字符串)
    mapping(string => string) private user_data_map;
    //账户->密码MD5
    mapping(string => string) private user_pwd_map;
    
    event RegisterEvent(int code, string msg);

    /* 
     * 方法：判断账号是否存在
     * 参数：账号(string)
     * 返回值： true|false
     */
    function isAccountExist(string memory account) view public returns(bool){
        string memory value = user_data_map[account];
        if(bytes(value).length>0){
            return true;
        }else{
            return false;
        }
    }
    
    /*
     * 方法：注册
     * 参数：账号(string)、密码(string)
     */
    function register(string memory account, string memory password, string memory file_data) public returns(int,string memory){
        if(isAccountExist(account)){
            emit RegisterEvent(500,"账号已存在");
            return (500,"账号已存在");
        }else{
            //TODO 注册账号格式校验
            user_pwd_map[account] = password;
            user_data_map[account] = file_data;
            emit RegisterEvent(200,"注册成功");
            return (200,"注册成功");
        }
    }
    
    /*
     * 方法：登录
     * 参数：账号、密码
     * 返回值：DES加密的 文件树字符串
     */
     function login(string memory account) public view returns(int,string memory){
         return (200,user_data_map[account]);
     }

     /*
      * 方法：更新
      *
      */
      function update(string memory account, string memory password, string memory file_data) public returns(int, string memory){
          string memory pwd = user_pwd_map[account];
          if(keccak256(bytes(pwd))==keccak256(bytes(password))){
              user_data_map[account] = file_data;
              return (200,"更新成功");
          }else{
              return (500,"密码错误");
          }
      }
}