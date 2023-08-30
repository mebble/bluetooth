async function doBluetooth(operation, allServicesNames, serviceName, characteristicName) {
    const device = await window.navigator.bluetooth.requestDevice({
        // filters: [{ services: ['battery_service'] }]
        acceptAllDevices: true,
        optionalServices: allServicesNames
    })
    console.log(`[device=${device.name}] connecting to GATT server`)
    const server = await device.gatt.connect()
    console.log(server)

    if (operation === "all-services") {
        console.log(`[device=${device.name}] getting all primary services`)
        // Uncaught (in promise) DOMException: Origin is not allowed to access any service. Tip: Add the service UUID to 'optionalServices' in requestDevice() options. https://goo.gl/HxfxSQ
        const services = await server.getPrimaryServices()
        console.log(services)
        console.log(services.map(s => allServices[s.uuid.toLowerCase()]))
    } else if (operation === "all-chars-of-service") {
        console.log(`[device=${device.name}][service=${serviceName}] getting primary service`)
        const service = await server.getPrimaryService(serviceName)
        console.log(service)
        console.log(`[device=${device.name}][service=${serviceName}] getting all characteristics`)
        const characteristics = await service.getCharacteristics()
        console.log(characteristics)
        console.log(characteristics.map(c => c.properties))
        console.log(characteristics.map(c => allCharacteristics[c.uuid.toLowerCase()]))
        console.log(characteristics.map(c => c.value))
    } else if (operation === "char-of-service") {
        console.log(`[device=${device.name}][service=${serviceName}] getting primary service`)
        const service = await server.getPrimaryService(serviceName)
        console.log(service)
        console.log(`[device=${device.name}][service=${serviceName}][characteristic=${characteristicName}] getting characteristic`)
        const characteristic = await service.getCharacteristic(characteristicName)
        console.log(characteristic)

        const dataView = await characteristic.readValue()
        console.log(dataView)

        const decoder = new TextDecoder()
        const [stringValue, numericValue] = [decoder.decode(dataView.buffer), dataView.getUint8(0)]

        console.log(stringValue, numericValue)
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
