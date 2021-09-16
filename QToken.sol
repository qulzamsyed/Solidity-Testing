// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract QToken {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    uint256 private totalSupply;
    string private name;
    string private symbol;
    address public owner;
    constructor (string memory _name, string memory _symbol,uint256 _totalSupply) public{
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        owner = msg.sender;
    }
    modifier onlyContractOwner() {
    require(msg.sender == owner,"This function is restricted to the contract's owner");
    _;
  }
    function getName() public view returns(string memory) {
        return name;
    }
    function getSymbol() public view returns(string memory) {
        return symbol;
    }
    function getTotalSupply() public view returns(uint256) {
        return totalSupply;
    }
     function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    function transfer(address recipient,uint256 amount) public{
        uint256 senderBalance = balances[msg.sender];
        require(senderBalance >= amount, "  ");
            balances[msg.sender] = senderBalance - amount;
            balances[recipient] += amount;
    }
    function transferFrom(address sender,address recipient,uint256 amount ) public returns (bool) {
            require(balances[sender] >= amount, "transfer amount exceeds balance");
            require(allowances[sender][msg.sender] >= amount, "transfer amount exceeds allowance");
            balances[sender] = balances[sender] - amount;
            balances[recipient] += amount;
            allowances[sender][msg.sender] -= amount;
        return true;
    }
      function approve(address _owner,address _spender,uint256 _amount) public {
        allowances[_owner][_spender] = _amount;
    }
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }
    function mint(address account, uint256 amount)  public onlyContractOwner{

        totalSupply += amount;
        balances[account] += amount;
    }
    function burn(address account, uint256 amount)  public onlyContractOwner{

        require(balances[account] >= amount, "burn amount exceeds balance");
            balances[account] = balances[account] - amount;
            totalSupply -= amount;
    }


}