// import H from "@here/maps-api-for-javascript";
//
// export const initializeMap = (mapContainer: HTMLDivElement): H.Map => {
//     const platformInstance = new H.service.Platform({
//         apikey: process.env.VITE_API_KEY || "default-api-key",
//     });
//
//     const baseUrl = "https://js.api.here.com/v3/3.1/styles/omv/oslo/japan/";
//     const customStyle = new H.map.Style(`${baseUrl}normal.day.yaml`, baseUrl);
//
//     const omvService = platformInstance.getOMVService({
//         path: "v2/vectortiles/core/mc",
//     });
//
//     const omvProvider = new H.service.omv.Provider(omvService, customStyle);
//     const customLayer = new H.map.layer.TileLayer(omvProvider, { max: 22 });
//
//     const mapInstance = new H.Map(mapContainer, customLayer, {
//         center: { lat: 35.1709, lng: 136.8815 },
//         zoom: 17,
//     });
//
//     new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
//     H.ui.UI.createDefault(mapInstance, customLayer);
//
//     window.addEventListener("resize", () => mapInstance.getViewPort().resize());
//
//     return mapInstance;
// };
