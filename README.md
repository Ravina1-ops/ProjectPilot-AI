# 🚀 ProjectPilot AI: AI-Powered Machine Learning Project Blueprint Generator

ProjectPilot AI is an advanced, production-grade web application designed to help developers, researchers, and students instantly architect machine learning systems. By converting a simple text-based project idea into a comprehensive technical blueprint, it reduces development scoping time by up to 80%.

## 🔗 Live Deployments
* **Frontend Application:** [https://project-pilot-fzxineg4u-ravina1versha2kritika3mansi4.vercel.app?_vercel_share=uBr7Vnry3QTt7FfzNW68dtug2PYANy3R] *(Hosted on Vercel)*
* **Backend API Gateway:** `https://projectpilot-ai.onrender.com` *(Hosted on Render)*

---

## 🏗️ System Architecture & Workflow

The platform leverages a highly performant, decoupled microservices architecture ensuring optimal speed, clean separation of concerns, and robust security management:

1. **Client Interface (Frontend):** A fully responsive, modern dark-themed UI that captures the user's ML concept and securely transmits it via asynchronous fetch streams.
2. **API Controller Layer (Backend):** A high-performance Python FastAPI engine that intercepts requests, orchestrates pipeline parameters, and tightly masks environment secrets.
3. **Core AI Inference Layer:** Upstream connection to Google's Gemini LLM infrastructure via direct backend integration for real-time response generation.

---

## 🛠️ Tech Stack & Infrastructure

### Frontend
* **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Features:** Asynchronous Dynamic Fetch Pipeline, Markdown Engine Parsing
* **Hosting Platform:** Vercel

### Backend
* **Core Runtime:** Python 3.10.12
* **Framework:** FastAPI (Asynchronous Server Gateway Interface)
* **API Integration:** Google Generative AI SDK (Gemini Pipeline Execution)
* **Hosting Platform:** Render.com (Linux-Based Container Virtualization)

---

## 🔒 Security Best Practices
* **Zero Client-Side Exposure:** Unlike standard basic tier setups, the `GEMINI_API_KEY` is strictly managed server-side inside secure environment configurations on Render.
* **CORS Compliant Routing:** Engineered custom Cross-Origin Resource Sharing protocols to authorize seamless backend hits exclusively via validated client layers.

---

## 👨‍💻 Installation & Local Setup

### Backend Local Initialization
1. Navigate to the backend directory:
   ```bash
   cd Backend
   pip install -r requirements.txt
   GEMINI_API_KEY=your_actual_api_key_here
   uvicorn main:app --reload