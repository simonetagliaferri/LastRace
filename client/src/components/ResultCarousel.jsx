import NetworkMap from "./NetworkMap.jsx";
import {Card, Carousel} from "react-bootstrap";

export default function ResultCarousel({ stations, segments, startStationId, endStationId, routeWithEvents, score, isNewBestScore, activeIndex, setActiveIndex }) {
    return (
        <Carousel className="custom-carousel"
                  interval={null}
                  wrap={false}
                  activeIndex={activeIndex}
                  onSelect={(idx) => setActiveIndex(idx)}
                  indicators={routeWithEvents.length > 0}
        >
            {routeWithEvents.map(({ segment, event }, idx) => (
                <Carousel.Item key={`${segment.lineId}-${segment.station1Id}-${segment.station2Id}`}>
                    <NetworkMap stations={stations}
                                segments={segments}
                                showLines={false}
                                highlightedSegments={routeWithEvents.slice(0, idx + 1).map(j => j.segment)}
                                startStationId={startStationId}
                                endStationId={endStationId}
                    />
                    <Card className="custom-card">
                        <Card.Body>
                            <Card.Title>{event.name}</Card.Title>
                            <Card.Text>{event.description}</Card.Text>
                            <Card.Text><strong>Effect:</strong> {event.effectValue}</Card.Text>
                        </Card.Body>
                    </Card>
                </Carousel.Item>
            ))}
            <Carousel.Item key="final-summary">
                <NetworkMap stations={stations}
                            segments={segments}
                            showLines={false}
                            highlightedSegments={routeWithEvents.map(j => j.segment)}
                            startStationId={startStationId}
                            endStationId={endStationId}
                />
                <Card className="custom-card--text-center">
                    <Card.Body>
                        <Card.Title>Final Score: {score} coins</Card.Title>
                        <Card.Text>{isNewBestScore ? ("New Best Score!") : ("Keep trying to beat your best score.")}</Card.Text>
                    </Card.Body>
                </Card>
            </Carousel.Item>
        </Carousel>
    )
}