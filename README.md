# mamba
Fast, api like express, http web server using uWebSockets.js

Forked from https://github.com/dreesq/mamba, special thanks to dreesq https://github.com/dreesq

I changed the original source to make it work for my requiriments, feel free to make a fork, pr, or open an issue, any suggestion is very wellcome. 

Sincerely, Pedro Issa.


```js
const mamba = require('@makveli/mamba');

const app = mamba();
let i = 0;

const test = async (req, res, next) => {
    ++i;
    next();
};

app.get('/:x', test, async (req, res) => {
    res.end(`${i}-${req.params.x}`);
});

app.listen(8080, () => console.log('listening on port 8080'));
```
