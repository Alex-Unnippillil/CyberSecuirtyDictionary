import React from "react";

interface MappingsProps {
  attack?: string[];
  owasp?: string[];
}

const ATTACK_BASE = "https://attack.mitre.org/techniques/";
const OWASP_BASE = "https://owasp.org/Top10/";

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const buildLink = (base: string, id: string): string =>
  isUrl(id) ? id : `${base}${id}`;

const Mappings: React.FC<MappingsProps> = ({ attack = [], owasp = [] }) => {
  if (attack.length === 0 && owasp.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>Mappings</h2>
      {attack.length > 0 && (
        <div>
          <h3>MITRE ATT&amp;CK</h3>
          <ul>
            {attack.map((id) => (
              <li key={id}>
                <a
                  href={buildLink(ATTACK_BASE, id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {id}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {owasp.length > 0 && (
        <div>
          <h3>OWASP</h3>
          <ul>
            {owasp.map((id) => (
              <li key={id}>
                <a
                  href={buildLink(OWASP_BASE, id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {id}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Mappings;
