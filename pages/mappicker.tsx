import LocationPicker from "@/components/locationPicker";
import { LngLat, LngLatLike } from "mapbox-gl";
import React, { useState } from "react";
const MyPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LngLat>(
    new LngLat(100.48334205798255, 13.768639052886414)
  );

  const handleLocationSelected = (location: LngLat) => {
    setSelectedLocation(location);
  };

  return (
    <div>
      {/* <h1>My Map Test Page</h1> */}
      <div>
        <LocationPicker onLocationSelected={handleLocationSelected} />
      </div>

      {selectedLocation && (
        <div>
          <p>TEST</p>
          <p>{JSON.stringify(selectedLocation)}</p>
        </div>
      )}
    </div>
  );
};

export default MyPage;
