import React from "react";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ArrowUpRightIcon, UserIcon } from "lucide-react";

/**
 * Header Component
 *
 * Renders the main header for the Multi-Armed Mafia application, including:
 * - Title and descriptive text about the multi-armed bandit problem
 * - Introduction paragraph explaining the gamified scenario
 * - Badges for different bandit algorithms with hoverable cards showing
 *   algorithm information, hints, and links for further reading
 *
 * @component
 *
 * @param {object} props
 * @param {"en"|"de"} props.lang - Language code to render content in English or German
 * @returns {JSX.Element} Rendered header with title, description, and algorithm badges
 */
export default function Header({ lang }) {

    const algos = [
        {
            key: "greedy",
            title: "Guido",
            algoName: "Greedy",
            link: "https://en.wikipedia.org/wiki/Greedy_algorithm",
            hint_de:
                "Guido ist der gierige Veteran – er setzt immer auf die Kampagne, die bisher am meisten eingebracht hat, und ignoriert alles andere.",
            hint_en:
                "Guido is the greedy veteran – he always chooses the campaign with the best result so far.",
        },
        {
            key: "e-greedy",
            title: "Emilio",
            algoName: "Epsilon-Greedy",
            link: "https://www.geeksforgeeks.org/machine-learning/epsilon-greedy-algorithm-in-reinforcement-learning/",
            hint_de:
                "Emilio ist clever, aber vorsichtig – meistens setzt er auf bewährte Kampagnen, probiert aber hin und wieder zufällig etwas Neues aus, nur um sicherzugehen.",
            hint_en:
                "Emilio is clever but cautious – mostly betting on proven campaigns but sometimes exploring new ones.",
        },
        {
            key: "gradient",
            title: "Giovanni",
            algoName: "Gradient Bandit",
            link: "https://medium.com/@numsmt2/reinforcement-learning-chapter-2-multi-armed-bandits-part-5-gradient-bandit-algorithms-1af59d4c544c",
            hint_de:
                "Giovanni ist der Stratege – er bewertet jede Kampagne nach ihrem bisherigen Erfolg und passt seine Vorlieben dynamisch an, je nachdem, wie lohnend sie gerade sind.",
            hint_en:
                "Giovanni is the strategist – dynamically adjusting his preferences based on success.",
        },
        {
            key: "ucb",
            title: "Umberto",
            algoName: "Upper Confidence Bound",
            link: "https://medium.com/@numsmt2/reinforcement-learning-chapter-2-multi-armed-bandits-part-4-upper-confidence-bound-action-589213a8a722",
            hint_de:
                "Umberto ist der Analytiker – er investiert in Kampagnen, die noch nicht oft getestet wurden, wenn sie das Potenzial haben, sich als Goldgrube zu entpuppen.",
            hint_en:
                "Umberto is the analyst – he explores less-tested campaigns if they seem promising.",
        },
    ];

    return (
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
                Multi-Armed Mafia
            </h1>

            <p
                className="text-muted-foreground mt-2"
                dangerouslySetInnerHTML={{
                    __html:
                        lang === "de"
                            ? `Diese Anwendung behandelt das <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank" rel="noopener noreferrer" class="hover:underline">„Multi-armed bandit“</a>-Problem.`
                            : `This application addresses the <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank" rel="noopener noreferrer" class="hover:underline">“Multi-armed bandit”</a> problem.`,
                }}
            />

            <p className="text-muted-foreground mt-2 whitespace-pre-line">
                {lang === "de"
                    ? "Stell dir vor, du bist ein Mafioso auf Profitjagd und willst mit E-Mail-Phishing-Kampagnen das meiste Geld einsacken.\nJede Kampagne bringt unterschiedlich hohe Erträge. Doch auch andere Mafiosi strecken ihre Finger nach dem Gewinn aus:"
                    : "Imagine you're a mafioso on the hunt for profit and want to rake in as much money as possible with email phishing campaigns.\n Each campaign yields different returns. But other mafiosi are also reaching out for the profits:"}
            </p>

            {/* Algorithm Badges with HoverCards */}
            <div className="mt-4 flex justify-center gap-3 flex-wrap">
                {algos.map((a) => (
                    <HoverCard openDelay={300} key={a.key}>
                        <HoverCardTrigger asChild>
                            <Badge variant="secondary" className="uppercase text-xs cursor-pointer">
                                {a.title} ({a.algoName})
                            </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 text-left">
                            <div className="flex justify-between gap-4">
                                <div className="flex items-start">
                                    <div className="bg-muted p-2 rounded-full">
                                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h4 className="text-sm font-semibold">
                                        {a.algoName} {lang === "de" ? "Algorithmus" : "Algorithm"}
                                    </h4>
                                    <p className="text-sm whitespace-pre-line">
                                        {lang === "de" ? a.hint_de : a.hint_en}
                                    </p>
                                    <div className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
                                        <a
                                            href={a.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 hover:underline"
                                        >
                                            {lang === "de" ? "Mehr erfahren" : "Learn more"}
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                ))}
            </div>

            <br />

            <p className="text-muted-foreground whitespace-pre-line">
                {lang === "de"
                    ? "Wer holt am Ende die dickste Beute? Wähle eine Profitart (Verteilung) und setze die Anzahl an Gesamtversuchen und Kampagnen fest. Drücke Start und führe Kampagnen per Klick aus, um maximalen Profit zu erzielen."
                    : "Who will end up with the biggest haul? Choose a profit type (distribution) and set the number of total attempts and campaigns. Press Start and run campaigns with a click to maximize your profits."}
            </p>
        </div>
    );
}
