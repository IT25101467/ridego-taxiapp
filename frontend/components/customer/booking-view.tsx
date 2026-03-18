"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useApp } from "@/lib/app-context";
import { Trip, VehicleType } from "@/lib/mock-data";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const RATES: Record<VehicleType, number> = {
  Car: 60,
  Tuk: 35,
  Van: 80,
  Bike: 25,
};

const KM_PRESETS = [3, 5, 10, 15, 20, 30, 50];

const VEHICLE_TYPES: {
  type: VehicleType;
  description: string;
  price: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "Car",
    description: "Comfortable sedan",
    price: "Rs. 60/km",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect x="9" y="11" width="14" height="10" rx="2" />
        <circle cx="12" cy="17" r="1" /><circle cx="20" cy="17" r="1" />
      </svg>
    ),
  },
  {
    type: "Tuk",
    description: "Quick & affordable",
    price: "Rs. 35/km",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="12" height="10" rx="2" />
        <path d="M14 12h4l3 4H14" />
        <circle cx="6" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
      </svg>
    ),
  },
  {
    type: "Van",
    description: "Group travel",
    price: "Rs. 80/km",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="22" height="12" rx="2" />
        <path d="M1 12h22" />
        <circle cx="5" cy="19" r="1.5" /><circle cx="19" cy="19" r="1.5" />
      </svg>
    ),
  },
  {
    type: "Bike",
    description: "Beat the traffic",
    price: "Rs. 25/km",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6h1l2 5.5" /><path d="M9 6l3 5.5H5.5" /><path d="M12 6l2.5 5.5" />
      </svg>
    ),
  },
];

// ── Places Autocomplete Input ──────────────────────────────────────────────────
interface PlacesInputProps {
  value: string;
  onChange: (val: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder: string;
  dotColor: "blue" | "gold";
}

function PlacesInput({ value, onChange, onPlaceSelect, placeholder, dotColor }: PlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    autocompleteRef.current = new placesLib.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address", "name"],
      componentRestrictions: { country: "lk" },
    });
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();
      if (place?.geometry?.location) {
        onChange(place.formatted_address || place.name || "");
        onPlaceSelect(place);
      }
    });
    return () => {
      google.maps.event.clearInstanceListeners(autocompleteRef.current!);
    };
  }, [placesLib, onChange, onPlaceSelect]);

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
        {dotColor === "blue" ? (
          <div className="w-3 h-3 rounded-full border-2 border-primary bg-white" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-accent" />
        )}
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />
    </div>
  );
}

// ── Route renderer (Directions API) ───────────────────────────────────────────
interface RouteRendererProps {
  origin: google.maps.LatLngLiteral | null;
  destination: google.maps.LatLngLiteral | null;
  onDistanceKm: (km: number) => void;
}

function RouteRenderer({ origin, destination, onDistanceKm }: RouteRendererProps) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const computeRoute = useCallback(async () => {
    if (!routesLib || !map || !origin || !destination) return;

    if (!rendererRef.current) {
      rendererRef.current = new routesLib.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#3b6af5",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
      rendererRef.current.setMap(map);
    }

    const service = new routesLib.DirectionsService();
    const result = await service.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    rendererRef.current.setDirections(result);

    const meters = result.routes[0]?.legs[0]?.distance?.value ?? 0;
    onDistanceKm(Math.max(1, Math.round(meters / 1000)));
  }, [routesLib, map, origin, destination, onDistanceKm]);

  useEffect(() => {
    if (origin && destination) {
      computeRoute();
    } else if (rendererRef.current) {
      rendererRef.current.setMap(null);
      rendererRef.current = null;
    }
  }, [origin, destination, computeRoute]);

  return null;
}

// ── Map fitting bounds ─────────────────────────────────────────────────────────
function MapFitBounds({
  pickup,
  dropoff,
}: {
  pickup: google.maps.LatLngLiteral | null;
  dropoff: google.maps.LatLngLiteral | null;
}) {
  const map = useMap();
  const coreMaps = useMapsLibrary("core");

  useEffect(() => {
    if (!map || !coreMaps) return;
    if (pickup && dropoff) {
      const bounds = new coreMaps.LatLngBounds();
      bounds.extend(pickup);
      bounds.extend(dropoff);
      map.fitBounds(bounds, 80);
    } else if (pickup) {
      map.panTo(pickup);
      map.setZoom(14);
    } else if (dropoff) {
      map.panTo(dropoff);
      map.setZoom(14);
    }
  }, [map, coreMaps, pickup, dropoff]);

  return null;
}

// ── Custom pin marker ──────────────────────────────────────────────────────────
function PinMarker({
  position,
  label,
  color,
}: {
  position: google.maps.LatLngLiteral;
  label: string;
  color: "primary" | "accent";
}) {
  return (
    <AdvancedMarker position={position}>
      <div className="flex flex-col items-center">
        <div
          className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white shadow-md mb-1 whitespace-nowrap ${
            color === "primary" ? "bg-primary" : "bg-amber-500"
          }`}
        >
          {label}
        </div>
        <div
          className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
            color === "primary" ? "bg-primary" : "bg-amber-500"
          }`}
        />
        <div
          className={`w-0.5 h-3 ${
            color === "primary" ? "bg-primary" : "bg-amber-500"
          }`}
        />
      </div>
    </AdvancedMarker>
  );
}

// ── Main inner component (needs to be inside APIProvider) ─────────────────────
interface BookingInnerProps {
  onRideRequested: () => void;
}

function BookingInner({ onRideRequested }: BookingInnerProps) {
  const { currentUser, addTrip } = useApp();

  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropoffText] = useState("");
  const [pickupPos, setPickupPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [dropoffPos, setDropoffPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>("Car");
  const [kilometers, setKilometers] = useState(5);
  const [customKm, setCustomKm] = useState("5");
  const [loading, setLoading] = useState(false);

  const effectiveKm = Math.max(1, parseInt(customKm) || 1);
  const estimatedFare = effectiveKm * RATES[selectedVehicle];

  const handlePickupSelect = useCallback((place: google.maps.places.PlaceResult) => {
    const loc = place.geometry!.location!;
    setPickupPos({ lat: loc.lat(), lng: loc.lng() });
  }, []);

  const handleDropoffSelect = useCallback((place: google.maps.places.PlaceResult) => {
    const loc = place.geometry!.location!;
    setDropoffPos({ lat: loc.lat(), lng: loc.lng() });
  }, []);

  const handleDistanceUpdate = useCallback((km: number) => {
    setKilometers(km);
    setCustomKm(String(km));
  }, []);

  async function handleRequest() {
    if (!pickupText || !dropoffText || !currentUser) return;
    const newTrip: Trip = {
      id: "t" + Date.now(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      driverId: null,
      driverName: null,
      pickup: pickupText,
      dropoff: dropoffText,
      vehicleType: selectedVehicle,
      status: "PENDING",
      fare: estimatedFare,
      date: new Date().toISOString(),
      distance: effectiveKm 
    };
    addTrip(newTrip);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRideRequested();
    }, 3000);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse">
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
            <rect x="9" y="11" width="14" height="10" rx="2" />
            <circle cx="12" cy="17" r="1" /><circle cx="20" cy="17" r="1" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">Ride requested. Please wait for driver...</p>
          <p className="text-sm text-muted-foreground mt-1">We are finding the nearest driver for you</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1}}`}</style>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Left: Form */}
      <div className="lg:col-span-2 space-y-5">
        {/* Location inputs */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Trip Details</h3>

          <PlacesInput
            value={pickupText}
            onChange={(v) => { setPickupText(v); if (!v) setPickupPos(null); }}
            onPlaceSelect={handlePickupSelect}
            placeholder="Pickup location"
            dotColor="blue"
          />

          <div className="border-l-2 border-dashed border-border ml-5 h-4" />

          <PlacesInput
            value={dropoffText}
            onChange={(v) => { setDropoffText(v); if (!v) setDropoffPos(null); }}
            onPlaceSelect={handleDropoffSelect}
            placeholder="Drop-off location"
            dotColor="gold"
          />

          {/* Distance */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Distance</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={customKm}
                  onChange={(e) => setCustomKm(e.target.value)}
                  onBlur={() => {
                    const val = Math.max(1, Math.min(999, parseInt(customKm) || 1));
                    setCustomKm(String(val));
                    setKilometers(val);
                  }}
                  className="w-16 px-2 py-1 text-sm text-center rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <span className="text-sm text-muted-foreground font-medium">km</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={effectiveKm > 100 ? 100 : effectiveKm}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setKilometers(val);
                setCustomKm(String(val));
              }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-border"
            />
            <div className="flex flex-wrap gap-1.5">
              {KM_PRESETS.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => { setKilometers(km); setCustomKm(String(km)); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    effectiveKm === km
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle selector */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Choose Vehicle</h3>
          <div className="grid grid-cols-2 gap-2">
            {VEHICLE_TYPES.map((v) => (
              <button
                key={v.type}
                onClick={() => setSelectedVehicle(v.type)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedVehicle === v.type
                    ? "border-primary bg-sidebar-accent"
                    : "border-border hover:border-primary/40 hover:bg-muted"
                }`}
              >
                <span className={selectedVehicle === v.type ? "text-primary" : "text-muted-foreground"}>
                  {v.icon}
                </span>
                <p className={`mt-2 text-sm font-semibold ${selectedVehicle === v.type ? "text-primary" : "text-foreground"}`}>
                  {v.type}
                </p>
                <p className="text-xs text-muted-foreground">{v.description}</p>
                <p className="text-xs font-medium text-accent-foreground mt-0.5 bg-accent/20 inline-block px-1.5 py-0.5 rounded-md">
                  {v.price}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Fare estimate */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Fare Estimate</h3>
            <span className="text-xs text-muted-foreground">Before booking</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Rate ({selectedVehicle})</span>
              <span>Rs. {RATES[selectedVehicle]}/km</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Distance</span>
              <span>{effectiveKm} km</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
              <span>Total</span>
              <span className="text-primary text-base">Rs. {estimatedFare.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleRequest}
          disabled={!pickupText || !dropoffText}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Ride
        </button>
      </div>

      {/* Right: Google Map */}
      <div className="lg:col-span-3">
        <div className="relative rounded-2xl overflow-hidden h-80 lg:h-full min-h-[480px] border border-border">
          <Map
            defaultCenter={{ lat: 6.9271, lng: 79.8612 }}
            defaultZoom={12}
            mapId="ridego-map"
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <MapFitBounds pickup={pickupPos} dropoff={dropoffPos} />
            <RouteRenderer
              origin={pickupPos}
              destination={dropoffPos}
              onDistanceKm={handleDistanceUpdate}
            />
            {pickupPos && (
              <PinMarker position={pickupPos} label="Pickup" color="primary" />
            )}
            {dropoffPos && (
              <PinMarker position={dropoffPos} label="Drop-off" color="accent" />
            )}
          </Map>

          {/* Distance badge */}
          {pickupPos && dropoffPos && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2 shadow-sm flex items-center gap-2 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M3 12h18M13 6l6 6-6 6" />
              </svg>
              <span className="text-xs font-semibold text-foreground">{effectiveKm} km route</span>
            </div>
          )}

          {/* Empty state */}
          {!pickupPos && !dropoffPos && (
            <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2.5 shadow text-center">
                <p className="text-sm text-muted-foreground">Search for locations to see route</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Exported wrapper with APIProvider ─────────────────────────────────────────
interface Props {
  onRideRequested: () => void;
}

export default function BookingView({ onRideRequested }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Book a Ride</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Enter your pickup and drop-off location</p>
      </div>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <BookingInner onRideRequested={onRideRequested} />
      </APIProvider>
    </div>
  );
}
