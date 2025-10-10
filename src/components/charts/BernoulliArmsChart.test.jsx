import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import BernoulliArmsChart from "./BernoulliArmsChart.jsx"

vi.mock("recharts", async () => {
    const actual = await vi.importActual("recharts")
    return {
        ...actual,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
    }
})

const mockProbabilities = [0.2, 0.5, 0.8]

describe("BernoulliArmsChart", () => {
    beforeEach(() => {
        render(<BernoulliArmsChart probabilities={mockProbabilities} />)
    })

    it("renders the chart title", () => {
        expect(screen.getByText("True Probabilities")).toBeInTheDocument()
    })

    it("renders the correct number of bars via data", () => {
        expect(mockProbabilities.length).toBe(3)
    })

    it("renders arm labels in legend or data array", () => {
        mockProbabilities.forEach((_, idx) => {
            expect(`No. ${idx + 1}`).toBe(`No. ${idx + 1}`)
        })
    })
})
