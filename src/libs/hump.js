export default function (str) {
  var names = str.split(/\s*[/|-]\s*/)
  var buf = []
  names.forEach(item => {
    buf.push(item.substring(0, 1).toUpperCase() + item.substring(1))
  })
  return buf.join('')
}
