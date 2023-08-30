async function doBluetooth(operation, allServicesNames, serviceName, characteristicName) {
    const device = await window.navigator.bluetooth.requestDevice({
        // filters: [{ services: ['battery_service'] }]
        acceptAllDevices: true,
        optionalServices: allServicesNames
    })
    console.log(device)
    const server = await device.gatt.connect()
    console.log(server)

    if (operation === "all-services") {
        // Uncaught (in promise) DOMException: Origin is not allowed to access any service. Tip: Add the service UUID to 'optionalServices' in requestDevice() options. https://goo.gl/HxfxSQ
        const services = await server.getPrimaryServices()
        console.log(services)
        console.log(services.map(s => s.uuid))
    } else if (operation === "all-chars-of-service") {
        const service = await server.getPrimaryService(serviceName)
        console.log(service)
        const characteristics = await service.getCharacteristics()
        console.log(characteristics)
        console.log(characteristics.map(c => c.properties))
        console.log(characteristics.map(c => c.uuid))
        console.log(characteristics.map(c => c.value))
    } else if (operation === "char-of-service") {
        const service = await server.getPrimaryService(serviceName)
        console.log(service)
        const characteristic = await service.getCharacteristic(characteristicName)
        console.log(characteristic)

        const dataView = await characteristic.readValue()
        console.log(dataView)

        // For string values
        // const decoder = new TextDecoder()
        // const value = decoder.decode(dataView.buffer)

        // For numeric values
        const value = dataView.getUint8(0)
        console.log(value)
    }
}

const btn = document.querySelector('#search-btn')
const serviceSelect = document.querySelector('#services-list')
const characteristicSelect = document.querySelector('#characteristics-list')
const operationsList = document.querySelector('#operations-list')

serviceSelect.addEventListener('change', _event => {
    const service = serviceSelect.options[serviceSelect.selectedIndex].value
    for (const opt of characteristicSelect.options) {
        opt.hidden = !(opt.dataset.service.includes(service));
    }
})

btn.addEventListener('click', _event => {
    const services = Array.from(serviceSelect.options).map(opt => opt.value)
    const service = serviceSelect.options[serviceSelect.selectedIndex].value
    const characteristic = characteristicSelect.options[characteristicSelect.selectedIndex].value
    const operation = operationsList.querySelector('input[name="operation"]:checked')?.value
    console.log(`operation: ${operation}, service: ${service}, characteristic: ${characteristic}`)
    doBluetooth(operation, services, service, characteristic)
})

