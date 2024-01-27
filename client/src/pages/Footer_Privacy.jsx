import React from "react";

import "./footer.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <div className="policy-container">
        <div className="policy-header">
          <h1 className="policy-title">Privacy Policy</h1>
        </div>
        <div className="policy-content">
          <p className="policy-section">
            Information Collection:
            <br />
            We collect minimal personal information, such as email, name, and
            location, only with your consent.
          </p>
          <p className="policy-section">
            Security:
            <br />
            Your data is protected using encryption, access controls, firewalls,
            and physical security.
          </p>
          <p className="policy-section">
            Cookies:
            <br />
            We use cookies for a personalized user experience and to track
            preferences and behavior.
          </p>
          <p className="policy-section">
            Disclosure:
            <br />
            We may disclose data when required by law to protect rights, safety,
            or property.
          </p>
          <p className="policy-section">
            Children's Privacy:
            <br />
            We don't collect data from children under 13 and may close their
            accounts if found.
          </p>
          <p className="policy-section">
            Third Parties:
            <br />
            Third parties collect data for statistical purposes only.
          </p>
          <p className="policy-section">
            Policy Changes:
            <br />
            We reserve the right to update policies without prior notice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
