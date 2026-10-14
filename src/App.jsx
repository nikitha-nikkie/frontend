import { useState } from "react";
import "./App.css";

const API_URL = "https://timecapsule-backend-r0ed.onrender.com/api/capsules";

function App() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [deliveryDateTime, setDeliveryDateTime] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capsules, setCapsules] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCapsules() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Capsules load avvaledu.");
      const data = await response.json();
      setCapsules(data);
      setError("");
    } catch {
      setError("Backend connect avvaledu. Backend run avutundo check cheyyi.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (new Date(deliveryDateTime) <= new Date()) {
      setError("Future date and time select cheyyi.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("recipientEmail", recipientEmail);
    formData.append("deliveryDateTime", deliveryDateTime);

    if (photo) formData.append("photo", photo);

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Capsule create avvaledu.");
      }

      setSuccess("TimeCapsule successfully create ayyindi! 💌");
      setTitle("");
      setMessage("");
      setRecipientEmail("");
      setDeliveryDateTime("");
      setPhoto(null);
      e.target.reset();

      await loadCapsules();
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Backend connect avvaledu. Backend terminal run avutundo check cheyyi."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteCapsule(id) {
    if (!window.confirm("Ee capsule delete cheyyala?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete cheyyalekapoyamu.");

      setCapsules((previous) =>
        previous.filter((capsule) => capsule.capsuleId !== id)
      );
      setSuccess("Capsule delete ayyindi.");
      setError("");
    } catch (err) {
      setError(err.message || "Capsule delete cheyyalekapoyamu.");
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-icon">💌</div>
        <p className="eyebrow">A LITTLE NOTE TO THE FUTURE</p>
        <h1>TimeCapsule</h1>
        <p className="subtitle">
          Ee roju memories ni future lo malli chudandi ✨
        </p>
      </header>

      <section className="content">
        <form className="capsule-form" onSubmit={handleSubmit}>
          <h2>Create your capsule</h2>
          <p className="form-description">
            Mee message ni future kosam save cheyyandi.
          </p>

          <label htmlFor="title">Capsule title</label>
          <input
            id="title"
            type="text"
            placeholder="Example: A letter to my future self"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
          />

          <label htmlFor="message">Your message</label>
          <textarea
            id="message"
            placeholder="Mee memories ikkada rayandi..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />

          <label htmlFor="recipientEmail">Recipient email</label>
          <input
            id="recipientEmail"
            type="email"
            placeholder="friend@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />

          <label htmlFor="deliveryDateTime">Delivery date and time</label>
          <input
            id="deliveryDateTime"
            type="datetime-local"
            value={deliveryDateTime}
            onChange={(e) => setDeliveryDateTime(e.target.value)}
            required
          />

          <label htmlFor="photo">Add a photo (optional)</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />
          {photo && <p className="file-name">📷 {photo.name}</p>}

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create TimeCapsule ❤️"}
          </button>
        </form>

        <section className="capsule-list">
          <div className="list-heading">
            <div>
              <h2>Your capsules</h2>
              <p>Saved memories in one place.</p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={loadCapsules}
            >
              Refresh ↻
            </button>
          </div>

          {capsules.length === 0 ? (
            <p className="empty-state">
              Capsules ikkada kanipistayi. Mundu oka capsule create cheyyi 💌
            </p>
          ) : (
            <div className="capsule-grid">
              {capsules.map((capsule) => (
                <article className="capsule-card" key={capsule.capsuleId}>
                  <span className="card-icon">✉️</span>
                  <h3>{capsule.title}</h3>
                  <p className="capsule-message">{capsule.message}</p>
                  <p className="capsule-detail">
                    <strong>To:</strong> {capsule.recipientEmail}
                  </p>
                  <p className="capsule-detail">
                    <strong>Delivery:</strong>{" "}
                    {capsule.deliveryDateTime
                      ? new Date(capsule.deliveryDateTime).toLocaleString()
                      : "Not set"}
                  </p>
                  <p className="capsule-detail">
                    <strong>Status:</strong>{" "}
                    {capsule.unlocked ? "Unlocked 🔓" : "Locked 🔒"}
                  </p>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteCapsule(capsule.capsuleId)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <footer>Made with ❤️ for memories yet to come.</footer>
    </main>
  );
}

export default App;