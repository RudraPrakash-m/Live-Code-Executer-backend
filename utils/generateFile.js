const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "../temp");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes);
}

const generateFile = (language, code, input = "") => {
  const jobId = uuid();

  const extension = language === "python" ? "py" : "js";

  const codeFile = `${jobId}.${extension}`;
  const inputFile = `${jobId}.txt`;

  const codePath = path.join(dirCodes, codeFile);
  const inputPath = path.join(dirCodes, inputFile);

  fs.writeFileSync(codePath, code);

  if (input) {
    fs.writeFileSync(inputPath, input);
  }

  return {
    codePath,
    inputPath,
    codeFile,
  };
};

module.exports = generateFile;
