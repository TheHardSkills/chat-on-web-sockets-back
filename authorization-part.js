class AutorizationPart {
  writingUserDataToDb(data) {
    const objectWithClientData = JSON.parse(data);
    const dataProcessing = new mongoDbDataProcessing();
    dataProcessing.userCreator(objectWithClientData);
  }
}

module.exports = AutorizationPart;
