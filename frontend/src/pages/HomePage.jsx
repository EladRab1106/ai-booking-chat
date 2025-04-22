import React from "react";
import HomeCss from "../css/HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      <section className="hero">
        <h1>BookMate</h1>
        <h1>Your business, your assistant — smarter, simpler, faster</h1>
        <p>
          It’s more than booking. It’s everything your client needs — in one
          friendly chat.
        </p>
        <button onClick={() => alert("Coming soon!")}>Start Now</button>
      </section>

      <section className="features">
        <h2> why working with us?</h2>
        <ul>
          <li>💬 Book appointments through real conversation</li>
          <li>📲 No downloads, no hassle – just one link</li>
          <li>🧠 AI that understands your clients like a real assistant</li>
          <li>📊 Know your regulars – track and grow loyalty automatically</li>
        </ul>
      </section>

      <section className="cta">
        <h3>
          Perfect for any small business – salons, beauty, fashion stores and
          more
        </h3>
        <button>Contact Us</button>
      </section>
    </div>
  );
}

export default HomePage;
