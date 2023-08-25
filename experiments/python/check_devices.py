import bluetooth

print('Scanning for bluetooth devices')

devices = bluetooth.discover_devices(lookup_names=True)
print(f'{len(devices)} devices found')

for addr, name in devices:
    print(addr)
    print(name)

# devices = bluetooth.discover_devices()
# print(f'{len(devices)} devices found')
#
# for addr in devices:
#     name = bluetooth.lookup_name(addr)
#     print(addr)
#     print(name)
