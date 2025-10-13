import React from "react";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

export default function Header({ lang }) {
    const algos = [
        {
            key: "greedy",
            title: "Guido",
            hint:
                lang === "de"
                    ? `Guido ist der gierige Veteran der Organisation – er setzt immer auf die Kampagne, die bisher am meisten eingebracht hat, und ignoriert alles andere. Er handelt nach dem Prinzip des Greedy-Algorithmus.  
Um mehr über den Greedy-Algorithmus zu erfahren, drücke <a href="https://en.wikipedia.org/wiki/Greedy_algorithm" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">hier</a>.`
                    : `Guido is the greedy veteran – he always chooses the campaign with the best result so far.  
Learn more about the Greedy algorithm <a href="https://en.wikipedia.org/wiki/Greedy_algorithm" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">here</a>.`,
        },
        {
            key: "e-greedy",
            title: "Emilio",
            hint:
                lang === "de"
                    ? `Emilio ist clever, aber vorsichtig – meistens setzt er auf bewährte Kampagnen, probiert aber hin und wieder zufällig etwas Neues aus, nur um sicherzugehen. Er handelt nach dem Prinzip des Epsilon-Greedy-Algorithmus.  
Um mehr über den Epsilon-Greedy-Algorithmus zu erfahren, drücke <a href="https://www.geeksforgeeks.org/machine-learning/epsilon-greedy-algorithm-in-reinforcement-learning/" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">hier</a>.`
                    : `Emilio is clever but cautious – mostly betting on proven campaigns but sometimes exploring new ones.  
Learn more about the Epsilon-Greedy algorithm <a href="https://www.geeksforgeeks.org/machine-learning/epsilon-greedy-algorithm-in-reinforcement-learning/" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">here</a>.`,
        },
        {
            key: "gradient",
            title: "Giovanni",
            hint:
                lang === "de"
                    ? `Giovanni ist der Stratege – er bewertet jede Kampagne nach ihrem bisherigen Erfolg und passt seine Vorlieben dynamisch an, je nachdem, wie lohnend sie gerade sind. Er handelt nach dem Prinzip des Gradient-Bandit-Algorithmus.  
Um mehr über den Gradient-Bandit-Algorithmus zu erfahren, drücke <a href="https://medium.com/@numsmt2/reinforcement-learning-chapter-2-multi-armed-bandits-part-5-gradient-bandit-algorithms-1af59d4c544c" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">hier</a>.`
                    : `Giovanni is the strategist – dynamically adjusting his preferences based on success.  
Learn more about the Gradient Bandit algorithm <a href="https://medium.com/@numsmt2/reinforcement-learning-chapter-2-multi-armed-bandits-part-5-gradient-bandit-algorithms-1af59d4c544c" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">here</a>.`,
        },
        {
            key: "ucb",
            title: "Umberto",
            hint:
                lang === "de"
                    ? `Umberto ist der Analytiker – er investiert in Kampagnen, die noch nicht oft getestet wurden, wenn sie das Potenzial haben, sich als Goldgrube zu entpuppen. Er handelt nach dem Prinzip des Upper-Confidence-Bound-Algorithmus.  
Um mehr über den Upper-Confidence-Bound-Algorithmus zu erfahren, drücke <a href="https://medium.com/@numsmt2/reinforcement-learning-chapter-2-multi-armed-bandits-part-4-upper-confidence-bound-action-589213a8a722" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">hier</a>.`
                    : `Umberto is the analyst – he explores less-tested campaigns if they seem promising.  
Learn more about the Upper Confidence Bound algorithm <a href="https://medium.com/@numsmt2/reinforcement-learning-chapter-2-multi-armed-bandits-part-4-upper-confidence-bound-action-589213a8a722" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">here</a>.`,
        },
    ];

    return (
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
                {lang === "de" ? "Ein Bandit mit vielen Armen" : "A Bandit With Many Arms"}
            </h1>

            <p
                className="text-muted-foreground mt-2"
                dangerouslySetInnerHTML={{
                    __html:
                        lang === "de"
                            ? `Diese Anwendung behandelt das <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">„Multi-armed bandit“</a>-Problem.`
                            : `This application deals with the <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">“Multi-armed bandit”</a> problem.`,
                }}
            />

            <p className="text-muted-foreground mt-2 whitespace-pre-line">
                {lang === "de"
                    ? "Stell dir vor, du bist ein Mafioso auf Profitjagd und willst mit E-Mail-Phishing-Kampagnen das meiste Geld einsacken.\nJede Kampagne bringt unterschiedlich hohe Erträge. Doch auch andere Mafiosi strecken ihre Finger nach dem Gewinn aus:"
                    : "Imagine you are a mobster on a profit hunt. Each email campaign yields different returns. But other mobsters are also reaching for the loot:"}
            </p>

            <div className="mt-4 flex justify-center gap-3 flex-wrap">
                {algos.map(a => (
                    <HoverCard key={a.key}>
                        <HoverCardTrigger asChild>
                            <Badge variant="secondary" className="uppercase text-xs cursor-pointer">
                                {a.title}
                            </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-72 text-left">
                            <p
                                className="text-sm whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: a.hint }}
                            />
                        </HoverCardContent>
                    </HoverCard>
                ))}
            </div>

            <br />

            <p className="text-muted-foreground whitespace-pre-line">
                {lang === "de"
                    ? "Wer holt am Ende die dickste Beute? Wähle eine Profitart (Verteilungen) und konfiguriere deine Simulation clever,\n um maximalen Profit zu erzielen."
                    : "Who will claim the biggest haul? Choose a reward type (distributions) and configure your simulation wisely to maximize profit."}
            </p>
        </div>
    );
}
