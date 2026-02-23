module.exports = (output, { vars }) => {
  const parsed = JSON.parse(output);
  const results = { pass: false, score: 0, reason: "" };
  if (parsed.error) {
    results.pass = true;
    results.score = 1;
    results.reason = "Correctly returned error: " + parsed.error;
  } else {
    const errorContext = vars.error_context || "generic";
    results.reason = `Should return error for ${errorContext}`;
  }
  return results;
};