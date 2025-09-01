class ConicSpinner extends HTMLElement {
  static get observedAttributes() {
    return ["value"];
  }
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        :host { display: inline-block; }
        .wrapper {
          width: var(--size, 40px);
          height: var(--size, 40px);
          border-radius: 50%;
          background: conic-gradient(var(--color, #007bff) var(--deg, 0deg), #0000 0);
          animation: spin 0.8s linear infinite;
          transition: background 0.2s linear;
        }
        :host([value]) .wrapper {
          animation: none;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
      <div class="wrapper" part="wrapper"></div>
    `;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "value") this.update();
  }
  connectedCallback() {
    this.update();
  }
  update() {
    const val = parseFloat(this.getAttribute("value"));
    const clamped = isNaN(val) ? 0 : Math.max(0, Math.min(100, val));
    const deg = clamped * 3.6;
    const wrapper = this.shadowRoot.querySelector(".wrapper");
    wrapper.style.setProperty("--deg", `${deg}deg`);
  }
}
customElements.define("conic-spinner", ConicSpinner);
