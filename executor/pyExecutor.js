const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executePython = ({ codePath, inputPath, codeFile }) => {
  return new Promise((resolve, reject) => {
    const dockerPath = path.join(process.cwd(), "temp").replace(/\\/g, "/");

    let runCommand = `python3 /app/${codeFile}`; // 🔧 use python3 (safer)

    // input support
    if (inputPath && fs.existsSync(inputPath)) {
      runCommand += ` < /app/${path.basename(inputPath)}`;
    }

    const command = `docker run --rm --memory="100m" --cpus="0.5" -v "${dockerPath}:/app" python:3.10 sh -c "${runCommand}"`;

    const start = Date.now(); // ✅ add timing

    exec(command, { timeout: 20000 }, (error, stdout, stderr) => {
      const end = Date.now(); // ✅ add timing

      // cleanup
      try {
        if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
        if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      } catch {}

      if (error) {
        return reject({
          status: error.killed ? "timeout" : "error",
          error: stderr || error.message,
        });
      }

      if (stderr) {
        return reject({
          status: "runtime_error",
          error: stderr,
        });
      }

      resolve({
        output: stdout,
        executionTime: `${end - start} ms`,
        status: "success",
      });
    });
  });
};

module.exports = executePython;
