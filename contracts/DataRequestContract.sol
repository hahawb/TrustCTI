// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataRequestContract {
    // 结构表示数据请求
    struct DataRequest {
        address consumer; // 数据请求者地址
        bytes32 requestHash; // 数据请求的哈希值
        bool isLegitimate; // 数据请求是否被认为是合法的
    }

    // 存储所有数据请求的映射
    mapping(uint256 => DataRequest) public dataRequests;

    // 请求计数器，用于生成唯一的请求 ID
    uint256 public requestCount;

    // 事件用于通知数据请求创建
    event DataRequestCreated(uint256 requestId, address consumer, bytes32 requestHash);

    // 构造函数
    constructor() {
        requestCount = 0;
    }

    // 创建新数据请求
    function requestData(bytes32 _requestHash) external payable {
        // 增加请求计数器
        requestCount++;

        // 创建数据请求对象
        DataRequest storage newRequest = dataRequests[requestCount];
        newRequest.consumer = msg.sender;
        newRequest.requestHash = _requestHash;
        newRequest.isLegitimate = false;

        // 发出事件通知数据请求创建
        emit DataRequestCreated(requestCount, msg.sender, _requestHash);
    }

    // 锁定支付费用
    function lockFee(uint256 _requestId) external payable {
        require(_requestId <= requestCount && _requestId > 0, "Invalid request ID");
        require(msg.value > 0, "Payment fee must be greater than zero");

        // 获取数据请求对象
        DataRequest storage requested = dataRequests[_requestId];

        // 标记数据请求为合法
        requested.isLegitimate = true;

        // 在实际应用中，这里可能需要将收到的支付费用存储起来，以便后续转账给数据提供者
    }
}
