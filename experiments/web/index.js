async function doBluetooth(serviceName, characteristicName) {
    const device = await window.navigator.bluetooth.requestDevice({
        // filters: [{ services: ['battery_service'] }]
        acceptAllDevices: true,
        optionalServices: [serviceName]
    })
    const server = await device.gatt.connect()
    console.log(server)
    const service = await server.getPrimaryService(serviceName)
    console.log(service)
    const characteristic = await service.getCharacteristic(characteristicName)
    console.log(characteristic)
    const manufacturerNameDataView = await characteristic.readValue()
    console.log(manufacturerNameDataView)
    const decoder = new TextDecoder()
    const manufacturerName = decoder.decode(manufacturerNameDataView.buffer)
    console.log(manufacturerName)
    return device
}

const btn = document.querySelector('#search-btn')
const serviceSelect = document.querySelector('#services-list')
const characteristicSelect = document.querySelector('#characteristics-list')

serviceSelect.addEventListener('change', _event => {
    const service = serviceSelect.options[serviceSelect.selectedIndex].value
    for (const opt of characteristicSelect.options) {
        opt.hidden = !(opt.dataset.service.includes(service));
    }
})

btn.addEventListener('click', _event => {
    const service = serviceSelect.options[serviceSelect.selectedIndex].value
    const characteristic = characteristicSelect.options[characteristicSelect.selectedIndex].value
    console.log(`Searching for service: ${service}, characteristic: ${characteristic}`)
    doBluetooth(service, characteristic)
        .then(d => console.log(d))
})

