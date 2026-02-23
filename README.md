# Promptfoo: External file references for nested assertions

This repository demonstrates a feature request for [Promptfoo](https://www.promptfoo.dev/) to support external file references for nested assertion properties.

## The problem

Currently, Promptfoo only allows external file references (`file://`) for the top-level `value` property in assertions. This means:

- You **cannot** reference external files for assertion `type`, `provider`, or other nested properties
- You must either inline all assertion configurations or duplicate them across test cases
- RReusing assertions across multiple tests violates the DRY principle
- Building modular assertion libraries is not possible

## The solution

This feature request proposes supporting external file references throughout the entire assertion structure, enabling:

- Defining assertions once and reusing them across multiple test cases
- Multi-level file organization with nested references
- True modularity and reusability of assertion configurations
- Better maintainability of large test suites

## Repository structure

```
├── assertions/
│   ├── working/              # Current working approach (file refs in value only)
│   │   ├── is-valid-json-default.yaml
│   │   ├── is-valid-json-edge-cases.yaml
│   │   ├── llm-rubric-warm-greeting.txt
│   │   └── edge-cases.js
│   └── not-working/          # Demonstration of the limitation
│       ├── expected/         # What currently works (sort of)
│       │   └── default.yaml
│       └── ideal/            # What we want (nested file refs)
│           ├── default.yaml
│           └── edge-cases.yaml
├── tests/
│   ├── original.yaml         # Working: inline assertions
│   ├── expected.yaml         # Not working: nested file refs in test
│   ├── ideal.yaml            # Ideal: cleaner nested file refs
│   └── workaround.yaml       # Workaround: use labels
├── prompts/
│   └── prompt.txt            # Sample prompt
├── promptfooconfig.yaml      # Promptfoo configuration
└── package.json              # Project dependencies
```

## Test scenarios

### 1. Original working approach (`tests/original.yaml`)

**What works:** Inlining all assertion properties with file references only in `value`

```yaml
- vars: { name: "Alice", time_of_day: "morning" }
  assert:
    - type: is-json
      value: file://assertions/working/is-valid-json-default.yaml
    - type: llm-rubric
      provider: ollama:mistral:7b
      value: file://assertions/working/llm-rubric-warm-greeting.txt
```

**Run it:**
```bash
npm run eval:original
```

**Pros:**
- Works out of the box
- File references work for assertion validation details

**Cons:**
- Must inline `type` and `provider` in each test case
- Assertion configurations are duplicated
- Not truly modular

---

### 2. Expected approach (`tests/expected.yaml`)

**What doesn't work:** Referencing a file that contains multiple assertions

```yaml
# tests/expected.yaml
- vars: { name: "Alice", time_of_day: "morning" }
  assert:
    - value: file://assertions/not-working/expected/default.yaml

# assertions/not-working/expected/default.yaml
- type: is-json
  value:
    required: ["greeting"]
    type: object
    properties:
      greeting:
        type: string
- type: llm-rubric
  provider: ollama:mistral:7b
  value: |
    The greeting should be:
    1. Warm and personalized - addressing the person by name
    2. Contextually appropriate to the time of day
    3. Professional and helpful
    Grade as PASS if it meets all three criteria, FAIL otherwise.
```

**Run it:**
```bash
npm run eval:expected
```

**Status:** This currently doesn't work properly because file references are only supported for the `value` property.

---

### 3. Ideal approach (`tests/ideal.yaml`)

**What we want:** Full support for nested file references

```yaml
# tests/ideal.yaml
- vars: { name: "Alice", time_of_day: "morning" }
  assert:
    - value: file://assertions/not-working/ideal/default.yaml

# assertions/not-working/ideal/default.yaml
- type: is-json
  value: file://assertions/working/is-valid-json-default.yaml
- type: llm-rubric
  provider: ollama:mistral:7b
  value: file://assertions/working/llm-rubric-warm-greeting.txt
```

**Run it (currently doesn't work):**
```bash
npm run eval:ideal
```

**Benefits:**
- Fully modular assertion definitions
- Assertions are defined once, reused everywhere
- Multi-level file organization
- Easy to maintain and update
- Scalable for large test suites

---

## Use cases

### 1. Shared assertion libraries

Create a centralized library of reusable assertions:

```
assertions/
├── json-schemas/
│   ├── greeting-response.yaml
│   ├── error-response.yaml
│   └── user-profile.yaml
├── llm-rubrics/
│   ├── customer-service.txt
│   ├── technical-accuracy.txt
│   └── tone-and-style.txt
└── edge-cases/
    └── default-validations.yaml
```

Then reference them in test files without duplication.

### 2. Test organization by feature

```
tests/
├── greeting-feature/
│   ├── basic.yaml
│   ├── edge-cases.yaml
│   └── localization.yaml
└── user-profile/
    ├── creation.yaml
    ├── updates.yaml
    └── validation.yaml
```

All tests in a feature can reference the same assertions from `assertions/` directory.

### 3. Assertion versioning

Maintain multiple versions of assertions and reference different ones:

```
assertions/
├── llm-rubrics/
│   ├── warmth-v1.txt
│   ├── warmth-v2.txt
│   └── warmth-latest.txt  # Points to v2
```

---

## Getting started

### Prerequisites

- Node.js 18+
- Promptfoo CLI installed (or use `npm install`)
- Ollama running with `qwen2.5` model (or change provider in `promptfooconfig.yaml`)

### Installation

```bash
npm install
```

### Run tests

```bash
# Original working approach
npm run eval:original

# Expected approach (currently doesn't work)
npm run eval:expected

# Ideal approach (currently doesn't work)
npm run eval:ideal

# Workardound approach
npm run eval:workaround

# View results
npm run view
```

---

## Feature request details

This repository is a demonstration for a Promptfoo feature request:

**Title:** Support external file references for nested assertion properties (e.g., `type`, `provider`, `value`)

**GitHub Issue Link:** https://github.com/promptfoo/promptfoo/issues/7823

---

## Workarounds

Until this feature is implemented, you can:

1. **Inline all assertions** (not modular but works)
2. **Use JavaScript assertions** with inline logic
3. **Create wrapper scripts** that generate test files dynamically
4. **Maintain separate test configurations** for different scenarios

See [workaround](https://github.com/tcorral/prompfoo-issue-loading-external-files-for-nested-assertions/blob/main/tests/workaround.yaml)

---

## Contributing

This repository demonstrates the feature request. If you're interested in:

- **Using this feature**: Comment on the GitHub issue or 👍 react to show interest
- **Implementing this feature**: Check the Promptfoo repository for contribution guidelines
- **Improving this demo**: Feel free to fork and enhance the examples

---

## Resources

- [Promptfoo Documentation](https://www.promptfoo.dev/)
- [Promptfoo GitHub Repository](https://github.com/promptfoo/promptfoo)

---

## Author

Created by [Tomas Corral Casas](https://github.com/tcorral)

## License

MIT
