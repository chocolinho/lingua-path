import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PageSkeleton from "./components/PageSkeleton";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Topics = lazy(() => import("./pages/Topics"));
const Vocabularies = lazy(() => import("./pages/Vocabularies"));
const Learn = lazy(() => import("./pages/Learn"));
const QuizPractice = lazy(() => import("./pages/QuizPractice"));
const MyQuizResults = lazy(() => import("./pages/MyQuizResults"));
const LearnTopic = lazy(() => import("./pages/LearnTopic"));
const Achievements = lazy(() => import("./pages/Achievements"));
const ReviewWrongAnswers = lazy(() => import("./pages/ReviewWrongAnswers"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Profile = lazy(() => import("./pages/Profile"));
const Premium = lazy(() => import("./pages/Premium"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Ranking = lazy(() => import("./pages/Ranking"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminTopics = lazy(() => import("./pages/admin/AdminTopics"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageSkeleton />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        element={
                            <AdminRoute>
                                <AdminLayout />
                            </AdminRoute>
                        }
                    >
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/topics" element={<AdminTopics />} />
                        <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    </Route>
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
                        <Route path="/learn/:topicId" element={<LearnTopic />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/review" element={<ReviewWrongAnswers />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/premium" element={<Premium />} />
                        <Route path="/payments" element={<PaymentHistory />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/ranking" element={<Ranking />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
