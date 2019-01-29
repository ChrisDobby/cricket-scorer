import { Outcome, DeliveryOutcome } from '../../../domain';

const deliveryDrawCanvas = () => {
    const drawDotBall = (context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.arc(15, 15, 4, 0, 2 * Math.PI);
        context.fill();
    };

    const drawScore = (context: CanvasRenderingContext2D, score: number) => context.fillText(score.toString(), 11, 20);

    const drawByes = (context: CanvasRenderingContext2D, byes: number) => {
        context.beginPath();
        drawScore(context, byes);
        context.moveTo(15, 4);
        context.lineTo(2, 24);
        context.lineTo(28, 24);
        context.lineTo(15, 4);
        context.stroke();
    };

    const drawLegByes = (context: CanvasRenderingContext2D, legByes: number) => {
        context.beginPath();
        drawScore(context, legByes);
        context.moveTo(15, 27);
        context.lineTo(2, 8);
        context.lineTo(28, 8);
        context.lineTo(15, 27);
        context.stroke();
    };

    const drawWide = (context: CanvasRenderingContext2D, wides: number) => {
        const dot = (x: number, y: number) => {
            context.beginPath();
            context.arc(x, y, 2, 0, 2 * Math.PI);
            context.fill();
        };

        const dots = [() => dot(8, 8), () => dot(22, 8), () => dot(22, 22), () => dot(8, 22)];

        context.beginPath();
        context.moveTo(15, 2);
        context.lineTo(15, 28);
        context.moveTo(2, 15);
        context.lineTo(28, 15);
        context.stroke();

        for (let i = 0; i < wides; i += 1) {
            dots[i]();
        }
    };

    const drawRuns = (context: CanvasRenderingContext2D, runs: number) => {
        drawScore(context, runs);
    };

    const drawWicket = (context: CanvasRenderingContext2D) => {
        context.fillText('W', 9, 20);
    };

    const drawNoBallOutline = (context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.arc(15, 15, 14, 0, 2 * Math.PI);
        context.stroke();
    };

    const drawOutcome = (canvas: HTMLCanvasElement | undefined, outcome: Outcome) => {
        if (typeof canvas === 'undefined' || canvas === null) {
            return;
        }
        const context = canvas.getContext('2d');
        if (context === null) {
            return;
        }

        context.fillStyle = '#ffffff';
        context.strokeStyle = '#ffffff';
        context.font = '14px Segoe UI';
        context.lineWidth = 1;

        if (typeof outcome.wicket !== 'undefined') {
            drawWicket(context);
        } else if (typeof outcome.scores.byes !== 'undefined') {
            drawByes(context, outcome.scores.byes);
        } else if (typeof outcome.scores.legByes !== 'undefined') {
            drawLegByes(context, outcome.scores.legByes);
        } else if (outcome.deliveryOutcome === DeliveryOutcome.Wide) {
            drawWide(context, typeof outcome.scores.wides === 'undefined' ? 0 : outcome.scores.wides);
        } else if (typeof outcome.scores.runs !== 'undefined' && outcome.scores.runs > 0) {
            drawRuns(context, outcome.scores.runs);
        } else if (typeof outcome.scores.boundaries !== 'undefined') {
            drawRuns(context, outcome.scores.boundaries);
        } else {
            drawDotBall(context);
        }

        if (outcome.deliveryOutcome === DeliveryOutcome.Noball) {
            drawNoBallOutline(context);
        }
    };

    return { drawOutcome };
};

export default deliveryDrawCanvas();
