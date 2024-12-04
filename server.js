const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint pour récupérer les messages
app.get('/api/chat', (req, res) => {
    fs.readFile('./dist/js/chat.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier chat.json');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Endpoint pour ajouter un message
app.post('/api/chat', (req, res) => {
    const newMessage = req.body;

    fs.readFile('./dist/js/chat.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier chat.json');
        } else {
            const chats = JSON.parse(data);

            // Ajouter le nouveau message à la conversation correspondante
            const conversation = chats.find(chat => chat.id === newMessage.chatId);
            if (conversation) {
                conversation.messages.push({
                    userID: newMessage.userID,
                    text: newMessage.text,
                    date: new Date().toISOString()
                });

                // Écrire les changements dans le fichier
                fs.writeFile('./dist/js/chat.json', JSON.stringify(chats, null, 2), err => {
                    if (err) {
                        res.status(500).send('Erreur lors de l\'écriture dans chat.json');
                    } else {
                        res.status(200).send('Message ajouté avec succès');
                    }
                });
            } else {
                res.status(404).send('Conversation non trouvée');
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://127.0.0.1:${PORT}`);
});
