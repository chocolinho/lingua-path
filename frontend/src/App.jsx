import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Vocabularies from "./pages/Vocabularies";
import QuizResults from "./pages/QuizResults";
import Learn from "./pages/Learn";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import QuizPractice from "./pages/QuizPractice";
import MyQuizResults from "./pages/MyQuizResults";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/topics" element={<Topics />} />
                    <Route path="/vocabularies" element={<Vocabularies />} />
                    <Route path="/quiz" element={<QuizPractice />} />
                    <Route path="/quiz-results" element={<MyQuizResults />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;