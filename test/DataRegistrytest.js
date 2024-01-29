// 引入智能合约
const DataRegistry = artifacts.require("DataRegistry");

// 定义测试套件
contract("DataRegistry", function (accounts) {
  // 定义一些常量
  const dataProvider = accounts[0]; // 数据提供者的地址
  const dataConsumer = accounts[1]; // 数据消费者的地址
  const description = "This is a data document"; // 数据文档的描述
  const sharingFee = 100; // 数据文档的分享费用
  const accessPolicy = "public"; // 数据文档的访问策略
  const hashedCID = web3.utils.sha3("QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vz"); // 数据文档的哈希CID

  // 定义一个智能合约实例
  let dataRegistry;

  // 在每个测试用例之前，部署一个新的智能合约实例
  beforeEach(async function () {
    dataRegistry = await DataRegistry.new();
  });

  // 测试上传数据文档的函数
  it("should upload a data document", async function () {
    // 调用uploadDataDocument函数，传入参数，从数据提供者的地址发送交易
    await dataRegistry.uploadDataDocument(
      description,
      sharingFee,
      accessPolicy,
      hashedCID,
      { from: dataProvider }
    );

    // 查询dataDocuments映射，根据哈希CID获取对应的DataDocument结构体
    let dataDocument = await dataRegistry.dataDocuments(hashedCID);

    // 断言DataDocument结构体的属性和参数一致
    assert.equal(dataDocument.description, description, "The description should match");
    assert.equal(dataDocument.sharingFee, sharingFee, "The sharing fee should match");
    assert.equal(dataDocument.accessPolicy, accessPolicy, "The access policy should match");
    assert.equal(dataDocument.dataProvider, dataProvider, "The data provider should match");
    assert.equal(dataDocument.hashedCID, hashedCID, "The hashed CID should match");
  });

  // 测试上传重复的数据文档的函数
  it("should not upload a duplicate data document", async function () {
    // 调用uploadDataDocument函数，传入参数，从数据提供者的地址发送交易
    await dataRegistry.uploadDataDocument(
      description,
      sharingFee,
      accessPolicy,
      hashedCID,
      { from: dataProvider }
    );

    // 再次调用uploadDataDocument函数，传入相同的参数，从数据提供者的地址发送交易
    try {
      await dataRegistry.uploadDataDocument(
        description,
        sharingFee,
        accessPolicy,
        hashedCID,
        { from: dataProvider }
      );
      // 如果没有抛出异常，就断言失败
      assert.fail("The transaction should revert");
    } catch (error) {
      // 如果抛出异常，就断言异常信息包含"Data document already exists"
      assert.include(error.message, "Data document already exists", "The error message should match");
    }
  });

  // 测试上传数据文档的事件
  it("should emit a DataDocumentUploaded event", async function () {
    // 调用uploadDataDocument函数，传入参数，从数据提供者的地址发送交易，并且获取交易的回执
    let receipt = await dataRegistry.uploadDataDocument(
      description,
      sharingFee,
      accessPolicy,
      hashedCID,
      { from: dataProvider }
    );

    // 获取交易回执中的事件数组
    let events = receipt.logs;

    // 断言事件数组的长度为1
    assert.equal(events.length, 1, "There should be one event emitted");

    // 获取第一个事件
    let event = events[0];

    // 断言事件的名称为"DataDocumentUploaded"
    assert.equal(event.event, "DataDocumentUploaded", "The event name should match");

    // 断言事件的参数和传入的参数一致
    assert.equal(event.args.hashedCID, hashedCID, "The event argument hashedCID should match");
    assert.equal(event.args.dataProvider, dataProvider, "The event argument dataProvider should match");
  });

  // 测试查询数据文档的函数
  it("should query a data document", async function () {
    // 调用uploadDataDocument函数，传入参数，从数据提供者的地址发送交易
    await dataRegistry.uploadDataDocument(
      description,
      sharingFee,
      accessPolicy,
      hashedCID,
      { from: dataProvider }
    );

    // 调用dataDocuments函数，传入哈希CID，从数据消费者的地址发送调用
    let dataDocument = await dataRegistry.dataDocuments(hashedCID, { from: dataConsumer });

    // 断言返回的DataDocument结构体的属性和参数一致
    assert.equal(dataDocument.description, description, "The description should match");
    assert.equal(dataDocument.sharingFee, sharingFee, "The sharing fee should match");
    assert.equal(dataDocument.accessPolicy, accessPolicy, "The access policy should match");
    assert.equal(dataDocument.dataProvider, dataProvider, "The data provider should match");
    assert.equal(dataDocument.hashedCID, hashedCID, "The hashed CID should match");
  });

  // 测试计算gas消耗和费用的方法
  it("should calculate gas used and gas cost", async function () {
    // 定义gas价格为20Gwei
    const gasPrice = web3.utils.toWei("20", "gwei");

    // 调用uploadDataDocument函数，传入参数，从数据提供者的地址发送交易，并且获取交易的回执
    let receipt = await dataRegistry.uploadDataDocument(
      description,
      sharingFee,
      accessPolicy,
      hashedCID,
      { from: dataProvider, gasPrice: gasPrice }
    );

    // 获取交易回执中的gas消耗
    let gasUsed = receipt.receipt.gasUsed;

    // 计算gas费用，单位为wei
    let gasCost = gasUsed * gasPrice;

    // 转换gas费用为ether，保留6位小数
    let gasCostInEther = web3.utils.fromWei(gasCost.toString(), "ether");
    gasCostInEther = parseFloat(gasCostInEther).toFixed(6);

    // 打印gas消耗和费用
    console.log("Gas used: " + gasUsed);
    console.log("Gas cost: " + gasCostInEther + " ether");
  });
});
