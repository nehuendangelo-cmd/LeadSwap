# LeadSwap Dev Setup

## Prerequisites
- Node.js (v18+)
- NPM

## Installation
1.  Install dependencies:
    ```bash
    npm install
    npm install exa-js puppeteer-core dotenv typescript ts-node @types/node --save-dev
    ```

2.  Configure Environment:
    - Copy `.env.example` to `.env`
    - Fill in your `EXA_API_KEY` and `LIGHTPANDA_WS_ENDPOINT`.

## Running the Agent
We have a basic simulation script in `src/index.ts`.

To run it:
```bash
# You might need to compile TS first or use ts-node
npx ts-node src/index.ts
```

## Structure
- `src/lib/exa.ts`: Handles Neural Search via Exa.ai.
- `src/lib/lightpanda.ts`: Handles Browser Automation via Lightpanda.
- `src/index.ts`: The main logic connecting the search results to the browser verification.
