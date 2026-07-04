"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mail client
    window.location.href = `mailto:toptamiltricks@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;
    toast.success("Opening your email client...");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="legal-page" style={{ maxWidth: 600 }}>
      <h1>Contact Us</h1>
      <p className="last-updated">We&apos;d love to hear from you!</p>
      <p>Have a question, suggestion, or want to collaborate? Send us a message:</p>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Your Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontSize: 14, outline: "none" }}
            id="contact-name" placeholder="Your name" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontSize: 14, outline: "none" }}
            id="contact-email" placeholder="your@email.com" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Message *</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text)", fontSize: 14, outline: "none", minHeight: 140, resize: "vertical", fontFamily: "inherit" }}
            id="contact-message" placeholder="Your message..." />
        </div>
        <button type="submit" id="contact-submit"
          style={{ padding: "12px 28px", background: "var(--primary)", color: "white", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
          Send Message →
        </button>
      </form>

      <div style={{ marginTop: 32, padding: 20, background: "var(--bg-secondary)", borderRadius: 12 }}>
        <h2 style={{ fontSize: "1rem", marginBottom: 8 }}>Direct Contact</h2>
        <p>📧 Email: <strong>toptamiltricks@gmail.com</strong></p>
      </div>
    </div>
  );
}
