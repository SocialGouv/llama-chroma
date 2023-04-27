import micri, { Router, send, text } from "micri";

const { router, on, otherwise } = Router

micri(router(
  on.get(
    (req) => req.url === '/indexing',
    (req, _res) => ({ message: 'Hello world!'})
  ),
  on.post(
    (req) => req.url === '/',
    (req) => text(req)
  ),
  otherwise(
    (req, res) => send(res, 400, 'Method Not Accepted')))
  )
  .listen(3000);
