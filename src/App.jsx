import './App.css'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from './components/ui/card'

function App() {
    return (
        <div className="bg-background text-foreground flex items-center justify-center">
            <Card className="w-full max-w-5xl max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl rounded-2xl bg-card text-card-foreground p-4">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold">Multi-Armed-Bandit</CardTitle>
                    <CardDescription className="text-gray-400">Konfiguration & Stats</CardDescription>
                </CardHeader>
            </Card>
        </div>

    )
}


export default App
