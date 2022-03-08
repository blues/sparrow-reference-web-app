import NotehubLocation from "./NotehubLocation";

interface NotehubRoutedEvent {
    file: string;
    when: number;
    device: string;

    body: unknown;
    sn: string;

    best_location: string;
    best_lat: number,
    best_lon: number,
    best_country: "US",
    best_timezone: "America/New_York",
    
    best_id: string;
    project: {
        id: string
    }
}

export default NotehubRoutedEvent;
