// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataRegistry {
    struct DataDocument {
        string description;
        uint256 sharingFee;
        string accessPolicy;
        address dataProvider;
        bytes32 hashedCID;
    }

    mapping(bytes32 => DataDocument) public dataDocuments;

    event DataDocumentUploaded(bytes32 indexed hashedCID, address indexed dataProvider);

    function uploadDataDocument(string memory _description, uint256 _sharingFee, string memory _accessPolicy, bytes32 _hashedCID) external {
        require(dataDocuments[_hashedCID].dataProvider == address(0), "Data document already exists");

        DataDocument memory newDocument = DataDocument({
            description: _description,
            sharingFee: _sharingFee,
            accessPolicy: _accessPolicy,
            dataProvider: msg.sender,
            hashedCID: _hashedCID
        });

        dataDocuments[_hashedCID] = newDocument;
        emit DataDocumentUploaded(_hashedCID, msg.sender);
    }
}
