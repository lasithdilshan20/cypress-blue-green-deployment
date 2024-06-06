const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const navigation = `
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
`;

app.get('/', (req, res) => {
    res.send(`
    ${navigation}
    <h1>Welcome to Green Environment</h1>
  `);
});

app.get('/about', (req, res) => {
    res.send(`
    ${navigation}
    <h1>About Us</h1>
  `);
});

app.get('/contact', (req, res) => {
    res.send(`
    ${navigation}
    <h1>Contact Us</h1>
    <form action="/submit-form" method="post">
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;
    res.send(`
    ${navigation}
    <div class="success-message">Thank you for your message, ${name}!</div>
  `);
});

app.get('/items', (req, res) => {
    res.send(`
    ${navigation}
    <h1>Items</h1>
    <div class="item-list">
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
      <div class="item">Item 3</div>
    </div>
  `);
});

app.get('/api/items', (req, res) => {
    res.json([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
    ]);
});

app.get('/dynamic', (req, res) => {
    res.send(`
    ${navigation}
    <h1 class="dynamic-title">Dynamic Title</h1>
    <div class="dynamic-content">This content is dynamically fetched.</div>
  `);
});

app.get('/api/dynamic-content', (req, res) => {
    res.json({
        title: 'Dynamic Title',
        content: 'This content is dynamically fetched.'
    });
});

app.get('/error', (req, res) => {
    res.status(500).send(`
    ${navigation}
    <div class="error-message">Something went wrong. Please try again later.</div>
  `);
});

app.get('/api/failing-endpoint', (req, res) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
