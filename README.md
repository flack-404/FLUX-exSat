# ⚡ **Flux – AI-Powered Digital Payments on exSat**

## 🚀 **Introduction**

**Flux** is a next-generation **AI-powered decentralized payments ecosystem** built on the **exSat Network**. It enables fast, low-cost, and automated digital transactions while optimizing idle liquidity through smart AI agents. Designed for seamless automation and full user control, Flux is built for the future of programmable payments on Bitcoin.

## 🎥 **See Flux in Action**

[![Flux Demo](https://img.youtube.com/vi/geo63FgG0A4/0.jpg)](https://youtu.be/k2Z5PnQnnpM)

---

## ✨ **Core Features**

* 🔹 **Instant Transfers** – Peer-to-peer transfers with near-zero fees and instant confirmation.
* 🤖 **AI-Powered Recurrent Payments** – Automates salaries, subscriptions, and invoicing with smart scheduling.
* 🧠 **AI-Driven Liquidity Optimization** – Earn passive income on locked capital while waiting for payouts.
* 🔒 **Smart Contract Automation** – Decentralized and non-custodial transaction flow with total user control.

---

## 🏗 **Architecture Overview**

Flux is powered by **three tightly integrated components**:

1. **Web App (Flux)** – UI dashboard to manage payments, schedules, and earnings.
2. **AI Agent** – Optimizes fund deployment and liquidity strategies in real-time.
3. **Webhook Server** – Listens to on-chain events and keeps the ecosystem in sync.

---

## ⚡ **Setup Guide**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/flack-404/FLUX-exSat
```

### 2️⃣ Deploy Smart Contracts on exSat

* Deploy both `Payroll` and `Liquidity` contracts from `Flux/Contracts` folder on the **exSat Testnet**.
* Copy the deployed contract addresses.

### 3️⃣ Configure Environment Variables

* Add the **Payroll Contract Address** to:

  * `agent/.env`
  * `Flux/.env`
* Add the **Payroll ABI** to:

  * `Flux/lib/abi.ts`
* Add the **Liquidity Contract Address and ABI** to:

  * `Flux/lib/liquidityContract.ts`

---

## 🛠 **Installation & Running Services**

### 3️⃣ Start Webhook Server

```bash
cd webhook
npm install
node webhookServer.js
```

* Paste the **Webhook URL** into `agent/.env`

### 4️⃣ Start AI Agent

```bash
cd agent
npm install
```

* Update `.env` from `.env.example` and include the Webhook URL
* Run the agent:

```bash
npx ts-node index.ts
```

### 5️⃣ Start Flux Web Application

```bash
cd Flux
npm install
```

* Update `.env` with required variables
* Launch the frontend:

```bash
npm run dev
```

Your Flux dashboard should now be running locally 🎉

---

## 🔑 **Smart Contracts on exSat**

| Contract               | Address                                      |
| ---------------------- | -------------------------------------------- |
| **Payroll Contract**   | `0x356c6D23756E8b574BEf278806b2eE56b426ACC0` |
| **Liquidity Contract** | `0xACC327268Ff297Baf0BAf353Dfe7Be9A29a929Bb` |

---

## 🌐 **Connect With Us**

* 🐦 Twitter: [@FLACKK\_](https://x.com/FLACKK_)
* 📢 Telegram: [@kaustubh\_1610](https://t.me/kaustubh_1610)

---

Built with 💡 by innovators building the future of Bitcoin-native automation.
