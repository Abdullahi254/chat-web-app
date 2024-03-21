const translate = require('translate-google')


const Translate = async (req, res) => {

    const { text } = req.body;
    console.log(text);
    translate(text, {from: 'fr', to: 'it'})
    .then((result) => {
        console.log(result);
        res.status(200).send(result);
    }).catch(err => {
        console.error(err);
    });
}

module.exports = { Translate };