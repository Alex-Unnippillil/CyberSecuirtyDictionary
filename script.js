const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");

const termsData = {
  "terms": [
    {
      "term": "Social Engineering Toolkit (SET)",
      "definition": "A framework for simulating social engineering attacks, helping organizations test their security awareness."
    },
    {
      "term": "Advanced Persistent Threat (APT)",
      "definition": "A prolonged and targeted cyber attack in which attackers gain and maintain unauthorized access to a network."
    },
    {
      "term": "Cyber Espionage",
      "definition": "The use of cyber techniques to steal sensitive information from governments, organizations, or individuals."
    },
    {
      "term": "Zero-Knowledge Proof",
      "definition": "A cryptographic method that allows a party to prove knowledge of a secret without revealing the secret itself."
    },
    {
      "term": "Security Operations Center (SOC)",
      "definition": "A centralized unit that monitors, detects, and responds to cybersecurity incidents and threats in real-time."
    },
    {
      "term": "Data Loss Prevention (DLP)",
      "definition": "A strategy and set of tools to prevent the unauthorized loss or leakage of sensitive data."
    },
    {
      "term": "Endpoint Security",
      "definition": "The protection of devices like laptops, desktops, and smartphones from various security threats."
    },
    {
      "term": "Security Token",
      "definition": "A physical or digital device used to authenticate users or provide one-time passwords for secure access."
    },
    {
      "term": "Network Security",
      "definition": "The protection of network infrastructure and data from unauthorized access or attacks."
    },
    {
      "term": "Payload",
      "definition": "The part of a malware or exploit that performs malicious actions on a victim's system."
    },
    {
      "term": "Cryptography",
      "definition": "The practice of secure communication by converting plaintext into ciphertext and vice versa."
    },
    {
      "term": "Social Engineering Attack Vectors",
      "definition": "Different methods and techniques used in social engineering attacks to manipulate victims."
    },
    {
      "term": "Threat Hunting",
      "definition": "Proactively searching for and identifying cyber threats that have evaded traditional security measures."
    },
    {
      "term": "Incident Response",
      "definition": "The process of managing and mitigating the impact of a cybersecurity incident or breach."
    },
    {
      "term": "Privilege Escalation",
      "definition": "The act of gaining higher levels of access or permissions in a system or network than originally granted."
    },
    {
      "term": "Security Assessment",
      "definition": "A systematic evaluation of an organization's security measures to identify vulnerabilities and weaknesses."
    },
    {
      "term": "Data Encryption Standard (DES)",
      "definition": "An early symmetric key encryption algorithm used to secure electronic data."
    },
    {
      "term": "Advanced Encryption Standard (AES)",
      "definition": "A widely used symmetric key encryption algorithm known for its security and efficiency."
    },
    {
      "term": "Public Key Infrastructure (PKI)",
      "definition": "A system for managing digital certificates and public-private key pairs used in asymmetric encryption."
    },
    {
      "term": "Certificate Authority (CA)",
      "definition": "An entity responsible for issuing and managing digital certificates used in PKI."
    },
    {
      "term": "Secure Sockets Layer (SSL)",
      "definition": "An older cryptographic protocol that provides secure communication over a computer network."
    },
    {
      "term": "Transport Layer Security (TLS)",
      "definition": "A more secure successor to SSL, providing encryption and authentication for secure communication."
    },
    {
      "term": "Key Exchange",
      "definition": "The process of securely sharing encryption keys between parties to establish a secure communication channel."
    },
    {
      "term": "Malvertising",
      "definition": "Malicious online advertisements that deliver malware or lead to malicious websites."
    },
    {
      "term": "Eavesdropping",
      "definition": "Unauthorized interception and monitoring of private communications, often done surreptitiously."
    },
    {
      "term": "Identity Theft",
      "definition": "The fraudulent acquisition and use of an individual's personal information to impersonate them for malicious purposes."
    },
    {
      "term": "Zero-Day Vulnerability",
      "definition": "A software vulnerability that is not yet known to the vendor or the public, making it highly valuable to attackers."
    },
    {
      "term": "Security Patch",
      "definition": "An update released by software vendors to fix security vulnerabilities in their products."
    },
    {
      "term": "Cross-Site Scripting (XSS)",
      "definition": "A type of web vulnerability where attackers inject malicious scripts into web pages viewed by other users."
    },
    {
      "term": "Cross-Site Request Forgery (CSRF)",
      "definition": "An attack that tricks a user into unknowingly submitting a malicious request on a trusted website."
    },
    {
      "term": "Phishing Email",
      "definition": "An email sent by attackers that appears legitimate but aims to trick recipients into revealing sensitive information or performing actions."
    },
    {
      "term": "Denial of Service (DoS) Attack",
      "definition": "An attack that overwhelms a target system or network with excessive traffic to make it unavailable to users."
    },
    {
      "term": "Distributed Denial of Service (DDoS) Attack",
      "definition": "A DoS attack conducted from multiple sources simultaneously to amplify its impact and make it harder to mitigate."
    },
    {
      "term": "SQL Injection",
      "definition": "A web application vulnerability that allows attackers to execute malicious SQL statements to gain unauthorized access to a database."
    },
    {
      "term": "Penetration Testing (Pen Testing)",
      "definition": "The process of simulating cyber attacks to identify vulnerabilities and weaknesses in a system."
    },
    {
      "term": "Malware",
      "definition": "Malicious software designed to harm computer systems or steal sensitive information."
    },
    {
      "term": "Phishing",
      "definition": "A social engineering technique where attackers deceive individuals to reveal sensitive information or perform actions."
    },
    {
      "term": "Ransomware",
      "definition": "A type of malware that encrypts a victim's files and demands a ransom for the decryption key."
    },
    {
      "term": "Firewall",
      "definition": "A network security device that monitors and controls incoming and outgoing traffic based on predefined security rules."
    },
    {
      "term": "Intrusion Detection System (IDS)",
      "definition": "Monitors network traffic for suspicious activities and alerts administrators of potential security breaches."
    },
    {
      "term": "Intrusion Prevention System (IPS)",
      "definition": "An advanced security solution that can detect and block suspicious network activities."
    },
    {
      "term": "Encryption",
      "definition": "The process of converting plaintext data into ciphertext to protect it from unauthorized access."
    },
    {
      "term": "Virtual Private Network (VPN)",
      "definition": "A secure network connection that allows users to access resources securely over the internet."
    },
    {
      "term": "Two-Factor Authentication (2FA)",
      "definition": "An authentication method that requires users to provide two forms of identification for added security."
    },
    {
      "term": "Botnet",
      "definition": "A network of compromised computers, controlled by attackers, used to perform coordinated actions."
    },
    {
      "term": "Rootkit",
      "definition": "A type of malware that provides unauthorized access to a computer system while hiding its presence."
    },
    {
      "term": "Spoofing",
      "definition": "Impersonating a legitimate user, device, or network to gain unauthorized access."
    },
    {
      "term": "Biometric Authentication",
      "definition": "Authentication based on unique physical or behavioral characteristics, such as fingerprint or facial recognition."
    },
    {
      "term": "Network Segmentation",
      "definition": "Dividing a network into smaller, isolated segments to limit the impact of a security breach."
    },
    {
      "term": "Honeypot",
      "definition": "A decoy system or network designed to attract and detect unauthorized access attempts, gathering information on attackers."
    },
    {
      "term": "Security Awareness Training",
      "definition": "Educational programs that teach individuals about cybersecurity risks and best practices."
    },
    {
      "term": "Red Team",
      "definition": "A group of ethical hackers who simulate real-world cyberattacks to test an organization's security defenses."
    },
    {
      "term": "Blue Team",
      "definition": "A group responsible for defending an organization against cyber threats and responding to security incidents."
    },
    {
      "term": "Threat Intelligence",
      "definition": "Information about potential and current cyber threats, including indicators of compromise and attack patterns."
    },
    {
      "term": "Digital Forensics",
      "definition": "The process of collecting, preserving, and analyzing digital evidence to investigate and respond to cyber incidents."
    },
    {
      "term": "Cybersecurity Framework",
      "definition": "A set of guidelines and best practices to manage and improve an organization's cybersecurity posture."
    },
    {
      "term": "Zero Trust Security",
      "definition": "A security model that assumes no trust and verifies every user and device accessing the network before granting access."
    },
    {
      "term": "Cyber Threat Hunting",
      "definition": "Proactive and iterative searching for cyber threats and vulnerabilities within an organization's network."
    },
    {
      "term": "CISO (Chief Information Security Officer)",
      "definition": "An executive responsible for the development and implementation of an organization's information security strategy."
    },
    {
      "term": "Identity and Access Management (IAM)",
      "definition": "A framework for managing digital identities, user access, and authentication within an organization."
    },
    {
      "term": "Security Operations",
      "definition": "The ongoing activities and processes to monitor, detect, and respond to cybersecurity threats and incidents."
    },
    {
      "term": "Patch Management",
      "definition": "The process of regularly applying updates and fixes to software and systems to address security vulnerabilities."
    },
    {
      "term": "Data Breach",
      "definition": "Unauthorized access to sensitive or confidential data, leading to its exposure, theft, or disclosure."
    },
    {
      "term": "Endpoint Protection",
      "definition": "Security measures taken to protect individual devices like computers, laptops, and smartphones from cyber threats."
    },
    {
      "term": "Security Incident",
      "definition": "An adverse event or series of events that indicate a security breach or potential threat to information assets."
    },
    {
      "term": "Insider Threat",
      "definition": "A security risk posed by individuals within an organization who have access to sensitive information and misuse it."
    },
    {
      "term": "Firewall",
      "definition": "A network security device that monitors and controls incoming and outgoing traffic based on predefined security rules."
    },
    {
      "term": "Intrusion Detection System (IDS)",
      "definition": "Monitors network traffic for suspicious activities and alerts administrators of potential security breaches."
    },
    {
      "term": "Intrusion Prevention System (IPS)",
      "definition": "An advanced security solution that can detect and block suspicious network activities."
    },
    {
      "term": "Encryption",
      "definition": "The process of converting plaintext data into ciphertext to protect it from unauthorized access."
    },
    {
      "term": "VPN (Virtual Private Network)",
      "definition": "A secure network connection that allows users to access resources securely over the internet."
    },
    {
      "term": "Two-Factor Authentication (2FA)",
      "definition": "An authentication method that requires users to provide two forms of identification for added security."
    },
    {
      "term": "Botnet",
      "definition": "A network of compromised computers, controlled by attackers, used to perform coordinated actions."
    },
    {
      "term": "Rootkit",
      "definition": "A type of malware that provides unauthorized access to a computer system while hiding its presence."
    },
    {
      "term": "Spoofing",
      "definition": "Impersonating a legitimate user, device, or network to gain unauthorized access."
    },
    {
      "term": "Biometric Authentication",
      "definition": "Authentication based on unique physical or behavioral characteristics, such as fingerprint or facial recognition."
    },
    {
      "term": "Network Segmentation",
      "definition": "Dividing a network into smaller, isolated segments to limit the impact of a security breach."
    },
    {
      "term": "Honeypot",
      "definition": "A decoy system or network designed to attract and detect unauthorized access attempts, gathering information on attackers."
    },
    {
      "term": "Security Awareness Training",
      "definition": "Educational programs that teach individuals about cybersecurity risks and best practices."
    }
  ]
};


function displayDictionary() {
  termsData.terms.sort((a, b) => a.term.localeCompare(b.term));

  termsData.terms.forEach((item) => {
    const termDiv = document.createElement("div");
    termDiv.classList.add("dictionary-item");

    const termHeader = document.createElement("h3");
    termHeader.textContent = item.term;
    termDiv.appendChild(termHeader);

    const definitionPara = document.createElement("p");
    definitionPara.textContent = item.definition;
    termDiv.appendChild(definitionPara);

    termDiv.addEventListener("click", () => {
      displayDefinition(item);
    });

    termsList.appendChild(termDiv);
  });
}
// Call the displayDictionary function when the page loads
displayDictionary();


function populateTermsList() {
  termsList.innerHTML = ""; 
  termsData.terms.forEach((term) => {
    if (isMatchingTerm(term)) {
      const listItem = document.createElement("li");
      listItem.textContent = term.term;
      listItem.addEventListener("click", () => {
        displayDefinition(term);
      });
      termsList.appendChild(listItem);
    }
  });
}


function isMatchingTerm(term) {
  const searchValue = searchInput.value.trim().toLowerCase();
  if (searchValue === "") return true; // Show all terms when the search input is empty
  return term.term.toLowerCase().includes(searchValue);
}

function displayDefinition(term) {
  definitionContainer.style.display = "block";
  definitionContainer.innerHTML = `<h3>${term.term}</h3><p>${term.definition}</p>`;
}

// Handle the search input event
searchInput.addEventListener("input", populateTermsList);
