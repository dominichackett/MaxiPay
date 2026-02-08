# MaxiPay

Maxi Pay is a comprehensive blockchain-based mobile payment system designed specifically for maxi taxis and minibus transit services operating worldwide. This innovative platform addresses the critical need for cashless payment solutions in a $250 billion global industry that moves hundreds of millions of passengers daily.  Its a submission for Ethglobal Hack Money Hackathon 2026.  

## Tech Stack
Maxi Pay is built with React Native and Expo Go for cross-platform mobile development, ensuring a seamless experience on both iOS and Android devices.

The app leverages the Yellow SDK and Nitrolite protocol to enable gas-free, instant payments —combining Web2 speed with Web3 security for lightning-fast blockchain transactions.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Expo CLI (`npm install -g expo-cli` or `yarn global add expo-cli`)

### Cloning the Repository

To get started, clone the repository to your local machine:

```bash
git clone <repository-url>
cd MaxiPay
```
*(Replace `<repository-url>` with the actual URL of your Git repository)*

### Installation

Once cloned, navigate into the project directory and install the dependencies:

```bash
npm install
# or
yarn install
```

### Running the Application

To run the application in development mode:

```bash
npx expo start -c
```

This command will start the Expo development server. You can then use the Expo Go app on your mobile device (iOS or Android) to scan the QR code and open the app, or choose to run it in a web browser or simulator. The `-c` flag clears the Metro bundler cache, which can be useful for ensuring a fresh build.
