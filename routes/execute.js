const express = require("express");

const generateFile = require("../utils/generateFile");
const executeJS = require("../executor/jsExecutor");
const executePython = require("../executor/pyExecutor");

const router = express.Router();

router.post("/run", async (req, res) => {
  const { language, code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Empty code",
    });
  }

  try {
    const files = generateFile(language, code, input);

    let output;

    if (language === "javascript") {
      output = await executeJS(files);
    } else if (language === "python") {
      output = await executePython(files);
    } else {
      return res.status(400).json({
        success: false,
        message: "Language not supported",
      });
    }

    return res.json({
      success: true,
      output,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
});

module.exports = router;
