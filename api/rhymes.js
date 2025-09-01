export default async function handler(req, res) {
  const { slug } = req.query || {};
  if (!slug) {
    res.status(400).json({ error: "Missing slug" });
    return;
  }

  try {
    const response = await fetch(
      `https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(slug)}&md=s`,
    );
    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch rhymes" });
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Unexpected error" });
  }
}
