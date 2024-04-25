import Express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from 'url';
import Catalyst from 'zcatalyst-sdk-node';
import cors from 'cors';;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = Express()
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

app.use(cors());

// app.use(morgan('dev'));
app.use((req, res, next) => {
  const app = Catalyst.initialize(req);
  res.locals.app = app;
  next();
});

// app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, './client/index.html'));
  // res.render('index', { fileName: './client/index.html'});
});

app.use('/', Express.static('./client'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://localhost:${port}/`);
})
