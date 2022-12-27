// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context{
    address private _owner;
    constructor() {
        _setOwner(_msgSender());
    }
    function owner() public view virtual returns (address) {
        return _owner;
    }
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: You can't permission.");
        _;
    }
    function _setOwner(address newOwner) private {
        _owner = newOwner;
    }
}

interface IFilm {
    function getId() external view returns (uint256);
    function getPrice() external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function setDiscount(string calldata uid, uint256 price) external returns (bool);
    function getDiscount(string calldata uid) external view returns (uint256);
    function setBooking(string calldata cluster, string calldata cinema, string calldata room, string calldata position, uint256 timestamp) external returns (bool);
    function getBooking(string calldata room, string calldata position, uint256 timestamp) external view returns (address);
    function getOwner() external view returns(address);
    event Booked(address indexed buyer, string cluster, string cinema, string room, string position, uint256 timestamp);
}

contract Film is IFilm, Ownable{

    uint256 _id;
    uint256 _price; //VND
    uint8 _decimals;
    mapping (string => mapping(string => mapping(uint256 => address))) _booking; // room -> position -> timestamp
    mapping (string => uint256) _discount; //uid_discount ~ VND < price
    mapping (address => uint256) private _balances;
    uint256 private _totalSupply;

    constructor(uint256 id, uint256 price){
        _id = id;
        _price = price;
        _decimals = 0;
    }

    function getId() public override view returns (uint256) {
        return _id;
    }

    function getPrice() public override view returns (uint256) {
        return _price;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function setDiscount(string calldata uid, uint256 price) public override returns (bool){
        _discount[uid] = price;
        return true;
    }

    function getDiscount(string calldata uid) public override view returns (uint256) {
        return _discount[uid];
    }

    function setBooking(string calldata cluster, string calldata cinema, string calldata room, string calldata position, uint256 timestamp) public override returns (bool){
        _booking[room][position][timestamp] = _msgSender();
        _mint(_msgSender(), 1);
        emit Booked(_msgSender(), cluster, cinema, room, position, timestamp);
        return true;
    }

    function getBooking(string calldata room, string calldata position, uint256 timestamp) public override view returns (address){
        return _booking[room][position][timestamp];
    }

    function getOwner() public override view returns (address){
        return _msgSender();
    }
    
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        unchecked {
            _balances[account] += amount;
        }
    }
}