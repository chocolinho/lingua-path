import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Topics from "./pages/Topics";
import Vocabularies from "./pages/Vocabularies";
import QuizResults from "./pages/QuizResults";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/topics" element={<Topics />} />
                    <Route path="/vocabularies" element={<Vocabularies />} />
                    <Route path="/quiz" element={<QuizResults />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;