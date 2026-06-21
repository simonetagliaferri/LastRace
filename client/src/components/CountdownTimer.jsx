import {useState, useEffect, useRef} from 'react';

export default function CountdownTimer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const onTimeUpRef = useRef(onTimeUp);

    useEffect(() => {onTimeUpRef.current = onTimeUp;})
    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUpRef.current();
            return;
        }
        const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft]);

    const isLow = timeLeft <= duration * 0.1;

    return <h2 className={isLow ? "text-danger" : ""}>{`Time: ${timeLeft}`}</h2>;
}