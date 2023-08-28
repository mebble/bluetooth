const services = [
    'generic_access', 
    'generic_attribute', 
    'immediate_alert', 
    'link_loss', 
    'tx_power', 
    'current_time', 
    'reference_time_update', 
    'next_dst_change', 
    'glucose', 
    'health_thermometer', 
    'device_information', 
    'heart_rate', 
    'phone_alert_status', 
    'battery_service', 
    'blood_pressure', 
    'alert_notification', 
    // 'human_interface_device', 
    'scan_parameters', 
    'running_speed_and_cadence', 
    'automation_io', 
    'cycling_speed_and_cadence', 
    'cycling_power', 
    'location_and_navigation', 
    'environmental_sensing', 
    'body_composition', 
    'user_data', 
    'weight_scale', 
    'bond_management', 
    'continuous_glucose_monitoring', 
    'internet_protocol_support', 
    'indoor_positioning', 
    'pulse_oximeter', 
    'http_proxy', 
    'transport_discovery', 
    'object_transfer', 
    'fitness_machine', 
    'mesh_provisioning', 
    'mesh_proxy', 
    'reconnection_configuration'
]

async function doBluetooth() {
    // https://github.com/WebBluetoothCG/registries/blob/master/gatt_assigned_services.txt
    const device = await window.navigator.bluetooth.requestDevice({
        // filters: [{ services: ['battery_service'] }]
        // filters: [{ services }]
        acceptAllDevices: true,
        optionalServices: ['device_information']
    })
    const server = await device.gatt.connect()
    console.log(server)
    const service = await server.getPrimaryService('device_information')
    console.log(service)
    const characteristic = await service.getCharacteristic('manufacturer_name_string')
    console.log(characteristic)
    const manufacturerNameDataView = await characteristic.readValue()
    console.log(manufacturerNameDataView)
    const decoder = new TextDecoder()
    const manufacturerName = decoder.decode(manufacturerNameDataView.buffer)
    console.log(manufacturerName)
    return device
}

const btn = document.querySelector('#search-btn')
btn.addEventListener('click', _event => {
    doBluetooth()
        .then(d => console.log(d))
})

