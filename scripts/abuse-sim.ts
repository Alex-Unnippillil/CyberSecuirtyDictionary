import { POST } from "../app/api/chat/route";

async function main() {
  for (let i = 1; i <= 7; i++) {
    const req = new Request("https://example.com", {
      method: "POST",
      headers: { "x-forwarded-for": "1.2.3.4" },
    });
    const res = await POST(req);
    console.log(`Request ${i}:`, res.status, await res.text());
  }
}

main();
