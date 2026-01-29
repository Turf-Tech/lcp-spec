# LCP Branding Guidelines

This document defines the visual identity and branding guidelines for the Liquid Context Protocol.

## 🎨 Color Palette

### Primary Colors

```
Indigo (Primary)    #6366f1  rgb(99, 102, 241)
Purple (Accent)     #8b5cf6  rgb(139, 92, 246)
Cyan (Highlight)    #06b6d4  rgb(6, 182, 212)
```

### Secondary Colors

```
Slate (Dark)        #1e293b  rgb(30, 41, 59)
Gray (Medium)       #64748b  rgb(100, 116, 139)
Zinc (Light)        #f4f4f5  rgb(244, 244, 245)
White               #ffffff  rgb(255, 255, 255)
```

### Semantic Colors

```
Success (Green)     #10b981  rgb(16, 185, 129)
Warning (Yellow)    #f59e0b  rgb(245, 158, 11)
Error (Red)         #ef4444  rgb(239, 68, 68)
Info (Blue)         #3b82f6  rgb(59, 130, 246)
```

## 🖼️ Logo

### Logo Concept

The LCP logo represents:
- **Flow**: Data flowing between agents and providers
- **Connection**: Trustless coordination
- **Network**: Decentralized architecture

### Logo Variations

1. **Full Logo** - Text + Icon
   - Use: Primary branding, website headers, presentations
   - Minimum width: 200px
   - File: `logos/lcp-logo-full.svg`

2. **Icon Only** - Just the symbol
   - Use: Social media avatars, favicons, small spaces
   - Minimum size: 32x32px
   - File: `logos/lcp-icon.svg`

3. **Wordmark** - Text only
   - Use: Document headers, email signatures
   - File: `logos/lcp-wordmark.svg`

### Logo Colors

- **Primary**: Indigo (#6366f1) on white background
- **Reverse**: White on indigo background
- **Monochrome**: Black (#1e293b) or white depending on background

### Clear Space

Maintain minimum clear space around logo equal to the height of the "L" in LCP.

### Don'ts

- ❌ Don't stretch or distort the logo
- ❌ Don't change logo colors outside approved palette
- ❌ Don't add effects (shadows, gradients, outlines)
- ❌ Don't place on busy backgrounds
- ❌ Don't use low-resolution versions

## 🔤 Typography

### Headings

**Font**: Inter (Sans-serif)
- **H1**: 48px, Bold (700)
- **H2**: 36px, Semi-bold (600)
- **H3**: 28px, Semi-bold (600)
- **H4**: 20px, Medium (500)

### Body Text

**Font**: Inter (Sans-serif)
- **Regular**: 16px, Regular (400)
- **Small**: 14px, Regular (400)
- **Caption**: 12px, Regular (400)

### Code/Monospace

**Font**: JetBrains Mono or Fira Code
- **Code blocks**: 14px, Regular (400)
- **Inline code**: 14px, Medium (500)

## 📐 Spacing System

Use multiples of 8px for consistent spacing:

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

## 🎯 Icons

### Icon Style

- **Line-based** with 2px stroke width
- **Rounded corners** (4px radius)
- **Consistent sizing**: 24x24px base
- **Color**: Use primary color palette

### Icon Usage

| Concept | Icon | Emoji Fallback |
|---------|------|----------------|
| Discovery | 🔍 | 🔭 |
| Negotiation | 🤝 | 💬 |
| Verification | ✅ | 🔐 |
| Settlement | 💰 | ⚡ |
| Security | 🛡️ | 🔒 |
| Protocol | 📋 | 📡 |
| Network | 🌐 | 🕸️ |
| Agent | 🤖 | 🦾 |
| Provider | 🏪 | 📦 |
| Reputation | ⭐ | 🏆 |

## 📱 Social Media

### Profile Images

- **Twitter/X**: Use icon-only logo, 400x400px
- **GitHub**: Use icon-only logo, 500x500px
- **LinkedIn**: Use full logo, 300x300px
- **Discord**: Use icon-only logo, 512x512px

### Cover Images

- **Twitter/X Header**: 1500x500px - Gradient background with wordmark
- **GitHub Social Preview**: 1280x640px - Full logo centered
- **LinkedIn Banner**: 1584x396px - Full logo with tagline

### Hashtags

- Primary: `#LiquidContextProtocol` `#LCP`
- Secondary: `#AIAgents` `#TrustlessAI` `#Web3AI`

## 📊 Presentation Templates

### Slide Deck Colors

- **Background**: White or Zinc Light (#f4f4f5)
- **Headers**: Slate Dark (#1e293b)
- **Accent elements**: Indigo (#6366f1)
- **Code blocks**: Slate Dark background with white text

### Diagrams

- **Architecture diagrams**: Use color palette consistently
- **Flow diagrams**: Indigo for agents, Purple for providers, Cyan for data
- **Arrows**: Use consistent 2px stroke
- **Labels**: 14px Inter Medium

## 🌐 Web Design

### Buttons

**Primary Button**
- Background: Indigo (#6366f1)
- Text: White
- Hover: Darker indigo (#4f46e5)
- Padding: 12px 24px
- Border radius: 8px

**Secondary Button**
- Background: Transparent
- Border: 2px Indigo
- Text: Indigo
- Hover: Light indigo background

### Cards

- Background: White
- Border: 1px Gray (#e5e7eb)
- Border radius: 12px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Padding: 24px

### Code Blocks

- Background: Slate Dark (#1e293b)
- Text: White
- Border radius: 8px
- Padding: 16px
- Font: JetBrains Mono 14px

## 📄 Document Templates

### Technical Documentation

- **Header**: Full logo (left) + version badge (right)
- **Section headers**: Indigo color
- **Code blocks**: Consistent styling as above
- **Callouts**: Colored left border (4px) with matching background tint

### RFC Documents

- **Status badge**: Color-coded (Draft: Orange, Accepted: Green, Rejected: Red)
- **Metadata table**: Light gray background
- **Section numbers**: Indigo color

### Examples

- **File naming**: `example-{name}.md`
- **Code highlighting**: Language-appropriate syntax highlighting
- **Diagrams**: Mermaid or ASCII art with consistent styling

## 🎥 Video/Animation

### Intro Animation

- Duration: 3-5 seconds
- Logo fade in with subtle movement
- Color transition from Indigo to Cyan
- Tagline appears: "Autonomous AI Context Orchestration"

### Demo Videos

- **Resolution**: 1920x1080 (1080p)
- **Aspect ratio**: 16:9
- **Intro**: Show LCP logo for 2 seconds
- **Outro**: Show logo + website + GitHub link

## 📦 Asset Files

### Directory Structure

```
assets/
├── logos/
│   ├── lcp-logo-full.svg          # Full logo
│   ├── lcp-logo-full.png          # Full logo (raster)
│   ├── lcp-icon.svg                # Icon only
│   ├── lcp-icon.png                # Icon only (raster)
│   └── lcp-wordmark.svg            # Text only
├── icons/
│   ├── discovery.svg
│   ├── negotiation.svg
│   ├── verification.svg
│   └── settlement.svg
├── diagrams/
│   ├── architecture.svg
│   ├── flow-discovery.svg
│   ├── flow-negotiation.svg
│   └── flow-settlement.svg
└── social/
    ├── twitter-header.png
    ├── github-social.png
    └── og-image.png
```

### File Formats

- **Vector**: SVG (preferred for logos, icons, diagrams)
- **Raster**: PNG (transparent background, high DPI)
- **Photos**: JPG (compressed for web)

## 🔄 Updates

This branding guide may be updated as the project evolves. Current version: 1.0

**Last updated**: 2026-01-29

## 📧 Contact

Questions about branding or need custom assets?
- Open an issue: [GitHub Issues](https://github.com/turf_network/lcp-spec/issues)
- Email: branding@lcp.org (if available)

---

## 🎨 Quick Reference

**Primary Color**: `#6366f1` (Indigo)
**Font**: Inter
**Logo**: Always maintain aspect ratio and clear space
**Style**: Modern, clean, technical, trustworthy

**When in doubt**: Keep it simple and consistent with these guidelines.
