#### Notehub API Calls
A list of Notehub API calls we will need to make based on the data shown within the [mockup](https://blues-wireless.aha.io/epics/ACCEL-E-10).

- **Get Gateway/Device Info by UID** ([API Doc](https://dev.blues.io/reference/notehub-api/device-api/#get-device-by-uid))
To get information about a Gateway (eg. its name, last seen, location), we can query the Device API using the UID of the Gateway.

  Request:
    ```bash
    curl -X GET \
      -L 'https://api.notefile.net/v1/projects/{projectUID}/devices/{deviceUID}' \
      -H 'X-SESSION-TOKEN: {authToken}'
    ```
  Response:
    ```json
    {
      "uid": "dev:868050040065365",
      "serial_number": "check-print-potato",
      "provisioned": "2021-04-04T17:47:13Z",
      "last_activity": "2021-11-30T18:31:07Z",
      "contact": null,
      "product_uid": "product:net.ozzie.ray:sparrow",
      "fleet_uids": [
        "fleet:15754ed5-0813-433f-a1c9-ff446acccdb9"
      ],
      "tower_info": {
        "mcc": 310,
        "mnc": 410,
        "lac": 1045,
        "cell_id": 16142600
      },
      "tower_location": {
        "when": "2021-11-29T21:51:47Z",
        "name": "Salem MA",
        "country": "US",
        "timezone": "America/New_York",
        "latitude": 42.511987500000004,
        "longitude": -70.910546875
      },
      "gps_location": null,
      "triangulated_location": null,
      "voltage": 4.851,
      "temperature": 34.25
    }
    ```

- **Get Latest Events by Gateway/Device UID** ([API Doc](https://dev.blues.io/reference/notehub-api/event-api/#get-latest-events))
To get a list of Sensors associated with a given Gateway, we can query the Latest Events API endpoint with the Gateway's device UID. This gives us only the most recent events of each particular type, composed of the latest sensor data associated with a particular Gateway. Each event with a name such as `20323746323650020031002f#data.qo"` represents an individual sensor. The portion preceding the `#` is the sensor's MAC address.
  Request:
    ```bash
    curl -X GET \
      -L 'https://api.notefile.net/v1/projects/{projectUID}/devices/{deviceUID}/latest' \
      -H 'X-SESSION-TOKEN: {authToken}'
    ```
  Response:
    ```json
    {
      "latest_events": [
        {
          "file": "20323746323650020031002f#data.qo",
          "captured": "2021-09-28T18:19:32Z",
          "received": "2021-09-28T18:34:24Z",
          "event_uid": "b0dbdb9e-c453-4c88-b0a0-04aa4222cb55",
          "body": {
            "count": 18,
            "sensor": "0F Furnace [87JFH688+2H]"
          }
        },
        {
          "file": "203237463236500200320004#data.qo",
          "captured": "2021-09-28T18:10:14Z",
          "received": "2021-09-28T18:19:24Z",
          "event_uid": "36bfd135-ee62-490f-bf3d-a68ea030ac43",
          "body": {
            "count": 17,
            "sensor": "2F Center Guest Bath [87JFH688+2H]"
          }
        },
        {
          "file": "203237463236500200320044#data.qo",
          "captured": "2021-09-28T18:11:49Z",
          "received": "2021-09-28T18:19:24Z",
          "event_uid": "15228baf-2f53-4b1c-bed9-e79d6b985510",
          "body": {
            "count": 14,
            "sensor": "1F Dining Room [87JFH688+2H]"
          }
        }
      ]
    }
    ```

- **Get Sensor Data/Config** ([API Doc](https://dev.blues.io/reference/notecard-api/note-requests/#note-get))
Once we have a list of sensors attached to a given Gateway, we can retrive the `config.db` or `sensors.db` for any sensor by querying the Note API with the sensor's MAC address.
  Request:
    ```bash
    curl -L 'https://api.notefile.net/req?product={productUID}&device={deviceUID}' \
      -H 'X-SESSION-TOKEN: {authToken}' \
      -d '{"req":"note.get", "file": "config.db", "note": "20323746323650020031002f"}'
    ```
  Response:
    ```json
    {
      "note": "20323746323650020031002f",
      "body": {
        "loc": "87JFH688+2H",
        "name": "0F Furnace"
      },
      "time": 1632763519
    }
    ```
- **Update Sensor Config** ([API Doc](https://dev.blues.io/reference/notecard-api/note-requests/#note-update))
To update the Sensor Location or Name, we query the Note API with the sensor's MAC address and an updated `config.db` body.
  Request:
    ```bash
    curl -L 'https://api.notefile.net/req?product={productUID}&device={deviceUID}' \
      -H 'X-SESSION-TOKEN: {authToken}' \
      -d '{"req":"note.update", "file": "config.db", "note": "20323746323650020031002f","body": {"loc":"87JFH688+2H","name":"0F Furnace"}}'
    ```
  RESPONSE:
    ```json
    {}
    ```

- **Get Gateway Environment Variables** ([API Doc](https://dev.blues.io/reference/notehub-api/environment-variable-api/#get-environment-variables-by-device))

- **Set Gateway Environment Variables** ([API Doc](https://dev.blues.io/reference/notehub-api/environment-variable-api/#set-environment-variables-by-device))

- **Delete Gateway Environment Variables** ([API Doc](https://dev.blues.io/reference/notehub-api/environment-variable-api/#delete-environment-variable-by-device))
