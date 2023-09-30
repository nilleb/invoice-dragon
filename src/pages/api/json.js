import { createTemplate } from "../json";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const fontsPrefix = `http://${req.headers.host}/`;
    const result = await createTemplate(req.body, fontsPrefix);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=export.pdf`);
    res.status(200).send(result)
  } else {
    res.status(200).json({ name: 'Ivo B' })
  }
}
