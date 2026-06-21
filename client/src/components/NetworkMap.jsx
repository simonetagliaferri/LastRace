import { stationLayout, lineColors } from "../mapLayout.js";

function NetworkMap({stations,
                        segments,
                        showLines = true,
                        highlightedSegments = [],
                        startStationId = undefined,
                        endStationId = undefined,
                    }) {
    return (
        <div className="map-wrapper">
            <svg
                className="network-map"
                viewBox="0 0 1050 860"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Network map"
            >
                {showLines &&
                    segments.map((segment) => {
                        const p1 = stationLayout[segment.station1Id];
                        const p2 = stationLayout[segment.station2Id];
                        return (
                            <line
                                key={`${segment.lineId}-${segment.position}`}
                                className="line-segment"
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke={lineColors[segment.lineId]}
                                strokeWidth="9"
                                strokeLinecap="round"
                            />
                        );
                    })}

                {highlightedSegments.map((segment, index) => {
                    const p1 = stationLayout[segment.station1Id];
                    const p2 = stationLayout[segment.station2Id];
                    return (
                        <line
                            key={`highlight-${segment.lineId}-${segment.position}-${index}`}
                            className="line-segment"
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke={lineColors[segment.lineId]}
                            strokeWidth="9"
                            strokeLinecap="round"
                        />
                    );
                })}

                {stations.map((station) => {
                    const point = stationLayout[station.stationId];
                    return (
                        <g key={station.stationId} className="station">
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r={station.isInterchange ? 12 : 8}
                                className={
                                    station.stationId === startStationId ? "station-dot start-station"
                                    : station.stationId === endStationId ? "station-dot end-station"
                                    : station.isInterchange ? "station-dot interchange"
                                    : "station-dot"
                                }
                            />
                        </g>
                    );
                })}

                {stations.map((station) => {
                    const point = stationLayout[station.stationId];
                    return (
                        <g key={`label-${station.stationId}`} className="station-label-group">
                            <text
                                x={point.labelX}
                                y={point.labelY}
                                textAnchor={point.textAnchor}
                                className={
                                    station.stationId === startStationId ? "station-label start-station-label"
                                        : station.stationId === endStationId ? "station-label end-station-label"
                                            : "station-label"
                                }
                            >
                                {station.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default NetworkMap;