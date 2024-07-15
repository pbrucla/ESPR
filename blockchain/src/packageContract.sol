// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract PackageManager{
    Package[] public packages;

    event packageCreated(address sender, string packageName, string[] dependencyList); 

    function create_package(string calldata _name, string[] calldata _dependencies) public returns (address) {
        Package p = new Package(tx.origin, _name, _dependencies);
        packages.push(p);
        emit packageCreated(tx.origin, _name, _dependencies); 
        return address(p);
    }
}

contract Package {
    string public name;
    string[] public versions;
    //naming convention: major, minor, patch (#.#.#) 
    int[3] public current_version; 
    mapping(string => string[]) public dependencyMap; 
    address public author;
    address[] public collaborators;
    bool public packageEnabled;

    constructor(address _author, string memory _name, string[] dependencyList) {
        author = _author;
        name = _name;
        current_version[0] = 1; 
        current_version[1] = 0; 
        current_version[2] = 0; 
        
        packageEnabled = true;
    }

    modifier only_author() {
        require(msg.sender == author, "Not author");
        _;
    }

    modifier enabled() {
        require(enabled, "Contract Disabled");
	  _;
    }
    

    function add_version(string memory v) public only_author enabled {
        versions.push(v);
    }

    function get_name() public enabled view returns (string memory) {
        return name;
    }

    function get_versions() public enabled view returns (string[] memory)
    {
        return versions;
    }
    function disable() public only_author {
       enabled = false;
    }
}
