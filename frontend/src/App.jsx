import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PostsPage from "./pages/PostsPage";
import EditorPage from "./pages/EditorPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<PostsPage />} />
                    <Route path="editor/:id" element={<EditorPage />} />
                    <Route path="editor" element={<EditorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
