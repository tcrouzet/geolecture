import balades from '../balades/catalogue.js'

const TRIGGER_METERS = 25
const APPROACH_METERS = 8
const state = { routeId: null, current: 0, position: null, opened: true }
let map, reader, path, pins = [], arrows = []
let documents = []
let preface = ''

const $ = (selector) => document.querySelector(selector)
const escapeHtml = (value) => value.replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char])
const escapeAttribute = (value) => escapeHtml(value).replace(/"/g, '&quot;')
const restoreAllowedHtml = (value) => value
  .replace(/&lt;(\/?)sup&gt;/g, '<$1sup>')
  .replace(/&lt;(\/?)sub&gt;/g, '<$1sub>')

function setHidden(selector, hidden) {
  const element = $(selector)
  if (element) element.hidden = hidden
}

function setHomeMode(enabled) {
  if (!document.body || !document.body.classList) return
  document.body.classList.toggle('is-home', enabled)
}

function parseDocument(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { meta: {}, text: source }
  const meta = {}
  match[1].split('\n').forEach(line => {
    const separator = line.indexOf(':')
    if (separator === -1) return
    meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  })
  return { meta, text: match[2].trim() }
}

function currentDocument() {
  return documents[state.routeId]
}

function routeUrl(id) {
  const url = new URL(window.location.href)
  url.searchParams.set('balade', balades[id].slug)
  url.hash = ''
  return url.pathname + url.search
}

function routeIdFromUrl() {
  const slug = new URLSearchParams(window.location.search).get('balade')
  const id = balades.findIndex(balade => balade.slug === slug)
  return id === -1 ? null : id
}

function chapters(source) {
  return source.split(/^# /m).slice(1).map(part => {
    const [title, ...body] = part.split('\n')
    return { title, body: body.join('\n').trim() }
  })
}

function inline(text) {
  const info = state.routeId == null ? null : balades[state.routeId]
  let html = restoreAllowedHtml(escapeHtml(text))
    .replace(/!\[([^\]]*)\]\(([^ )]+)(?:\s+"[^"]*")?\)/g, (_, alt, src) => {
      const base = info ? info.imageBase : ''
      return `<img src="${base}${src}" alt="${escapeAttribute(alt)}" loading="lazy">`
    })
  html = renderLinks(html, (label, href) => {
      if (/^https?:\/\//.test(href)) return `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${label}</a>`
      if (href === 'gotoaide') return label
      const note = decodeURIComponent(href)
      return `<details class="note"><summary>${label}</summary><span>${escapeHtml(note)}</span></details>`
    })
  return html
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function renderLinks(text, render) {
  let output = ''
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '[') { output += text[i]; continue }
    const labelEnd = text.indexOf(']', i + 1)
    if (labelEnd === -1 || text[labelEnd + 1] !== '(') { output += text[i]; continue }
    let depth = 1, hrefEnd = labelEnd + 2
    for (; hrefEnd < text.length; hrefEnd++) {
      if (text[hrefEnd] === '(') depth++
      else if (text[hrefEnd] === ')' && --depth === 0) break
    }
    if (depth !== 0) { output += text[i]; continue }
    output += render(text.slice(i + 1, labelEnd), text.slice(labelEnd + 2, hrefEnd))
    i = hrefEnd
  }
  return output
}

function markdown(source) {
  const lines = source.split('\n')
  let html = '', paragraph = [], quote = [], list = false
  const flushParagraph = () => { if (paragraph.length) html += `<p>${inline(paragraph.join(' '))}</p>`; paragraph = [] }
  const flushQuote = () => { if (quote.length) html += `<blockquote>${quote.map(inline).join('<br>')}</blockquote>`; quote = [] }
  const flush = () => { flushParagraph(); flushQuote() }
  for (const line of lines) {
    if (/^### /.test(line)) { flush(); html += `<h3>${inline(line.slice(4))}</h3>` }
    else if (/^## /.test(line)) { flush(); html += `<h2>${inline(line.slice(3))}</h2>` }
    else if (/^> ?/.test(line)) { flushParagraph(); quote.push(line.replace(/^> ?/, '')) }
    else if (/^[-*] /.test(line)) { flush(); if (!list) { html += '<ul>'; list = true } html += `<li>${inline(line.slice(2))}</li>` }
    else if (/^-{3,}\s*$/.test(line)) { flush(); if (list) { html += '</ul>'; list = false } html += '<hr>' }
    else if (!line.trim()) { flush(); if (list) { html += '</ul>'; list = false } }
    else paragraph.push(line)
  }
  flush(); if (list) html += '</ul>'
  return html
}

function distance(a, b) {
  const rad = value => value * Math.PI / 180
  const dLat = rad(b.latitude - a.latitude), dLon = rad(b.longitude - a.longitude)
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2
  return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function bearing(a, b) {
  const rad = value => value * Math.PI / 180
  const degrees = value => value * 180 / Math.PI
  const delta = rad(b.longitude - a.longitude)
  const y = Math.sin(delta) * Math.cos(rad(b.latitude))
  const x = Math.cos(rad(a.latitude)) * Math.sin(rad(b.latitude)) - Math.sin(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.cos(delta)
  return (degrees(Math.atan2(y, x)) + 360) % 360
}

function directionPoint(points) {
  const index = Math.max(0, Math.floor((points.length - 1) / 2))
  const from = points[index], to = points[Math.min(index + 1, points.length - 1)]
  return {
    latitude: (from.latitude + to.latitude) / 2,
    longitude: (from.longitude + to.longitude) / 2,
    angle: bearing(from, to),
  }
}

function offsetPosition(point, meters, angle) {
  const earth = 6371000
  const rad = value => value * Math.PI / 180
  const degrees = value => value * 180 / Math.PI
  const distance = meters / earth
  const lat1 = rad(point.latitude)
  const lon1 = rad(point.longitude)
  const bearing = rad(angle)
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance) + Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing))
  const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1), Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2))
  return { latitude: degrees(lat2), longitude: degrees(lon2) }
}

function approachPoint() {
  const route = balades[state.routeId].parcours
  const nextIndex = Math.min(state.current + 1, route.markers.length - 1)
  const target = route.markers[nextIndex].coordinates
  const previous = route.markers[Math.max(1, nextIndex - 1)].coordinates
  const awayFromTarget = (bearing(target, previous) + 360) % 360
  return offsetPosition(target, APPROACH_METERS, awayFromTarget)
}

function currentStation() {
  const route = balades[state.routeId].parcours
  const index = Math.min(state.current + 1, route.markers.length - 1)
  return route.markers[index].coordinates
}

function buildMap() {
  const route = balades[state.routeId].parcours, center = route.markers[1].coordinates
  if (!map) {
    map = L.map('map').setView([center.latitude, center.longitude], 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map)
    map.on('click', event => setPosition({ latitude: event.latlng.lat, longitude: event.latlng.lng }))
    const startControl = L.control({ position: 'topleft' })
    startControl.onAdd = () => {
      const button = L.DomUtil.create('button', 'leaflet-start-control')
      button.type = 'button'
      button.title = 'Dérouler la prochaine étape'
      button.setAttribute('aria-label', 'Dérouler la prochaine étape')
      button.innerHTML = '⌂'
      L.DomEvent.disableClickPropagation(button)
      L.DomEvent.on(button, 'click', () => {
        const position = approachPoint()
        map.setView([position.latitude, position.longitude], 17)
        setPosition(position)
      })
      return button
    }
    startControl.addTo(map)
    const zoomControl = L.control({ position: 'topleft' })
    zoomControl.onAdd = () => {
      const button = L.DomUtil.create('button', 'leaflet-geo-control')
      button.type = 'button'
      button.title = 'Zoom sur la station en cours'
      button.setAttribute('aria-label', 'Zoom sur la station en cours')
      button.innerHTML = '🔍'
      L.DomEvent.disableClickPropagation(button)
      L.DomEvent.on(button, 'click', () => {
        const station = currentStation()
        map.setView([station.latitude, station.longitude], 18)
      })
      return button
    }
    zoomControl.addTo(map)
  }
  if (path) path.remove()
  pins.forEach(pin => pin.remove())
  arrows.forEach(arrow => arrow.remove())
  pins = []
  arrows = []
  const points = []
  route.paths.forEach(segment => {
    segment.points.forEach(point => points.push([point.latitude, point.longitude]))
  })
  path = L.polyline(points, { color: '#dd5f38', weight: 4, opacity: .8 }).addTo(map)
  route.markers.slice(1).forEach((marker, index) => {
    const unlocked = index + 1 <= state.current
    const icon = L.divIcon({
      className: 'numbered-pin-wrap',
      html: `<span class="numbered-pin${unlocked ? '' : ' future'}">${index + 1}</span>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })
    const pin = L.marker([marker.coordinates.latitude, marker.coordinates.longitude], { icon })
      .bindPopup(`${index + 1}. ${marker.title}`).addTo(map)
    pins.push(pin)
  })
  route.paths.forEach(segment => {
    if (segment.points.length < 2) return
    const direction = directionPoint(segment.points)
    const icon = L.divIcon({
      className: 'route-arrow-wrap',
      html: `<span class="route-arrow" style="transform:rotate(${direction.angle}deg)">▲</span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    arrows.push(L.marker([direction.latitude, direction.longitude], { icon, interactive: false }).addTo(map))
  })
}

function setPosition(position) {
  state.position = position
  if (reader) reader.remove()
  const icon = L.divIcon({ className: 'reader-wrap', html: '<span class="reader-dot"></span>', iconSize: [24, 24], iconAnchor: [12, 12] })
  reader = L.marker([position.latitude, position.longitude], { icon, draggable: true }).addTo(map)
  reader.on('drag', event => {
    const point = event.target.getLatLng()
    state.position = { latitude: point.lat, longitude: point.lng }
    checkPosition()
  })
  map.panTo([position.latitude, position.longitude])
  checkPosition()
}

function checkPosition() {
  const list = chapters(currentDocument().text)
  if (!state.position || state.current >= list.length - 1) return
  const next = balades[state.routeId].parcours.markers[state.current + 1]
  const meters = distance(state.position, next.coordinates)
  if (meters <= TRIGGER_METERS) {
    state.current++
    localStorage.setItem(`geolecture-progress-${state.routeId}`, state.current)
    render()
    scrollToChapter(state.current)
  }
}

function imagesBefore(element) {
  return [...document.querySelectorAll('#text img')].filter(image => image.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
}

function waitForImages(images) {
  const pending = images.filter(image => !image.complete)
  if (!pending.length) return Promise.resolve()
  return Promise.all(pending.map(image => new Promise(resolve => {
    image.addEventListener('load', resolve, { once: true })
    image.addEventListener('error', resolve, { once: true })
  })))
}

function scrollToElementTop(element, behavior = 'smooth') {
  const top = element.getBoundingClientRect().top + window.pageYOffset
  window.scrollTo({ top, behavior })
}

function scrollToChapter(id) {
  requestAnimationFrame(() => {
    const chapter = document.querySelector(`#chapter-${id}`)
    const title = chapter?.querySelector('h1') || chapter
    if (!title) return
    scrollToElementTop(title, 'smooth')
    waitForImages(imagesBefore(title)).then(() => {
      requestAnimationFrame(() => scrollToElementTop(title, 'auto'))
    })
    window.setTimeout(() => scrollToElementTop(title, 'auto'), 450)
  })
}

function stationInstruction(total) {
  const station = state.current + 1
  if (station >= total) return '<button class="restart-reading" type="button">Recommencer la géolecture</button>'
  return `<p class="station-instruction">Allez à station ${station} (cliquez près de la balise sur la carte ou sur le bouton maison).</p>`
}

function render() {
  if (state.routeId == null) return renderHome()
  $('#route-select').value = String(state.routeId)
  const balade = balades[state.routeId], document = currentDocument(), info = document.meta, route = balade.parcours, list = chapters(document.text)
  const finished = state.current >= list.length - 1
  $('#route-meta').textContent = `${info.ville} · ${route.markers.length - 1} stations`
  $('#route-title').textContent = info.titre
  $('#route-author').textContent = [info.auteur, info.date].filter(Boolean).join(', ')
  $('#route-description').textContent = info.presentation
  $('#cover').src = `${balade.dossier}${info.image}`
  $('#text').innerHTML = list.slice(0, state.current + 1).map((chapter, id) => `<article id="chapter-${id}"><h1>${chapter.title}</h1>${markdown(chapter.body)}${id === state.current ? stationInstruction(list.length) : ''}</article>`).join('')
  setHidden('.reading', !state.opened)
  setHidden('.journey', !state.opened || finished)
  setHidden('#home', true)
  setHidden('#top', false)
  setHomeMode(false)
  setHidden('#route-picker', false)
  if (!finished) {
    requestAnimationFrame(() => {
      buildMap()
      map.invalidateSize()
    })
  }
}

function renderHome() {
  $('#home-preface').innerHTML = markdown(preface)
  $('#home-grid').innerHTML = documents.map((document, id) => {
    const balade = balades[id], info = document.meta, route = balade.parcours
    return `<a class="home-card" href="${routeUrl(id)}" data-route="${id}">
      <img src="${balade.dossier}${info.image}" alt="">
      <span>${info.ville}</span>
      <strong>${info.titre}</strong>
      <small>${info.auteur}${info.date ? `, ${info.date}` : ''} · ${route.markers.length - 1} stations</small>
    </a>`
  }).join('')
  setHidden('#home', false)
  setHidden('#top', true)
  setHidden('.reading', true)
  setHidden('.journey', true)
  setHomeMode(true)
  setHidden('#route-picker', true)
  $('#route-select').selectedIndex = -1
}

function restartReading() {
  state.current = 0
  state.position = null
  localStorage.removeItem(`geolecture-progress-${state.routeId}`)
  if (reader) { reader.remove(); reader = null }
  render()
  requestAnimationFrame(() => {
    if (map) map.invalidateSize()
    const preambule = $('#chapter-0')
    if (preambule) preambule.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function openWalk() {
  requestAnimationFrame(() => {
    if (map) map.invalidateSize()
    const preambule = $('#chapter-0')
    if (preambule) preambule.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function selectRoute(id, push = true) {
  state.routeId = id
  state.current = 0
  state.position = null
  state.opened = true
  $('#route-select').value = String(id)
  if (reader) { reader.remove(); reader = null }
  if (push) history.pushState(null, '', routeUrl(id))
  render()
  const start = balades[id].parcours.markers[1].coordinates
  requestAnimationFrame(() => {
    if (map) map.setView([start.latitude, start.longitude], 15)
  })
  window.scrollTo({ top: 0, behavior: 'auto' })
}

const routeSelect = $('#route-select')
const topSection = $('#top')
const homeGrid = $('#home-grid')
const textSection = $('#text')

if (routeSelect) routeSelect.addEventListener('change', event => selectRoute(Number(event.target.value)))
if (topSection) topSection.addEventListener('click', openWalk)
if (topSection) topSection.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openWalk() } })
if (homeGrid) homeGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-route]')
  if (!card) return
  event.preventDefault()
  selectRoute(Number(card.dataset.route))
})
if (textSection) textSection.addEventListener('click', event => {
  if (event.target.closest('.restart-reading')) restartReading()
})
async function init() {
  const textVersion = Date.now()
  const prefaceResponse = await fetch(`balades/preface.md?_t=${textVersion}`, { cache: 'no-store' })
  if (prefaceResponse.ok) preface = await prefaceResponse.text()
  documents = await Promise.all(balades.map(async balade => {
    const separator = balade.textUrl.includes('?') ? '&' : '?'
    const response = await fetch(`${balade.textUrl}${separator}_t=${textVersion}`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Impossible de charger ${balade.textUrl}`)
    return parseDocument(await response.text())
  }))
  documents.forEach((document, id) => $('#route-select').add(new Option(document.meta.ville, id)))
  state.routeId = routeIdFromUrl()
  render()
}

window.addEventListener('popstate', () => {
  state.routeId = routeIdFromUrl()
  state.current = 0
  state.position = null
  if (reader) { reader.remove(); reader = null }
  render()
})

init().catch(error => {
  console.error(error)
  setHomeMode(false)
  setHidden('#home', true)
  setHidden('#top', false)
  const title = $('#route-title')
  const author = $('#route-author')
  const description = $('#route-description')
  if (title) title.textContent = 'Erreur de chargement'
  if (author) author.textContent = ''
  if (description) description.textContent = `${error.message}. Lancez la page depuis un petit serveur local, par exemple : python3 -m http.server 8000`
})
