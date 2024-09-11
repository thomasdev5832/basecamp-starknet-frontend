# Starknet Basecamp - Frontend

This frontend project is part of homework #3 of Starknet Basecamp Brazil. The goal is to provide a simple interface to interact with Starknet smart contracts, including features such as checking balances, querying total supply, minting tokens, and transferring tokens.

**[basecamp-starknet.vercel.app](https://basecamp-starknet.vercel.app/)**

### Prerequisites

Before you begin, make sure you meet the following requirements:

- **Node.js (version 14 or later)** and **npm** installed. You can download them [here](https://nodejs.org/en/download/).
- Basic understanding of **Starknet Foundry** (if you plan to deploy an instance).
- Basic knowledge of **JavaScript** and **React/Next**.

### Getting Started

#### Next.js Application

The `web` directory contains a **Next.js** app based on the [starknet-react](https://github.com/apibara/starknet-react) template. Follow these steps to run the project locally:

1. **Install the dependencies**:
    ```bash
    npm install
    # or
    yarn
    # or
    pnpm install
    # or
    bun install
    ```
2. Ensure that the libraries are updated to the latest versions.

3. **Start the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Features

- ✅ check balance.
- ✅ total token supply.
- ✅ mint new tokens.
- ✅ transfer tokens between accounts.

These functionalities make it easy to interact with the smart contract through a simple and intuitive interface.

