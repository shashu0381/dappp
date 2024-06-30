
# Welcome to Pseudo Wallet

## Hello Peers

### Pre-requisite
- **Metamask Wallet extension** installed on your browser.

## To get started, follow the steps below:

1. **Open Visual Studio Code** on your local machine or use [Gitpod](https://www.gitpod.io).
2. Inside the project directory, in the terminal type:
   ```bash
   npm i
   ```
3. **Open two additional terminals** in your VS Code.
4. In the second terminal type:
   ```bash
   npx hardhat node
   ```
5. In the third terminal, type:
   ```bash
   npx hardhat run --network localhost scripts/deploy.js
   ```
   **Click on "Open in Browser" if a window pops up.**
6. Back in the first terminal, type:
   ```bash
   npm run dev
   ```
7. Now go to:
   ```bash
   localhost:3000
   ```
8. **Click on "Connect Metamask"** and when the window pops up, select "Use Metamask".
9. Go to Metamask settings, click on **Network** --> **Add a new network**.

### Note: For Gitpod users only; others can skip this step.
1. If you are using [Gitpod](https://www.gitpod.io), go to **Ports** and select port 8545. Copy the URL to your clipboard.
2. In Metamask, add the copied link inside the **RPC URL** field, type the **Chain ID: 31337**, and type "ETH" inside the **Currency** field.

### Note: Localhost users can skip this step.
1. If you are using localhost, go to the second terminal where you ran:
   ```bash
   npx hardhat node
   ```
2. Copy the link similar to this: [http://127.0.0.1:8545/].
3. In Metamask, click on **Settings** --> **Network** --> **Add a new network**.
4. Type the name of your choice under the **Name** field.
5. Paste the copied link under the **RPC URL** field.
6. Type "ETH" inside the **Currency** field and save.
7. Go to **Settings** --> **Advanced** --> **Clear all tab data**.
8. Close the wallet and reload:
   ```bash
   localhost:3000
   ```

12. **Click on the "Deposit" button**, then go to Metamask, select an account or create one, and start depositing and withdrawing amounts.
