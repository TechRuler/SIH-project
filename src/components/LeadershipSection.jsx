import React from 'react';

export const LeadershipSection = () => {
  return (
    <section className="leadership-section">
      <div className="leadership-grid">
        <div className="how-it-works-card">
          <h3>How it works?</h3>
          <p>
            The Members of Parliament Local Area Development Division is entrusted with the responsibility
            of implementation of MPLADS. Under the scheme, each MP has the choice to suggest to the
            District Collector for works to the tune of Rs. 5 Crores per annum to be taken up in his/her constituency.
          </p>
          <p>
            The Nominated Members of Lok Sabha & Rajya Sabha may select any one or more Districts from any one State
            in the Country for implementation of their choice of work under the scheme.
          </p>
        </div>

        <div className="quote-card">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Narendra_Modi_official_portrait_2024.jpg/440px-Narendra_Modi_official_portrait_2024.jpg" 
            alt="Shri Narendra Modi" 
            className="leader-photo"
          />
          <div className="quote-content">
            <h4>Shri Narendra Modi</h4>
            <div className="leader-role">Hon'ble Prime Minister of India</div>
            <blockquote>
              "E-Governance is an essential part of our dream of Digital India, The more technology we infuse in Governance the better it is for India."
            </blockquote>
          </div>
        </div>

        <div className="quote-card">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rao_Inderjit_Singh_in_2024.jpg/440px-Rao_Inderjit_Singh_in_2024.jpg" 
            alt="Shri Rao Inderjit Singh" 
            className="leader-photo"
          />
          <div className="quote-content">
            <h4>Shri Rao Inderjit Singh</h4>
            <div className="leader-role">Minister of State for Statistics and Programme Implementation</div>
            <blockquote>
              "Real-time transparency, automated validation, and durable asset creation form the bedrock of the modernized MPLADS framework."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
