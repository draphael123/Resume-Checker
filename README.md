# Resume Tracker

A modern web application for matching team member resumes to specific roles in clinical operations. Built with Next.js 14 and designed for deployment on Vercel.

## Features

- **Resume Parsing**: Supports PDF, DOC, DOCX, and TXT file formats
- **Role Matching**: Intelligently matches resumes to four role categories:
  - Customer Service
  - Medical Assistants
  - NPs (Nurse Practitioners)
  - RNs (Registered Nurses)
- **Comparison Tool**: Compare multiple team members side-by-side for any role
- **Detailed Analytics**: View match scores, key qualifications, and detailed breakdowns
- **Beautiful UI**: Modern, responsive design built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and import your repository

3. Vercel will automatically detect Next.js and configure the build settings

4. Deploy!

Alternatively, you can use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## How It Works

1. **Upload**: Upload team member resumes with optional name entry
2. **Analysis**: The system extracts key information including:
   - Skills and competencies
   - Work experience
   - Education credentials
   - Certifications and licenses
3. **Matching**: Each resume is scored against all four role categories based on:
   - Relevant skills (30-35% weight)
   - Work experience (30-40% weight)
   - Education (15-25% weight)
   - Certifications (10-15% weight)
4. **Comparison**: View and compare all team members for any selected role

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Parsing**: pdf-parse
- **DOCX Parsing**: mammoth
- **Deployment**: Vercel

## File Structure

```
├── app/
│   ├── api/analyze/route.ts    # API endpoint for resume analysis
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── components/
│   ├── ResumeUpload.tsx         # File upload component
│   ├── ResultsDisplay.tsx       # Individual result display
│   └── ComparisonTable.tsx      # Team comparison table
├── lib/
│   ├── resumeParser.ts          # Resume parsing logic
│   └── roleMatcher.ts           # Role matching algorithm
└── package.json
```

## Customization

You can customize the matching algorithm by editing `lib/roleMatcher.ts`:
- Add/remove keywords for each role
- Adjust scoring weights
- Modify match thresholds

## License

MIT

