const telegramAPI = require("node-telegram-bot-api")
const express = require('express')
const cors = require('cors')


const token = '7258701539:AAH8sWLMYyuPB4-Roq2KG9b-GTmB7ouRFpc' // todo унеси в .env потом
const bot = new telegramAPI(token, {polling: true});
const webAppUrl = 'https://066b-188-125-171-174.ngrok-free.app'

const app = express()

app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  bot.sendMessage(chatId, 'Received your message');
  
  if (text === '/start') {
    await bot.sendMessage(chatId, 'Заполни форму', {
      reply_markup:
        {
          keyboard:
            [
              [
                {text: 'Заполнить форму', web_app: {url: `${webAppUrl}/form`}}
              ]
            ]
        }
    });

    await bot.sendMessage(chatId, 'Сделать заказ', {
      reply_markup:
        {
          inline_keyboard:
            [
              [
                {text: 'Сделать заказ', web_app: {url: webAppUrl}}
              ]
            ]
        }
    });
  }

    
  if (msg?.web_app_data?.data) {
    
    try {
      const data = JSON.parse(msg.web_app_data.data)
      await bot.sendMessage(chatId, 'Спасиббооо, дружище из города ' + JSON.parse(msg.web_app_data.data).city)
    } catch (err) {
      console.log(err)
    }    
  }  
});

app.post('/cart', async(req, res)=>{
  const {products, query_id} = req.body.data  
  try {
    await bot.answerWebAppQuery(query_id, {
      type: 'article',
      id: query_id, 
      title: 'Получилось!',
      input_message_content: {message_text: 'Ты просто нереальная молодца!'}
    } )
    return res.status(200).json({})
  } catch(err) {
    console.log(err)
    return res.status(500)
  }  
})


const PORT = 8000

app.listen(PORT, ()=>{
  console.log('server started on port 8000')
})

