const chanRep = nodecg.Replicant('chanNameRep', { defaultValue: 'general', persistent:true })

chanRep.on('change', (newValue, oldValue) => {
  document.getElementById('channel').textContent=`#${newValue}`
})
