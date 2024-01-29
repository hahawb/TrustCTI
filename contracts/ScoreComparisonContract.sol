// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScoreComparisonContract {
    address public consumer;
    address public dataProducer;

    // 构造函数，初始化消费者和数据生产者地址
    constructor(address _consumer, address _dataProducer) {
        consumer = _consumer;
        dataProducer = _dataProducer;
    }

    // 比较分数是否相差不超过4
    // 修改：添加一个 pure 修饰符，表示这是一个纯函数
    // 参考：1
    function compareScores(uint8 consumerCS, uint8 consumerDQ, uint8 consumerOT, uint8 consumerDS, uint8 consumerDI,
                            uint8 producerCS, uint8 producerDQ, uint8 producerOT, uint8 producerDS, uint8 producerDI)
        external pure returns (bool) {
        // 使用消费者的分数值减去数据提供者的分数小于4的绝对值
        uint8 differenceCS = abs(consumerCS - producerCS);
        uint8 differenceDQ = abs(consumerDQ - producerDQ);
        uint8 differenceOT = abs(consumerOT - producerOT);
        uint8 differenceDS = abs(consumerDS - producerDS);
        uint8 differenceDI = abs(consumerDI - producerDI);

        // 检查每个因素的差距是否都小于等于4
        require(differenceCS <= 4, "CS difference exceeds 4");
        require(differenceDQ <= 4, "DQ difference exceeds 4");
        require(differenceOT <= 4, "OT difference exceeds 4");
        require(differenceDS <= 4, "DS difference exceeds 4");
        require(differenceDI <= 4, "DI difference exceeds 4");

        // 如果所有因素的差距都小于等于4，则返回true
        return true;
    }

    // 辅助函数：计算绝对值
    function abs(uint8 x) internal pure returns (uint8) {
        return x >= 0 ? x : -x;
    }
}
