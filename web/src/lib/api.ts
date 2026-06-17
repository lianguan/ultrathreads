const API_BASE = "/api/v1";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") ||
        localStorage.getItem("studentToken")
      : null;

  if (token) {
    headers["Authorization"] = token;
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(body.message || "Request failed", res.status);
  }

  if (res.status === 204) return {} as T;

  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(data) }),

  put: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(data) }),

  patch: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(data) }),

  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),

  upload: <T>(url: string, formData: FormData) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("adminToken") ||
          localStorage.getItem("studentToken")
        : null;
    return fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new ApiError("Upload failed", res.status);
      return res.json() as Promise<T>;
    });
  },
};

export { ApiError };
