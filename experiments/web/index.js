async function doBluetooth(serviceName, characteristicName) {
    const device = await window.navigator.bluetooth.requestDevice({
        // filters: [{ services: ['battery_service'] }]
        acceptAllDevices: true,
        // optionalServices: [serviceName]
    })
    console.log(device)
    const server = await device.gatt.connect()
    console.log(server)

    const services = await server.getPrimaryServices()
    console.log(services)
    console.log(services.map(s => s.uuid))

    const characteristics = await services[0].getCharacteristics()
    console.log(characteristics)
    console.log(characteristics.map(c => c.properties))
    console.log(characteristics.map(c => c.uuid))
    console.log(characteristics.map(c => c.value))

    const dataView = await characteristics[0].readValue()
    console.log(dataView)

    // For string values
    // const decoder = new TextDecoder()
    // const value = decoder.decode(dataView.buffer)

    // For numeric values
    const value = dataView.getUint8(0)
    console.log(value)

    return value
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
        .then(value => console.log(value))
})

