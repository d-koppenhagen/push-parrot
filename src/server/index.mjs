import express from "express";
import bodyParser from "body-parser";
import webPush from "web-push";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const subscriptions = [];

// VAPID keys should be generated only once.
const vapidKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  'mailto:mail@example.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Endpoint to get the public key
app.get('/vapidPublicKey', (req, res) => {
  res.send(vapidKeys.publicKey);
});

// Endpoint to handle subscription
app.post('/notifications/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Endpoint to send a notification
app.post('/notifications/send', (req, res) => {
  const promises = subscriptions.map(sub =>
    webPush.sendNotification(sub, JSON.stringify({
      notification: {
        title: req.body.title,
        body: req.body.body
      }
    }))
  );

  Promise.all(promises)
    .then(() => res.status(200).json({ message: 'Notification sent successfully.' }))
    .catch(err => {
      console.error('Error sending notification, reason: ', err);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
