// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScoreVerificationContract1 {
    address public user;
    bytes32 public hashedCS;
    bytes32 public hashedDQ;
    bytes32 public hashedOT;
    bytes32 public hashedDS;
    bytes32 public hashedDI;

    Scores public plainScores;

    // Scores 结构定义
    struct Scores {
        uint8 CS;  // Cooperation Satisfaction
        uint8 DQ;  // Data Quality
        uint8 OT;  // On-Time Delivery
        uint8 DS;  // Data Security
        uint8 DI;  // Data Innovativeness
    }

    // 事件定义
    event HashedScoresSubmitted(address indexed user, bytes32 hashedCS, bytes32 hashedDQ, bytes32 hashedOT, bytes32 hashedDS, bytes32 hashedDI);
    event PlainScoresSubmitted(address indexed user, uint8 CS, uint8 DQ, uint8 OT, uint8 DS, uint8 DI);
    event ScoresMatched(address indexed user);

    // 构造函数，初始化用户地址
    constructor(address _user) {
        user = _user;
    }

    // 用户上传哈希分数
    function submitHashedScores(bytes32 _hashedCS, bytes32 _hashedDQ, bytes32 _hashedOT, bytes32 _hashedDS, bytes32 _hashedDI) external {
        require(msg.sender == user, "Only user can submit hashed scores");
        hashedCS = _hashedCS;
        hashedDQ = _hashedDQ;
        hashedOT = _hashedOT;
        hashedDS = _hashedDS;
        hashedDI = _hashedDI;

        // 触发事件
        emit HashedScoresSubmitted(user, _hashedCS, _hashedDQ, _hashedOT, _hashedDS, _hashedDI);
    }

    // 用户上传明文分数
    function submitPlainScores(uint8 _CS, uint8 _DQ, uint8 _OT, uint8 _DS, uint8 _DI) external {
        require(msg.sender == user, "Only user can submit plain scores");

        // 断言确保分数在有效范围内（根据实际需求进行调整）
        require(_CS <= 10 && _DQ <= 10 && _OT <= 10 && _DS <= 10 && _DI <= 10, "Invalid score values");

        // 存储明文分数
        plainScores = Scores(_CS, _DQ, _OT, _DS, _DI);

        // 触发事件
        emit PlainScoresSubmitted(user, _CS, _DQ, _OT, _DS, _DI);
    }
function compareHashes(uint8 _CS, uint8 _DQ, uint8 _OT, uint8 _DS, uint8 _DI) external {
    require(msg.sender == user, "Only user can compare hashes");

    // 断言确保分数在有效范围内
    require(_CS <= 10 && _DQ <= 10 && _OT <= 10 && _DS <= 10 && _DI <= 10, "Invalid score values");

    // 计算传入参数的哈希值，确保顺序一致
    bytes32 computedHashCS = keccak256(abi.encodePacked(_CS));
    bytes32 computedHashDQ = keccak256(abi.encodePacked(_DQ));
    bytes32 computedHashOT = keccak256(abi.encodePacked(_OT));
    bytes32 computedHashDS = keccak256(abi.encodePacked(_DS));
    bytes32 computedHashDI = keccak256(abi.encodePacked(_DI));

    // 使用计算出的哈希值进行比较
    require(
        computedHashCS == hashedCS &&
        computedHashDQ == hashedDQ &&
        computedHashOT == hashedOT &&
        computedHashDS == hashedDS &&
        computedHashDI == hashedDI,
        "Hashes do not match"
    );

    // 触发事件
    emit ScoresMatched(user);
}



}
