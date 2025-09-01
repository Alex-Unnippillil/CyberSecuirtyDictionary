const steps = [
  {
    title: "Client Hello",
    description:
      'The client initiates the handshake by sending supported options. Learn more about <a href="index.html#Transport%20Layer%20Security%20(TLS)">Transport Layer Security (TLS)</a>.',
  },
  {
    title: "Server Hello and Certificate",
    description:
      'The server responds with its chosen options and sends its certificate. See <a href="index.html#Certificate%20Authority%20(CA)">Certificate Authority (CA)</a>.',
  },
  {
    title: "Certificate Verification",
    description:
      'The client verifies the certificate using trusted authorities in a <a href="index.html#Public%20Key%20Infrastructure%20(PKI)">Public Key Infrastructure (PKI)</a>.',
  },
  {
    title: "Key Exchange",
    description:
      'Both parties perform <a href="index.html#Key%20Exchange">Key Exchange</a> to create shared secrets.',
  },
  {
    title: "Finished",
    description:
      'Encrypted messages finish the handshake, establishing a secure <a href="index.html#Transport%20Layer%20Security%20(TLS)">TLS</a> session.',
  },
];

const stepContent = document.getElementById("step-content");
const prevBtn = document.getElementById("prevStep");
const nextBtn = document.getElementById("nextStep");

const params = new URLSearchParams(window.location.search);
let currentStep = parseInt(params.get("step"), 10);
if (isNaN(currentStep) || currentStep < 1 || currentStep > steps.length) {
  currentStep = 1;
}

function renderStep(push = false) {
  const step = steps[currentStep - 1];
  stepContent.innerHTML = `<h2>${step.title}</h2><p>${step.description}</p>`;
  prevBtn.disabled = currentStep === 1;
  nextBtn.disabled = currentStep === steps.length;
  const url = new URL(window.location);
  url.searchParams.set("step", currentStep);
  if (push) {
    history.pushState({ step: currentStep }, "", url);
  } else {
    history.replaceState({ step: currentStep }, "", url);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    renderStep(true);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length) {
    currentStep++;
    renderStep(true);
  }
});

window.addEventListener("popstate", () => {
  const stepFromUrl = parseInt(
    new URLSearchParams(window.location.search).get("step"),
    10,
  );
  if (!isNaN(stepFromUrl)) {
    currentStep = Math.min(Math.max(stepFromUrl, 1), steps.length);
    renderStep();
  }
});

renderStep();
