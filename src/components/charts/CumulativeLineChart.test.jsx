import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import CumulativeLineChart from "./CumulativeLineChart.jsx"

const mockData = {
    manualRewards: [1, 2, 3],
    greedyRewards: [2, 3, 4],
    epsilonGreedyRewards: [3, 4, 5],
}

describe("CumulativeLineChart", () => {
    beforeEach(() => {
        render(<CumulativeLineChart cumulativeRewards={mockData} chosenDistribution="Gaussian" />)
    })

    it("renders the chart title", () => {
        expect(screen.getByText("Cumulative Rewards")).toBeInTheDocument()
    })

    it("renders all legend buttons", () => {
        expect(screen.getByText("Manual")).toBeInTheDocument()
        expect(screen.getByText("Greedy")).toBeInTheDocument()
        expect(screen.getByText("Epsilon-Greedy")).toBeInTheDocument()
    })

    it("toggles line visibility when legend button is clicked", () => {
        const manualButton = screen.getByText("Manual").closest("button")
        expect(manualButton).toHaveStyle({ opacity: "1" })

        fireEvent.click(manualButton)
        expect(manualButton).toHaveStyle({ opacity: "0.3" })

        fireEvent.click(manualButton)
        expect(manualButton).toHaveStyle({ opacity: "1" })
    })
})
