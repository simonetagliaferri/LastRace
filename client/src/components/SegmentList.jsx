import {useState} from "react";
import {Table} from "react-bootstrap";

function SegmentList({segments, selectedSegments, setSelectedSegments}) {
    const [shuffledSegments] = useState(() => shuffleSegments(segments));

    return (
        <div className="table-wrapper">
            <Table className="custom-table segment-table">
                <tbody>
                {shuffledSegments.map(segment => {
                    const key = `${segment.lineId}-${segment.station1Id}-${segment.station2Id}`;
                    const selectedIndex = selectedSegments.findIndex(s => s.key === key);
                    const isSelected = selectedIndex !== -1;
                    const isLast = isSelected && selectedIndex === selectedSegments.length - 1;
                    const onClick = () => {
                        if (!isSelected) {
                            setSelectedSegments([...selectedSegments, {key, ...segment}]);
                        } else if (isLast) {
                            setSelectedSegments(selectedSegments.slice(0, -1));
                        }
                    };
                    return (
                        <SegmentRow key={key}
                                    segment={segment}
                                    isSelected={isSelected}
                                    isLast={isLast}
                                    position={isSelected ? selectedIndex + 1 : null}
                                    onClick={onClick}
                        />
                    );
                })}
                </tbody>
            </Table>
        </div>
    );
}

function SegmentRow({segment, isSelected, isLast, position, onClick}) {
    const [swapStations, setSwapStations] = useState(true);
    const className = isLast ? "last-segment" : isSelected ? "selected-segment locked-segment"  : "segment";

    return (
        <tr className={className} onClick={onClick}>
            <td>{swapStations ? segment.station1Name : segment.station2Name}</td>
            <td>
                <i className="bi bi-arrow-left-right" onClick={(e) => {
                    e.stopPropagation();
                    setSwapStations(!swapStations);
                }}/>
            </td>
            <td>{swapStations ? segment.station2Name : segment.station1Name}</td>
            <td>{position ?? ""}</td>
        </tr>
    );
}

function shuffleSegments(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

export default SegmentList