import axios from "axios";

const api = axios.create({
    baseURL: "/api",
});

export const postsApi = {
    list: () => api.get("/posts/"),

    get: (id) => api.get(`/posts/${id}`),

    create: (data) => api.post("/posts/", data),

    update: (id, data) => api.patch(`/posts/${id}`, data),

    publish: (id) => api.post(`/posts/${id}/publish`),

    remove: (id) => api.delete(`/posts/${id}`),
};

export const aiApi = {
    generate: (data) => api.post("/ai/generate", data),
};

export default api;
