const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();
app.use(cors())
app.use(bodyParser.json())

const vapidKeys = {
    publicKey: 'BDgN6W7rIH0LQJ6KCQ03To8VSyPMfHXCAzKZ08CRwVtQdkJJLppplkACC3zd_gQIwP1ZvW4PtfeF0eim-WQBfoM',
    privateKey: 'YaPKiEE89QV7XS-s-hYu_2ZxN_d7mlubjeiF2FSsYUs'
}

webpush.setVapidDetails(
    'mailto:ul_sniper@foxmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const sendNotification = (subscription, dataToSend="") => {
    webpush.sendNotification(subscription, dataToSend)
} 

const dummyDb = { subscription: null };

const saveToDb = subscription => {
    dummyDb.subscription = subscription
}

app.post('/save-subscription', (req, res) => {
    const subscription = req.body;
    console.log(subscription)
    saveToDb(subscription);
    res.json({message: 'success'})
})

app.get('/send-notification', (req, res) => {
    const subscription = dummyDb.subscription;
    const message = 'hello world';
    sendNotification(subscription, message)
    res.json({message: 'message sent'})
})


app.listen(9014, () => console.log('web push server 启动了'))