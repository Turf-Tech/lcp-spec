# RFC-XXXX: [Title]

<!-- Replace XXXX with the next available RFC number -->
<!-- Replace [Title] with a concise, descriptive title -->

## Metadata

- **RFC Number**: XXXX
- **Title**: [Concise title]
- **Author(s)**: @github-handle (name), @another-handle (name)
- **Status**: Draft
- **Type**: Standards Track | Informational | Process
- **Created**: YYYY-MM-DD
- **Updated**: YYYY-MM-DD
- **Requires**: [List of RFC dependencies, if any]
- **Replaces**: [RFC number if this supersedes another, or "None"]

## Abstract

<!-- 2-3 sentence summary of the proposal -->

A concise technical summary of the proposed change. This should be understandable by someone familiar with LCP but not necessarily an expert in this specific area.

## Motivation

### Problem Statement

What problem does this RFC solve? Why is the current state insufficient?

### Use Cases

Describe 2-3 concrete use cases that would benefit from this proposal.

**Example Use Case 1: [Title]**
- Scenario: ...
- Current limitation: ...
- Proposed improvement: ...

**Example Use Case 2: [Title]**
- Scenario: ...
- Current limitation: ...
- Proposed improvement: ...

### Goals

What are the explicit goals of this proposal?

- Goal 1
- Goal 2
- Goal 3

### Non-Goals

What is explicitly out of scope for this proposal?

- Non-goal 1
- Non-goal 2

## Specification

### Overview

High-level description of the proposed changes.

### Detailed Design

Provide comprehensive technical details. Include:

#### Data Structures

Define any new data structures with JSON examples:

```json
{
  "new_field": {
    "type": "object",
    "properties": {
      "field_name": {
        "type": "string",
        "description": "Description of field"
      }
    }
  }
}
```

#### Protocol Changes

Describe modifications to existing protocol flows.

**Before**:
```
Agent → Provider: Request
Provider → Agent: Response
```

**After**:
```
Agent → Provider: Enhanced Request
Provider → Agent: Enhanced Response (with new fields)
```

#### Algorithms

Describe any new algorithms or modifications to existing ones.

```
function newAlgorithm(input):
  // Pseudocode or actual implementation
  return output
```

#### Examples

Provide complete examples demonstrating the new functionality.

**Example 1: Basic Usage**
```json
{
  "example": "..."
}
```

**Example 2: Advanced Usage**
```json
{
  "example": "..."
}
```

## Rationale

### Design Decisions

Explain key design decisions and the reasoning behind them.

**Decision 1: [Topic]**
- **Chosen Approach**: ...
- **Reasoning**: ...
- **Alternatives Considered**: ...

**Decision 2: [Topic]**
- **Chosen Approach**: ...
- **Reasoning**: ...

### Alternatives Considered

What other approaches were evaluated? Why were they rejected?

**Alternative 1: [Description]**
- **Pros**: ...
- **Cons**: ...
- **Reason for rejection**: ...

**Alternative 2: [Description]**
- **Pros**: ...
- **Cons**: ...
- **Reason for rejection**: ...

## Backward Compatibility

### Impact Assessment

- [ ] Fully backward compatible (no changes to existing behavior)
- [ ] Backward compatible with opt-in (new features, old behavior preserved)
- [ ] Breaking change (requires migration)

### Migration Path

If this is a breaking change, describe how existing implementations can migrate:

1. Step 1: ...
2. Step 2: ...
3. Step 3: ...

### Deprecation Timeline

If deprecating existing features:

- **Announcement**: Version X.Y.0
- **Deprecation Warning**: Version X.Y+1.0
- **Removal**: Version X+1.0.0

## Security Considerations

### Threat Model

What new threats does this introduce?

**Threat 1: [Description]**
- **Likelihood**: High | Medium | Low
- **Impact**: High | Medium | Low
- **Mitigation**: ...

**Threat 2: [Description]**
- **Likelihood**: High | Medium | Low
- **Impact**: High | Medium | Low
- **Mitigation**: ...

### Attack Vectors

Describe potential attack vectors and how they're mitigated.

### Cryptographic Changes

If this RFC modifies cryptographic mechanisms:
- What primitives are affected?
- Have they been formally verified?
- Are there known vulnerabilities?

### Privacy Implications

How does this affect user/agent privacy?

## Performance Considerations

### Computational Complexity

What is the computational cost of this proposal?

- Time complexity: O(...)
- Space complexity: O(...)
- Network overhead: ...

### Scalability

How does this scale with:
- Number of agents?
- Number of providers?
- Transaction volume?

### Benchmarks

Provide performance benchmarks if available:

| Metric | Current | Proposed | Change |
|--------|---------|----------|--------|
| Latency | 100ms | 95ms | -5% |
| Throughput | 1000 req/s | 1200 req/s | +20% |

## Implementation

### Reference Implementation

- **Status**: Not yet implemented | In progress | Complete
- **Repository**: [Link to implementation]
- **Language**: TypeScript | Python | Rust | Other

### Testing

How should this be tested?

- [ ] Unit tests
- [ ] Integration tests
- [ ] Compliance tests
- [ ] Security tests
- [ ] Performance tests

### Rollout Plan

How should this be deployed?

1. **Phase 1**: Reference implementation
2. **Phase 2**: Community testing
3. **Phase 3**: Production deployment

## Open Questions

List unresolved questions that need community input:

1. **Question 1**: Description?
   - Option A: ...
   - Option B: ...
   - Community input needed on: ...

2. **Question 2**: Description?
   - Seeking feedback on: ...

## Dependencies

### Requires

This RFC depends on:
- RFC-XXXX: [Title]
- External standard: [Name and link]

### Blocks

This RFC blocks:
- RFC-YYYY: [Title] (cannot proceed until this is resolved)

### Related

Related but independent RFCs:
- RFC-ZZZZ: [Title]

## Timeline

### Proposed Schedule

- **Discussion Period**: 2026-MM-DD to 2026-MM-DD (2-6 weeks)
- **Working Group Review**: 2026-MM-DD
- **Core Maintainer Decision**: 2026-MM-DD
- **Implementation**: Q2 2026 (if accepted)
- **Target Release**: vX.Y.0

## References

### Research Papers

1. [Title], Authors, Conference/Journal, Year. [Link]
2. [Title], Authors, Conference/Journal, Year. [Link]

### Prior Art

1. **Protocol/System Name**: How does this relate? [Link]
2. **Protocol/System Name**: What can we learn? [Link]

### Relevant Issues

- Issue #123: [Title]
- Issue #456: [Title]

### External Standards

- RFC 2119: Key words for use in RFCs
- JSON Schema Draft 2020-12
- [Other relevant standards]

## Appendix

### Appendix A: Detailed Examples

<!-- Additional examples that are too lengthy for main specification section -->

### Appendix B: Test Vectors

<!-- Specific test cases for implementation validation -->

```json
{
  "input": {...},
  "expected_output": {...}
}
```

### Appendix C: FAQs

**Q: Common question?**
A: Answer.

**Q: Another question?**
A: Answer.

---

## Change Log

Track significant changes to this RFC during the review process:

- **2026-MM-DD**: Initial draft
- **2026-MM-DD**: Updated based on community feedback (summary of changes)
- **2026-MM-DD**: Working group review incorporated

---

**Instructions for Authors**:

1. Copy this template to `rfcs/XXXX-your-title.md`
2. Replace XXXX with next available number
3. Fill out all sections (remove instructional comments in <!-- -->)
4. Submit as pull request
5. Post to GitHub Discussions for visibility
6. Respond to community feedback
7. Update RFC based on discussion

**For Reviewers**:

Evaluate based on:
- [ ] Problem is clearly defined and significant
- [ ] Solution is technically sound
- [ ] Backward compatibility impact is acceptable
- [ ] Security implications are addressed
- [ ] Implementation is feasible
- [ ] Documentation is clear and complete

See [CONTRIBUTING.md](../CONTRIBUTING.md) for full RFC process.