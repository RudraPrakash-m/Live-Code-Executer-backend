const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeJS = ({ codePath, inputPath, codeFile }) => {
  return new Promise((resolve, reject) => {
    const dockerPath = path.join(process.cwd(), "temp").replace(/\\/g, "/");

    let runCommand = `node /app/${codeFile}`;

    if (inputPath && fs.existsSync(inputPath)) {
      runCommand += ` < /app/${path.basename(inputPath)}`;
    }

    const command = `docker run --rm --memory="100m" --cpus="0.5" -v "${dockerPath}:/app" node:18 sh -c "${runCommand}"`;

    exec(command, { timeout: 20000 }, (error, stdout, stderr) => {
      try {
        if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
        if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      } catch {}

      if (error) {
        return reject(stderr || error.message);
      }

      if (stderr) {
        return reject(stderr);
      }

      resolve(stdout);
    });
  });
};

module.exports = executeJS;
