import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { set } from "date-fns";
import { Button } from "antd";

type LocationPickerProps = {
  onLocationSelected: (location: LngLat) => void;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelected,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [toggle, setToggle] = useState<boolean>(true);
  const [btnName, setBtnName] = useState<string>("เลือกตำแหน่ง");
  const [center, setCenter] = useState<LngLatLike>([
    100.48334205798255, 13.768639052886414,
  ]);
  const [zoom, setZoom] = useState<number>(5);
  // const [reMap, setRemap] = useState<boolean>(reinit || false);

  useEffect(() => {
    if (navigator.geolocation && !map && !marker) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter(new mapboxgl.LngLat(longitude, latitude));
        setZoom(9);
      });
    }
  }, [map, marker]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXNraW1vYnVyZ2VyIiwiYSI6ImNrem5vZnoxbzAweG4zMHBpNnJ4bmx3a2oifQ.M5VIVg9xPG8Ky03e6qeYJg";

    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: center, // Initial map center coordinates
        zoom: zoom, // Initial map zoom level
        dragPan: true,
        minZoom: 5,
        maxZoom: 18,
        interactive: true,
        // dragRotate: false,
      });
      mapInstance.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right"
      );
      mapInstance.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
      const markerInstance = new mapboxgl.Marker({
        draggable: false,
      });

      mapInstance.on("render", () => {
        setMap(mapInstance);
        setMarker(markerInstance);
        markerInstance.setLngLat(mapInstance.getCenter()).addTo(mapInstance);
        onLocationSelected(markerInstance.getLngLat());
      });

      mapInstance.on("move", () => {
        markerInstance.setLngLat(mapInstance.getCenter());
      });

      mapInstance.on("moveend", () => {
        onLocationSelected(markerInstance.getLngLat());
      });
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) {
        // map.remove();
      }
    };
  }, [center, map, onLocationSelected, zoom]);

  const switchStyle = (styleUrl: string) => {
    if (map) {
      map.setStyle(styleUrl);
    }
  };

  const toggleMarker = () => {
    // console.log(toggle);
    if (map) {
      if (!toggle) {
        map.scrollZoom.enable();
        map.boxZoom.enable();
        map.dragRotate.enable();
        map.dragPan.enable();
        map.keyboard.enable();
        map.doubleClickZoom.enable();
        map.touchZoomRotate.enable();
        console.log("E");
        setBtnName("เลือกตำแหน่ง");
      } else {
        map.scrollZoom.disable();
        map.boxZoom.disable();
        map.dragRotate.disable();
        map.dragPan.disable();
        map.keyboard.disable();
        map.doubleClickZoom.disable();
        map.touchZoomRotate.disable();
        console.log("D");
        setBtnName("เลือกตำแหน่งแล้ว");
      }
      setToggle(!toggle);
    }
  };

  return (
    <div>
      <div className="button-container-map">
        <Button
          className="button-map "
          onClick={() => switchStyle("mapbox://styles/mapbox/streets-v12")}
        >
          แผนที่
        </Button>
        <Button
          className="button-map"
          style={{marginLeft:'10px'}}
          onClick={() =>
            switchStyle("mapbox://styles/mapbox/satellite-streets-v12")
          }
        >
          ดาวเทียม
        </Button>
        <Button 
        className="button-toggle-map" 
          // className={styles.button_style}
          // className={}
        onClick={toggleMarker}>
          {btnName}
        </Button>
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px" }}
      ></div>
    </div>
  );
};

export default LocationPicker;
