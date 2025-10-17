import {Card, CardHeader, CardTitle} from "@/components/ui/card.jsx";

export default function WinnerCard({  lang, winner }) {

    const winnerNamesMap = {
        Greedy: "Guido (Greedy)",
        "Epsilon-Greedy": "Emilio (Epsilon-Greedy)",
        "Gradient Bandit": "Giovanni (Gradient Bandit)",
        UCB: "Umberto (UCB)"
    };

    function formatWinners(winners, lang) {
        if (!Array.isArray(winners)) return winnerNamesMap[winners] || winners;

        const mapped = winners.map(w => winnerNamesMap[w] || w);
        if (mapped.length === 1) return mapped[0];
        if (mapped.length === 2) return mapped.join(lang === "de" ? " und " : " and ");
        const last = mapped[mapped.length - 1];
        return mapped.slice(0, -1).join(", ") + (lang === "de" ? " und " : " and ") + last;
    }

    const manualWon = Array.isArray(winner) ? winner.includes("Manual") : winner === "Manual";


    return (
    <Card className="bg-muted/30 border border-muted-foreground/20 text-center">
        <CardHeader>
            <CardTitle className={`text-2xl font-bold ${manualWon ? "text-emerald-500" : "text-red-500"}`}>
                {manualWon ? (
                    lang === "de" ? "Glückwunsch! Du hast gewonnen!" : "Congratulations! You won!"
                ) : (
                    lang === "de" ? (
                        <>Du hast verloren! Der
                            Gewinner{Array.isArray(winner) && winner.length > 1 ? " sind " : " ist "}{formatWinners(winner, lang)}.</>
                    ) : (
                        <>You lost! The
                            winner{Array.isArray(winner) && winner.length > 1 ? "s are " : " is "}{formatWinners(winner, lang)}.</>
                    )
                )}
            </CardTitle>
        </CardHeader>
    </Card>
    )
}