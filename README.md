# Dyslexia Grand Hub

A platform-agnostic, evidence-based application for individuals with dyslexia, educators, and researchers.

## Overview

The Dyslexia Grand Hub provides:
- **Screening** - Multi-domain dyslexia screening (not a diagnosis)
- **Interventions** - Evidence-based interventions with interactive training exercises
- **Research** - Access to 460 research papers and 335 verified claims
- **Understand Dyslexia** - Comprehensive educational section

## Technology Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Routing:** React Router
- **Storage:** IndexedDB with localStorage fallback
- **Build:** pnpm workspaces

## Architecture

```
dyslexia-hub/
├── packages/
│   ├── core/           # Domain models, repositories, services
│   ├── components/     # Base component library with themes
│   └── web/            # Vite/React web application
├── docs/               # Technical specification (12 documents)
├── package.json        # Root package.json
├── pnpm-workspace.yaml # Workspace configuration
└── tsconfig.base.json  # Base TypeScript configuration
```

## Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (package manager)

Install pnpm if not already installed:
```bash
npm install -g pnpm
```

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

This installs dependencies for all packages in the monorepo.

### 2. Start Development Server

```bash
pnpm dev
```

The application will be available at http://localhost:3000

### 3. Build for Production

```bash
pnpm build
```

Build outputs are in `packages/web/dist/`

## Features

### Screening Module
- Multi-domain assessment (Phonological 35%, RAN 35%, Working Memory 15%, Attention 15%)
- Child and adult screening flows
- IndexedDB storage for offline functionality
- WCAG 2.1 AA accessibility compliance

### Intervention Explorer
- 11 evidence-based interventions with source citations
- Evidence tiers (established, emerging, experimental)
- **Interactive training exercises:**
  - Phonological Awareness Training (3 levels)
  - RAN Training (3 levels)
  - Reading Fluency Training (3 levels)
  - Working Memory Training (3 levels)
- Search and filter functionality

### Research Repository Explorer
- 7 research phases with sample claims
- Confidence ratings and source citations
- DOI links to original papers
- Phase filter and search functionality

### Understand Dyslexia
- What is Dyslexia?
- Causes (Etiology)
- Brain & Neurology
- Developmental Trajectories
- Manifestations
- Theoretical Models

## Accessibility

- WCAG 2.1 AA compliant
- Dyslexia-friendly UI with:
  - High-contrast themes
  - Large text options
  - Keyboard navigation
  - Screen reader support
  - 44px minimum interaction targets

## Platform Targets

The application is designed to be platform-agnostic:
- ✅ **Web** (current implementation)
- 🚧 **Mobile** (planned)
- 🚧 **Desktop** (planned)

## Documentation

Technical specification documents are available as HTML in `docs/`:
- [Documentation Index](docs/index.html) - Complete documentation overview
- [Architecture](docs/architecture.html) - System architecture and design
- [Monorepo Structure](docs/monorepo-structure.html) - Package organization
- [Database Schema](docs/database-schema.html) - Data models and storage
- [API Specification](docs/api-specification.html) - REST API endpoints
- [Component Library](docs/component-library.html) - UI components and themes
- [User Journeys](docs/user-journeys.html) - User flows and experiences
- [Wireframes](docs/wireframes.html) - Screen layouts and design
- [Development Plan](docs/development-plan.html) - Sprint planning and timeline
- [Testing Strategy](docs/testing-strategy.html) - Quality assurance approach
- [Deployment Plan](docs/deployment-plan.html) - Build and deployment strategy
- [Monitoring Plan](docs/monitoring-plan.html) - Performance and error tracking
- [Maintenance Plan](docs/maintenance-plan.html) - Long-term maintenance strategy
- [Technical Specification](docs/technical-specification.html) - High-level overview
- [Training System](docs/training-system.html) - Interactive training exercises

## License

See the main repository license.

## Support

For issues or questions, please refer to the main repository documentation.
