// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataAccessControlContract {
    enum ReputationLevel {H, M, L}
    enum SensitivityLevel {High, Moderate, Low}
    enum AccessDecision {Full, Authorized, Restricted}

    // 存储消费者的信誉级别
    mapping(address => ReputationLevel) public consumerReputation;

    // 访问策略表
    mapping(ReputationLevel => mapping(SensitivityLevel => AccessDecision)) public accessStrategy;

    // 事件用于通知访问决策
    event AccessDecisionMade(address consumer, SensitivityLevel sensitivity, AccessDecision decision);

    // 构造函数，初始化访问策略表
    constructor() {
        // 设置访问策略表，根据提供的访问策略表进行设置
        accessStrategy[ReputationLevel.H][SensitivityLevel.High] = AccessDecision.Full;
        accessStrategy[ReputationLevel.H][SensitivityLevel.Moderate] = AccessDecision.Full;
        accessStrategy[ReputationLevel.H][SensitivityLevel.Low] = AccessDecision.Full;

        accessStrategy[ReputationLevel.M][SensitivityLevel.High] = AccessDecision.Authorized;
        accessStrategy[ReputationLevel.M][SensitivityLevel.Moderate] = AccessDecision.Full;
        accessStrategy[ReputationLevel.M][SensitivityLevel.Low] = AccessDecision.Full;

        accessStrategy[ReputationLevel.L][SensitivityLevel.High] = AccessDecision.Restricted;
        accessStrategy[ReputationLevel.L][SensitivityLevel.Moderate] = AccessDecision.Authorized;
        accessStrategy[ReputationLevel.L][SensitivityLevel.Low] = AccessDecision.Full;
    }

    // 执行声誉检查和访问控制的主要函数
    function CheckReputation(SensitivityLevel _sensitivity) external returns (AccessDecision) {
        ReputationLevel consumerReputationLevel = consumerReputation[msg.sender];
        AccessDecision decision = accessStrategy[consumerReputationLevel][_sensitivity];

        // 发出事件通知访问决策
        emit AccessDecisionMade(msg.sender, _sensitivity, decision);

        return decision;
    }

    // 设置消费者的信誉级别，只有合约拥有者可以调用
    function setConsumerReputation(address _consumer, ReputationLevel _reputationLevel) external {
        require(msg.sender == owner, "Only owner can set consumer reputation");
        consumerReputation[_consumer] = _reputationLevel;
    }

    // 添加 public getter 函数，以便测试代码可以直接访问 accessStrategy
    function getAccessStrategy(ReputationLevel _reputation, SensitivityLevel _sensitivity) external view returns (AccessDecision) {
        return accessStrategy[_reputation][_sensitivity];
    }

    // 简单的设置合约拥有者的函数，供演示目的
    function setOwner(address _newOwner) external {
        require(msg.sender == owner, "Only current owner can set a new owner");
        owner = _newOwner;
    }

    // 合约拥有者
    address public owner = msg.sender;
}
