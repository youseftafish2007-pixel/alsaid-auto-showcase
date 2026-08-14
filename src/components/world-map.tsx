import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import worldTopo from "world-atlas/countries-110m.json";
import { footprint } from "@/lib/companies";

const WIDTH = 1000;
const HEIGHT = 480;

const world = feature(
  worldTopo as never,
  (worldTopo as never as { objects: { countries: never } }).objects.countries,
) as unknown as FeatureCollection<Geometry>;

const projection = geoNaturalEarth1().fitExtent(
  [
    [8, 8],
    [WIDTH - 8, HEIGHT - 8],
  ],
  world,
);
const path = geoPath(projection);

export function WorldMap() {
  return (
    <div className="relative overflow-hidden border border-ink/15 bg-paper-2/50">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Map of Alsaid Group locations across four continents"
      >
        <path
          d={path(geoGraticule10()) ?? undefined}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity={0.07}
          strokeWidth={0.6}
        />
        {world.features.map((f, i) => (
          <path
            key={i}
            d={path(f) ?? undefined}
            fill="color-mix(in oklab, var(--ink) 8%, transparent)"
            stroke="color-mix(in oklab, var(--ink) 22%, transparent)"
            strokeWidth={0.5}
          />
        ))}
        {footprint.map((row) => {
          const p = projection([row.lng, row.lat]);
          if (!p) return null;
          const [x, y] = p;
          return (
            <g key={row.city} className="map-pin">
              <circle cx={x} cy={y} r={12} fill="var(--crimson)" opacity={0.14} className="map-ping" />
              <circle cx={x} cy={y} r={4} fill="var(--crimson)" stroke="var(--paper)" strokeWidth={1.2} />
              <text
                x={x + 9}
                y={y + 3.5}
                fontSize={11}
                fill="var(--ink)"
                className="font-sans"
                style={{ letterSpacing: "0.06em" }}
              >
                {row.city}
              </text>
              <title>{`${row.city} · ${row.region}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
