import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="pt-24 px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Manage Tasks. Stay Productive.
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          A smart task management app with Google authentication, due dates,
          overdue tracking, and complete task history.
        </p>

        {token && (
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard →
          </button>
        )}
      </section>

      {/* Features */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Feature
          icon="🔐"
          title="Secure Login"
          desc="Sign in safely using Google authentication."
        />
        <Feature
          icon="📅"
          title="Due Dates"
          desc="Assign deadlines and stay on track."
        />
        <Feature
          icon="⚠️"
          title="Overdue Alerts"
          desc="Never miss an important task."
        />
        <Feature
          icon="📜"
          title="Task History"
          desc="View completed and abandoned tasks anytime."
        />
      </section>

      {/* How It Works */}
      <section className="mt-24 text-center">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Step number="1" text="Sign in using Google" />
          <Step number="2" text="Create and manage tasks" />
          <Step number="3" text="Track progress & history" />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Prashant Goyal · Built with React, Node.js &
        Firebase
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="p-6 rounded shadow-sm border text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="p-6 border rounded text-center">
      <div className="text-3xl font-bold mb-2">{number}</div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}

export default Home;