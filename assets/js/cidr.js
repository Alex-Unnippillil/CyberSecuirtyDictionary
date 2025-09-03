function ipToInt(ip) {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function intToIp(int) {
  return [int >>> 24, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join(
    ".",
  );
}

function prefixToMask(prefix) {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

async function copyToClipboard(id) {
  const text = document.getElementById(id).textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (!successful) {
      throw err;
    }
  }
}

function calculate() {
  const input = document.getElementById("cidr-input").value.trim();
  const match = input.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  if (!match) {
    alert("Invalid CIDR notation");
    return;
  }
  const ip = match[1];
  const prefix = parseInt(match[2], 10);
  if (prefix < 0 || prefix > 32) {
    alert("Invalid CIDR notation");
    return;
  }
  const octets = ip.split(".").map(Number);
  if (octets.some((o) => o > 255)) {
    alert("Invalid IP address");
    return;
  }
  const ipInt = ipToInt(ip);
  const maskInt = prefixToMask(prefix);
  const networkInt = ipInt & maskInt;
  const broadcastInt = networkInt | (~maskInt >>> 0);
  let hostCount;
  if (prefix === 32) hostCount = 1;
  else if (prefix === 31) hostCount = 2;
  else hostCount = Math.pow(2, 32 - prefix) - 2;
  const firstHostInt = hostCount > 1 ? networkInt + 1 : networkInt;
  const lastHostInt = hostCount > 1 ? broadcastInt - 1 : broadcastInt;

  const results = {
    "IP Address": ip,
    "Subnet Mask": intToIp(maskInt),
    "Network Address": intToIp(networkInt),
    "Network Range": `${intToIp(networkInt)} - ${intToIp(broadcastInt)}`,
    "Host Count": hostCount.toString(),
    "First Host": intToIp(firstHostInt),
    "Last Host": intToIp(lastHostInt),
    "Broadcast Address": intToIp(broadcastInt),
  };

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  Object.entries(results).forEach(([label, value]) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const span = document.createElement("span");
    span.id = label.replace(/\s+/g, "-").toLowerCase();
    span.textContent = value;

    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.className = "copy-btn";
    btn.addEventListener("click", () => copyToClipboard(span.id));

    wrapper.appendChild(document.createTextNode(label + ": "));
    wrapper.appendChild(span);
    wrapper.appendChild(btn);
    resultsDiv.appendChild(wrapper);
  });
}

if (document.getElementById("calculate")) {
  document.getElementById("calculate").addEventListener("click", calculate);
}
