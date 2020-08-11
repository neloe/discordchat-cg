const chanRep = nodecg.Replicant('chanRep', { defaultValue: 'general', persistent:true })
const tokenRep = nodecg.Replicant('tokenRep', {persistent:true})
const msgs = document.getElementById('messages')
let clientReady = false
let channelID = null
let channel = null

function buildmsg(message) {
  let mdiv = document.createElement('p')
  mdiv.setAttribute('class', 'message slide')
  let uspan = document.createElement('span')
  uspan.setAttribute('class', 'user')
  uspan.textContent = message.author.username + ':'
  let cspan = document.createElement('span')
  cspan.setAttribute('class', 'content')
  cspan.textContent = message.content
  mdiv.appendChild(uspan)
  mdiv.appendChild(cspan)
  return mdiv
}

function getLastMessages()
{
  if (clientReady && channelID)
  {
    client.channels.fetch(channelID).then(ch => {
    channel = ch
    //document.getElementById('channel').textContent=`#${channel.name}`

    ch.messages.fetch({limit:10}).then(messages=>{
      console.log(messages)

      while (msgs.lastElementChild)
        msgs.removeChild(msgs.lastElementChild)
      messages.forEach(msg=>{
        if (!msg.deleted){
          let m = buildmsg(msg)
          if (msgs.childNodes.length == 0)
            msgs.appendChild(m)
          else
            msgs.insertBefore(m, msgs.childNodes[0])
          m.scrollIntoView()
        }
      })
      console.log(msgs.scrollHeight)
      msgs.scrollTop = msgs.scrollHeight
    })
  })
  }
}

tokenRep.on('change', (newValue, oldValue) => {
  client.login(tokenRep.value)
  client.on('ready', function() {
    clientReady = true
    getLastMessages()
  })
})



chanRep.on('change', (newValue, oldValue) => {
  channelID = newValue
  getLastMessages()
});



const client = new Discord.Client();



client.on('message', msg => {
  nodecg.log.info(msgs.scrollHeight)
  let m = buildmsg(msg)

  if (msg.channel.id === chanRep.value)
    msgs.appendChild(m)
  m.scrollIntoView()
})
