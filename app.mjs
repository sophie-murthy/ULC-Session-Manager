import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('main', {message: "Hello, World!", title: "Welcome"});
});



app.listen(process.env.PORT || 3000);
