<div align="center">
  <img src="https://raw.githubusercontent.com/Prateek-glitch/mail-guardian/main/logo-mail.png" alt="Mail-Guardian Logo" width="180" />
  <h1 style="font-size: 4em; font-weight: bold; margin-bottom: 0;">Mail-Guardian</h1>
  <p style="font-size: 1.5em; margin-top: 0;">
    <i>Secure Email, Empower Trust, Defend Always</i>
  </p>

  <p>
    <a href="https://github.com/Prateek-glitch/mail-guardian/stargazers"><img src="https://img.shields.io/github/stars/Prateek-glitch/mail-guardian?style=for-the-badge&logo=github&color=FFC107" alt="Stars"></a>
    <a href="https://github.com/Prateek-glitch/mail-guardian/network/members"><img src="https://img.shields.io/github/forks/Prateek-glitch/mail-guardian?style=for-the-badge&logo=github&color=4CAF50" alt="Forks"></a>
    <a href="https://github.com/Prateek-glitch/mail-guardian/issues"><img src="https://img.shields.io/github/issues/Prateek-glitch/mail-guardian?style=for-the-badge&logo=github&color=F44336" alt="Issues"></a>
    <a href="https://github.com/Prateek-glitch/mail-guardian/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Prateek-glitch/mail-guardian?style=for-the-badge&logo=github&color=2196F3" alt="License"></a>
  </p>
  
  <p>
    An intelligent, developer-centric platform for enhancing email security, detecting threats, and ensuring data integrity with the power of AI.
  </p>
</div>

---

## 🛡️ Why Mail-Guardian?

**Mail-Guardian** is a modular, developer-centric platform designed to fortify email security within any application. It provides a robust suite of tools for analyzing emails, detecting threats, and managing user authentication, all wrapped in a sleek, component-driven architecture. Whether you're building a new email client or adding security features to an existing application, Mail-Guardian provides the foundation you need.

---

## ✨ Key Features

-   **🧩 Component-Driven Architecture:** Build consistent, maintainable, and scalable UIs with a rich set of reusable components.
-   **🔐 Advanced Threat Detection:** Leverage AI to fetch, analyze, and categorize emails, identifying phishing, malware, and other security risks.
-   **🔑 Secure Authentication:** Integrated Google OAuth2 for secure login, session management, and protected routes.
-   **🎨 Consistent & Modern Styling:** Utilizes **Tailwind CSS** with a custom theme to ensure a polished, responsive, and cohesive user interface.
-   **🚀 Seamless Deployment:** Pre-configured for efficient builds and deployment with **Next.js** and **Netlify**.
-   **⚙️ Rich UI Toolkit:** Accelerate development with accessible components like buttons, modals, tables, and more.

---

## 📸 UI Previews

| Dashboard                                                                   | Scan History                                                                 | Detailed Analysis                                                                 |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ![Dashboard](https://github.com/Prateek-glitch/mail-guardian/blob/main/mailG-home.png) | ![History](https://github.com/Prateek-glitch/mail-guardian/blob/main/mailG-history.png) | ![Details](https://github.com/Prateek-glitch/mail-guardian/blob/main/mailG-details.png) |

---

## 🛠️ Tech Stack

| Category         | Technologies                                                                                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core** | ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/-React-20232A?logo=react&logoColor=61DAFB)        |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwindcss) ![PostCSS](https://img.shields.io/badge/-PostCSS-DD3A0A?logo=postcss&logoColor=white)                                                                                                    |
| **Forms & Schema** | ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-EC5990?logo=react-hook-form&logoColor=white) ![Zod](https://img.shields.io/badge/-Zod-3E67B1?logo=zod&logoColor=white)                                                                                   |
| **Tooling** | ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white) ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white)                                                                                                                |
| **LLM** | ![Google Gemini](https://img.shields.io/badge/-Gemini-4285F4?logo=google&logoColor=white)                                                                                                                                                                            |

---

## ⚙️ Getting Started

### Prerequisites

-   **Node.js & npm:** [Download & Install](https://nodejs.org/)
-   **Git:** [Download & Install](https://git-scm.com/)

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Prateek-glitch/mail-guardian.git](https://github.com/Prateek-glitch/mail-guardian.git)
    cd mail-guardian
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Google OAuth and Gemini API credentials:
    ```env
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

---

## 🚀 Usage

To run the development server:

```bash
npm run dev
