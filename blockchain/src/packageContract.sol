// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract PackageManager{
    Package[] public packages;

    event packageCreated(address sender, string packageName, string[] dependencyList); 

    function create_package(string calldata _name, string[] calldata _dependencies) public returns (address) {
        Package p = new Package(payable(tx.origin), _name, _dependencies);
        packages.push(p);
        emit packageCreated(tx.origin, _name, _dependencies); 
        return address(p);
    }

    function get_packages() public view returns(Package[] memory) {
        return packages;
    }
}

contract Package {
    string public name;
    address payable public author;
    string[] public versions;
    //naming convention: major, minor, patch (#.#.#) 
    //https://semver.org/
    uint[3] public current_version; 
    mapping(string => string[]) public dependencyMap; 
    mapping(address => bool) public collaboratorMap;
    address[] public collaborators;
    bool public packageEnabled;

    event packageVersionUpdate(address sender, string packageName, string version_number, string[] dependencyList); 
    event collaboratorAdded(address sender, address addedCollaborator, string packageName); 
    event packageDisabled(address sender, string packageStatus, string packageName); 

    constructor(address payable _author, string memory _name, string[] memory dependencyList) {
        author = _author;
        name = _name;
        collaboratorMap[author] = true; 
        current_version[0] = 1; 
        current_version[1] = 0; 
        current_version[2] = 0; 
        versions.push("1.0.0");
        //alternative for storing dependencyList (test if change is persistent, this will save gas since we can avoid for loop iteration) 
        // dependencyMap[name] = dependencyList; 
        uint length = dependencyList.length; 
        for(uint256 i = 0; i < length; i++)
        {
            dependencyMap["1.0.0"].push(dependencyList[i]); 
        }
        //collaborators left empty for now
        packageEnabled = true;
    }

    modifier only_author() {
        require(tx.origin == author, "Not author");
        _;
    } 

    modifier only_editors {
        require(collaboratorMap[tx.origin], "Not a valid collaborator");
        _;
    }

    modifier enabled() {
        require(packageEnabled, "Package Disabled");
	    _;
    }
    
    modifier check_valid_update(uint input) {
        require(input == 0 || input == 1 || input == 2, "Invalid Update Status");
        _;
    }

    //update_status has 0,1,2 values corresponding to major, minor, patch updates 
    function add_version(uint update_status, string[] memory dependencyList) public only_editors enabled check_valid_update(update_status) {
        if (update_status == 0) {
            current_version[0] += 1;
            current_version[1] = 0;
            current_version[2] = 0;
        } else if (update_status == 1) {
            current_version[1] += 1;
            current_version[2] = 0;
        } else if (update_status == 2) {
            current_version[2] += 1;
        }
        string memory str1 = Strings.toString(current_version[0]);
        string memory str2 = Strings.toString(current_version[1]);
        string memory str3 = Strings.toString(current_version[2]);

        string memory version_name = string(abi.encodePacked(str1, ".", str2, ".", str3));
        versions.push(version_name);
        uint length = dependencyList.length;
        for (uint256 i = 0; i < length; i++) {
            dependencyMap[version_name].push(dependencyList[i]);
        }
        emit packageVersionUpdate(tx.origin, name, version_name, dependencyList); 
    }
    

    function add_collaborator(address collab_user) public only_author enabled {
        collaborators.push(collab_user); 
        collaboratorMap[collab_user] = true;
        emit collaboratorAdded(tx.origin, collab_user, name);
    }

    function get_collaborators() public view returns (address[] memory) {
        return collaborators;
    }

    function get_name() public view returns (string memory) {
        return name;
    }

    function get_versions() public view returns (string[] memory)
    {
        return versions;
    }

    function get_dependencies(string calldata version_number) public view returns (string[] memory) 
    {
        return dependencyMap[version_number];
    }

    function donate() public payable {
        // Call returns a boolean value indicating success or failure of transaction
        (bool sent, ) = author.call{value: msg.value}("");
        require(sent, "Failed to donate");
    }

    function disable() public only_author {
       packageEnabled = false;
       emit packageDisabled(tx.origin, "discontinued", name);
    }
}