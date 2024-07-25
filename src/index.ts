import Express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from 'url';
import Catalyst from 'zcatalyst-sdk-node';
import cors from 'cors';
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = Express()
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

app.use(cors({ origin: true })); // add cors headers
process.env.DEBUG === 'true' && app.use(morgan('dev')); // add logging
app.use(async (req, res, next) => {
  const app = Catalyst.initialize(req as unknown as Record<string, unknown>);
  // const currentUser = await app.userManagement().getCurrentUser();
  // if(!currentUser) {
  //   return res.redirect('/__catalyst/auth/login');
  // }
  if(req.url === '/') {
    return res.redirect('/app');
  }
  res.locals.app = app;
  next();
});

app.use('/app/', Express.static('./client'));

app.use('/apis', (req, res) => {
  return res.status(200).send('success');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://localhost:${port}/`);
})
