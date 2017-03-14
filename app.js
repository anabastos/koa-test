const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const config = require('config');
const handleErrors = require('./src/middlewares/handleErrors');
const db = require('./src/db');

const app = new Koa();
const router = new Router();
var views = require('koa-views');
 
app.use(views(__dirname, { map: {html: 'nunjucks' }}))
 
// app.use(async function (ctx) {
//   await ctx.render('views/home.html')
// })

app.use(handleErrors);
app.use(bodyParser());
router.get('/error/test', async () => {
	throw Error('Error handling works!');
});
router.get('/', async (ctx) => ctx.render('views/home.html'));

router.post('/dog', async (ctx, next) => {
	const data = ctx.request.body;
	ctx.body = await db.Dog.insertOne(data);
});
router.get('/dogs', async (ctx, next) => {
	ctx.body = await db.Dog.findAll();
})
router.get('/dogs/:id', async (ctx, next) => {
	const id = ctx.params.id;
	ctx.body = await db.Dog.findOneById(id);
});
router.put('/dogs/:id', async (ctx, next) => {
	const id = ctx.params.id;
	const data = ctx.request.body;
	ctx.body = await db.Dog.findOneAndUpdate(id, data);
});
router.del('/dogs/:id', async (ctx, next) => {
	const id = ctx.params.id;
	ctx.body = await db.Dog.removeOne(id);
});

app.use(router.routes());

db
.connect()
.then(() => {
	app.listen(config.port, () => {
		console.info(`Escutando o http://localhost:${config.port}`);
	});
})
.catch((err) => {
	console.error('ERR:', err);
});
