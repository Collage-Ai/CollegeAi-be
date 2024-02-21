// pages/api/search.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const searchEngineTool = require('search-engine-tool');

export default async function searchHandler(req: any, res: any) {
  const { query, engine } = req.query;

  if (!query || !engine) {
    return res.status(400).json({ error: '缺少必要的查询参数' });
  }

  try {
    const results = await searchEngineTool(query, engine);
    res.status(200).json(results);
  } catch (error) {
    console.error('发生错误:', error);
    res.status(500).json({ error: '内部服务器错误' });
  }
}
