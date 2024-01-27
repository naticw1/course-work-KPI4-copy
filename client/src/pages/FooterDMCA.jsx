import React from "react";
import "./footer.css"; // Імпортуйте ваш файл стилів

function FooterDMCA() {
  return (
    <div className="footer-dmca">
      <div className="dmca-container">
        <h2 className="dmca-title">Digital Millennium Copyright Act</h2>
        <h3 className="dmca-notice">DMCA NOTICE</h3>
        <p className="dmca-text">
          Felix Fub respects the intellectual property of others. Felix Fub
          takes matters of Intellectual property very seriously and is committed
          to meeting the needs of content owners while helping them manage the
          publication of their content online. The books’ files, which are under
          copyright protection, are NOT PUBLISHED on the website. We are not
          supporting digital piracy. Our task is to make the users familiar with
          the world literature novelties and to retain copyright. The books’
          fragments on our website are added by users, for the enjoyment of
          other users and not for the purpose of commercial benefit. We have no
          opportunity to control them constantly; thus, if you consider that
          some fragments violate the author’s right, contact us.
        </p>
        <p className="dmca-text">
          If you believe that your copyrighted work has been copied in a way
          that constitutes copyright infringement and is accessible on this
          site, you may notify our copyright agent, as set forth in the Digital
          Millennium Copyright Act of 1998 (DMCA).
        </p>
        <p className="dmca-text">
          For your complaint to be valid under the DMCA, you must provide the
          following information when providing notice of the claimed copyright
          infringement:
        </p>
        <ul className="dmca-list">
          <li>
            A physical or electronic signature of a person authorized to act on
            behalf of the copyright owner
          </li>
          <li>
            Identification of the copyrighted work claimed to have been
            infringed
          </li>
          <li>
            Identification of the material that is claimed to be infringing or
            to be the subject of the infringing activity and that is to be
            removed
          </li>
          <li>
            We will not accept links to only search results, as they do not
            identify any item that may link to material infringing your work and
            copyright. You must identify individual items in the search results
            that you wish us to remove
          </li>
          <li>
            If you send a link to another page, please describe which materials
            are under copyright protection
          </li>
          <li>
            Information reasonably sufficient to permit the service provider to
            contact the complaining party, such as an address, telephone number,
            and, if available, an electronic mail address
          </li>
          <li>
            A statement that the complaining party “in good faith believes that
            use of the material in the manner complained of is not authorized by
            the copyright owner, its agent, or law”
          </li>
          <li>
            A statement that the “information in the notification is accurate”,
            and “under penalty of perjury, the complaining party is authorized
            to act on behalf of the owner of an exclusive right that is
            allegedly infringed.”
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FooterDMCA;
