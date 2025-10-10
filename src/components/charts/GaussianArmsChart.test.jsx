import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import GaussianArmsChart from "./GaussianArmsChart.jsx"

const mockGame = {
    gaussianMeans: [100, 200, 300],
}

describe("GaussianArmsChart", () => {
    beforeEach(() => {
        render(<GaussianArmsChart game={mockGame} points={50} normalize={true} sd={50} />)
    })

    it("renders the chart title", () => {
        expect(screen.getByText("Gaussian Arms")).toBeInTheDocument()
    })

    it("renders legend buttons for each arm", () => {
        mockGame.gaussianMeans.forEach((m, idx) => {
            expect(screen.getByText(`No. ${idx + 1} (μ=${m.toFixed(2)})`)).toBeInTheDocument()
        })
    })

    it("toggles line visibility when legend button is clicked", () => {
        const firstButton = screen.getByText(`No. 1 (μ=${mockGame.gaussianMeans[0].toFixed(2)})`).closest("button")
        expect(firstButton).toHaveStyle({ opacity: "1" })

        fireEvent.click(firstButton)
        expect(firstButton).toHaveStyle({ opacity: "0.3" })

        fireEvent.click(firstButton)
        expect(firstButton).toHaveStyle({ opacity: "1" })
    })
})
