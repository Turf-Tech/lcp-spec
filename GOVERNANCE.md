# LCP Governance

This document defines the governance structure for the Liquid Context Protocol (LCP) specification and its ecosystem.

## Table of Contents

- [Principles](#principles)
- [Roles](#roles)
- [Working Groups](#working-groups)
- [Decision-Making Process](#decision-making-process)
- [RFC Process](#rfc-process)
- [Versioning and Releases](#versioning-and-releases)
- [Conflict Resolution](#conflict-resolution)
- [Amendments](#amendments)

## Principles

LCP governance is guided by these core principles:

1. **Open Participation**: Anyone can contribute regardless of affiliation
2. **Technical Merit**: Decisions based on technical quality, not politics
3. **Transparency**: All discussions and decisions are public
4. **Consensus-Seeking**: Aim for broad agreement, not simple majority
5. **Decentralization**: No single entity controls the protocol
6. **Rough Consensus, Running Code**: Prioritize working implementations over theoretical perfection
7. **Permissionless Innovation**: Extensions don't require central approval

## Roles

### Contributors

**Definition**: Anyone who contributes to the project (code, docs, issues, discussions)

**Responsibilities**:
- Follow the Code of Conduct
- Adhere to contribution guidelines
- Engage constructively in discussions

**Rights**:
- Submit issues and pull requests
- Participate in discussions
- Propose RFCs

**How to Become One**: Submit your first contribution

### Committers

**Definition**: Contributors with write access to the repository, earned through sustained quality contributions

**Responsibilities**:
- Review pull requests
- Triage issues
- Maintain code quality
- Mentor new contributors
- Uphold Code of Conduct

**Rights**:
- Merge pull requests (after approval)
- Label and close issues
- Participate in committer discussions

**How to Become One**:
- 6+ months of consistent contributions
- 10+ merged pull requests OR 3+ significant RFCs
- Demonstrated technical judgment
- Nomination by existing committer
- Approval by 2/3 of core maintainers

### Core Maintainers

**Definition**: Long-term committers who guide the protocol's direction and make final decisions on contentious issues

**Current Core Maintainers**:
- @turf_network (Founding Maintainer)
- [Additional maintainers to be appointed as project matures]

**Responsibilities**:
- Strategic direction and roadmap
- RFC approval/rejection
- Release management
- Security incident response
- Maintainer appointments
- Governance amendments
- Conflict resolution
- Community health

**Rights**:
- Final decision on RFCs
- Veto power (used sparingly)
- Committer appointment
- Access to all project resources

**How to Become One**:
- 2+ years as committer
- Deep understanding of protocol architecture
- Demonstrated leadership in community
- Nomination by existing core maintainer
- Unanimous approval by existing core maintainers

**Term**: Indefinite, but may step down voluntarily or be removed for cause

### Emeritus Maintainers

Former core maintainers who have stepped down but may be consulted on major decisions. Recognized in CONTRIBUTORS.md with emeritus status.

### Working Group Leads

Appointed to lead specific working groups (see below). Selected by core maintainers based on expertise and commitment.

## Working Groups

Working groups focus on specific aspects of the protocol. Each has a lead and meets regularly.

### Core Protocol Working Group

**Focus**: Core specification (discovery, negotiation, verification, settlement)

**Lead**: TBD

**Meetings**: Bi-weekly

**Responsibilities**:
- Review protocol RFCs
- Ensure spec clarity and consistency
- Coordinate cross-cutting changes
- Maintain core documentation

### Security Working Group

**Focus**: Cryptography, attack mitigation, vulnerability management

**Lead**: TBD

**Meetings**: Monthly + ad-hoc for incidents

**Responsibilities**:
- Security reviews of RFCs
- Vulnerability disclosure process
- Security audit coordination
- Threat modeling
- Incident response

### Implementations Working Group

**Focus**: Reference implementations, SDKs, interoperability

**Lead**: TBD

**Meetings**: Monthly

**Responsibilities**:
- Reference implementation development
- SDK coordination across languages
- Compliance test suite
- Implementation guides

### Extensions Working Group

**Focus**: Domain-specific extensions, capability types, integrations

**Lead**: TBD

**Meetings**: Monthly

**Responsibilities**:
- Review extension proposals
- Maintain extension registry
- Cross-protocol integration (MCP, A2A, etc.)
- Domain-specific use cases

### Community Working Group

**Focus**: Documentation, outreach, onboarding

**Lead**: TBD

**Meetings**: Monthly

**Responsibilities**:
- Documentation quality
- Tutorial development
- Community events
- New contributor onboarding
- Social media and communications

## Decision-Making Process

### Types of Decisions

#### 1. Minor Changes (No RFC Required)

**Examples**: Typo fixes, documentation clarifications, example improvements

**Process**:
- Submit pull request
- Get 1 committer approval
- Merge

**Timeline**: 1-3 days

#### 2. Moderate Changes (RFC Recommended)

**Examples**: New optional fields, clarifications that could affect implementations, significant documentation restructuring

**Process**:
- Submit pull request OR RFC
- Discussion period (1 week minimum)
- Committer review
- Get 1 core maintainer approval
- Merge

**Timeline**: 1-2 weeks

#### 3. Major Changes (RFC Required)

**Examples**: Breaking changes, new protocol phases, new required fields, cryptographic algorithm changes

**Process**:
- Submit RFC (see RFC Process below)
- Community discussion (2-6 weeks)
- Working group review
- Core maintainer vote (2/3 majority required)
- Implementation period
- Merge into spec

**Timeline**: 4-12 weeks

#### 4. Governance Changes

**Examples**: Changes to this document, Code of Conduct, license changes, maintainer appointments

**Process**:
- Proposal via RFC
- Extended discussion (4-8 weeks)
- Core maintainer vote (unanimous for governance, 2/3 for CoC)
- Merge

**Timeline**: 6-12 weeks

### Consensus vs. Voting

**Preferred**: Rough consensus (broad agreement, objections addressed)

**Fallback**: Voting when consensus can't be reached

**Voting Thresholds**:
- **Simple Majority (50% + 1)**: Committer appointments, working group decisions
- **Supermajority (2/3)**: Major RFCs, core maintainer appointments
- **Unanimous**: Governance changes, emeritus maintainer removal

**Who Votes**:
- **Minor/Moderate**: Committers
- **Major/Governance**: Core maintainers
- **Community Input**: All contributors (non-binding but strongly considered)

## RFC Process

RFCs (Request for Comments) are the primary mechanism for proposing significant changes to LCP.

### RFC Lifecycle

```
Draft → Under Review → Accepted/Rejected → Implemented
                    ↓
                 Withdrawn
```

### Detailed RFC Process

1. **Drafting** (Author)
   - Use RFC template in `rfcs/0001-template.md`
   - Assign next available number
   - Status: "Draft"

2. **Submission** (Author)
   - Submit as pull request to `rfcs/` directory
   - Post to GitHub Discussions for visibility
   - Announce in community channels

3. **Discussion** (Community, 2-6 weeks)
   - Community provides feedback via PR comments
   - Author responds and updates RFC
   - Working groups review if applicable
   - Minimum 2 weeks, extended if needed

4. **Review** (Working Group + Core Maintainers)
   - Relevant working group reviews and provides recommendation
   - Core maintainers review
   - May request changes, clarifications, or implementations

5. **Decision** (Core Maintainers)
   - **Accept**: 2/3 core maintainer approval
   - **Reject**: Doesn't meet criteria or has unresolved issues
   - **Defer**: Needs more work or wrong timing
   - **Withdraw**: Author pulls RFC

6. **Implementation** (Community/Author)
   - Accepted RFCs are open for implementation
   - Implementation may be in reference code, docs, or both
   - Status changes to "Implemented" when merged

### RFC Review Criteria

Core maintainers evaluate based on:

- **Problem Clarity**: Is the problem well-defined and significant?
- **Solution Quality**: Is the proposed solution technically sound?
- **Backward Compatibility**: What's the impact on existing implementations?
- **Security**: Are there security implications or mitigations?
- **Scope**: Is it appropriately scoped (not too broad/narrow)?
- **Community Support**: Is there broad community buy-in?
- **Implementation Feasibility**: Can it realistically be implemented?

### Fast-Track RFCs

For urgent security fixes or critical bugs:
- Minimum 3-day discussion period
- Requires unanimous core maintainer approval
- Must be clearly marked as fast-track with justification

## Versioning and Releases

### Semantic Versioning

LCP follows [Semantic Versioning 2.0.0](https://semver.org/):

- **Major (X.0.0)**: Breaking changes (incompatible with previous version)
- **Minor (0.X.0)**: New features, backward-compatible
- **Patch (0.0.X)**: Bug fixes, clarifications, backward-compatible

**Current Version**: 0.1.0 (Draft)

### Release Process

1. **Version Planning** (Core Maintainers)
   - Determine target features for next version
   - Create milestone on GitHub
   - Communicate timeline to community

2. **Development Period**
   - RFCs proposed, discussed, accepted
   - Implementations developed
   - Tests created

3. **Release Candidate** (RC)
   - Code freeze (no new features)
   - Testing period (2-4 weeks)
   - Bug fixes only
   - Community testing encouraged

4. **Final Release**
   - All RC bugs resolved
   - Documentation updated
   - CHANGELOG.md updated
   - Git tag created
   - Announcement published

### Release Schedule

- **Major Releases**: Annual or when sufficient breaking changes accumulated
- **Minor Releases**: Quarterly or when significant features are ready
- **Patch Releases**: As needed for bug fixes

**Exception**: During pre-1.0 phase, more frequent breaking changes allowed

## Conflict Resolution

### Technical Disagreements

1. **Discussion**: Attempt to reach consensus through discussion
2. **Working Group Review**: Escalate to relevant working group
3. **Core Maintainer Decision**: Final decision by core maintainers (2/3 vote)
4. **Document Rationale**: Decision rationale published for transparency

### Interpersonal Conflicts

1. **Direct Resolution**: Encourage parties to resolve directly
2. **Mediation**: Core maintainer mediates if needed
3. **Code of Conduct Process**: Follow CoC enforcement if violation occurred

### Deadlocks

If core maintainers are deadlocked (equal votes):
- Extended discussion period (2 weeks)
- Seek compromise solution
- If still deadlocked, defer decision until situation evolves

## Amendments

This governance document may be amended through:

1. **Proposal**: Submit RFC with proposed changes
2. **Discussion**: Minimum 4-week community discussion
3. **Vote**: Unanimous core maintainer approval required
4. **Implementation**: Update document, announce changes

**Exception**: Typos and formatting fixes don't require full RFC process (PR with 1 core maintainer approval sufficient)

## Transparency

### Public Records

All of the following are public:
- GitHub issues, PRs, discussions
- RFC documents and comments
- Working group meeting notes
- Maintainer decisions and rationale
- Voting results

### Private Matters

Only these may be private:
- Security vulnerabilities (until patched)
- Code of Conduct reports and investigations
- Personnel matters (maintainer appointments/removals)
- Legal issues

Private matters are disclosed to the community as appropriate once resolved.

## Recognition

### Contributor Recognition

- Listed in CONTRIBUTORS.md
- Mentioned in release notes for significant contributions
- Special recognition in annual reviews
- Conference speaking opportunities (when available)

### Maintainer Tenure

- Core maintainers recognized for service upon stepping down
- Emeritus status conferred
- Option to remain as advisor

## Contact

**General Questions**: Open a GitHub Discussion

**Governance Questions**: Email maintainers@lcp.org (if available)

**Core Maintainers**:
- @turf_network

---

**Version**: 1.0
**Adopted**: 2026-01-29
**Last Amended**: 2026-01-29

This governance model is designed to scale as LCP grows from early-stage protocol to mature ecosystem standard.
