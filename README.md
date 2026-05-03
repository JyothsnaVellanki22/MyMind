# My Mind — AI-Powered Journaling & Reflection

My Mind is a private, premium journaling space designed for deep reflection and goal tracking. Built with React and FastAPI, it leverages the Gemini AI model to analyze your patterns, provide empathy-driven coaching, and keep you motivated on your personal growth journey.

## Key Features

- **AI Reflection Coach**: An empathetic AI that remembers your past entries and helps you dive deeper into your thoughts.
- **Goal Analytics**: Visualize your mental health patterns, mood distribution, and vision progress with interactive charts.
- **Visual History**: Browse your thoughts through a sleek grid or a calendar-based retrospective.
- **Intentions Tracker**: Integrated task management to turn your reflections into actionable goals.
- **Premium UI/UX**: A motion-centric design featuring dark mode, glassmorphism, and responsive interactions.
- **Private & Secure**: Built with security in mind, including JWT authentication and secure CORS policies.

## Tech Stack

| Frontend | Backend | AI & Database |
| :--- | :--- | :--- |
| React 19 + Vite | FastAPI | Google Gemini 2.0 Flash |
| Tailwind CSS | SQLAlchemy | PostgreSQL / SQLite |
| Framer Motion | Pydantic | Alembic (Migrations) |
| Recharts | JWT Auth | Date-fns |

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.9+
- Gemini API Key (Google AI Studio)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/my-mind.git
   cd my-mind
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **AI Service Setup**
   ```bash
   cd ai_api
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8001
   ```

## Environment Variables

Create a `.env` file in the `api` and `ai_api` directories:

**api/.env**
```env
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=your-super-secret-key
```

**ai_api/.env**
```env
GEMINI_API_KEY=your-gemini-key
```

## Project Structure

```
frontend/
  src/
    components/   # Reusable UI elements
    pages/        # Screen-level components
    services/     # API & logic centralization
    hooks/        # Custom React hooks
api/              # FastAPI Main Backend
ai_api/           # Gemini AI Microservice
```

## Future Roadmap

- [ ] Native iOS/Android apps via React Native.
- [ ] End-to-end encryption for entry content.
- [ ] Voice-to-text journaling with whisper-level accuracy.
- [ ] Weekly PDF reflection reports.
- [ ] Social sharing for "public" vision milestones.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

*Designed for thinkers everywhere.*
